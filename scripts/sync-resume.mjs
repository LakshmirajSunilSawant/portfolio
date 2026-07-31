/**
 * Syncs a resume PDF into src/data/resume.generated.json (and copies the PDF to
 * public/resume.pdf so the site's Résumé links resolve).
 *
 *   npm run sync:resume -- "path/to/resume.pdf"
 *   npm run sync:resume -- "path/to/resume.pdf" --text   # dump raw text and stop
 *
 * Why a build-time script rather than an upload page: the site is static, so a
 * browser upload has nowhere to persist. It could only write to one visitor's
 * localStorage, which is why the old /admin panel never actually published
 * anything. Running this locally and committing the diff is what reaches people.
 *
 * Parsing a PDF resume is inherently best-effort — the format carries no
 * structure, only visual layout. So this writes a *generated* file that
 * src/data/career.ts overlays with hand-written corrections, exactly like the
 * GitHub sync. Anything the parser gets wrong you fix once in the overlay, and
 * the fix survives every future sync.
 */

import { writeFile, copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const OUT_JSON = resolve(here, '../src/data/resume.generated.json');
const OUT_PDF = resolve(here, '../public/resume.pdf');

/** Section headings we expect, lowercased. Order doesn't matter. */
const SECTIONS = [
    'education',
    'experience',
    'projects',
    'skills',
    'achievements',
    'certificates',
    'certifications',
];

/*
  Layout quirks this parser has to survive, all of them artefacts of how LaTeX
  resumes render rather than anything about the content:

  - Each entry's list bullet lands on its own line, *between* the organisation
    line and the role line. So a lone "•" marks an entry boundary, and the entry
    actually starts on the line before it.
  - "◦" marks a real highlight, and long highlights wrap onto continuation lines
    that carry no marker at all.
  - Superscript ordinals are emitted as a separate line, turning "Ranked 2nd out"
    into "nd" followed by "Ranked 2out".
*/
const ENTRY_MARK = '•';
const HIGHLIGHT_MARK = '◦';
const BULLET = /^[◦•·\-*]\s*/;

/** Horizontal gap, in PDF points, that counts as a column break rather than a space. */
const COLUMN_GAP = 18;

/** Splits a line on detected column breaks. */
const columns = (line) => (line ?? '').split('\t').map((part) => part.trim()).filter(Boolean);

/** Re-attaches superscript ordinals that PDF extraction split onto their own line. */
function repairSuperscripts(lines) {
    const out = [];
    let pending = null;

    for (const line of lines) {
        if (/^(st|nd|rd|th)$/i.test(line)) {
            pending = line;
            continue;
        }
        if (pending) {
            // The space after the digit was consumed by the superscript box.
            out.push(line.replace(/(\d+)(?=[A-Za-z])/, `$1${pending} `));
            pending = null;
            continue;
        }
        out.push(line);
    }
    return out;
}

/** Splits a comma list without breaking inside parentheses — "AWS(EC2, IAM)". */
function splitList(text) {
    const items = [];
    let depth = 0;
    let buffer = '';

    for (const char of text) {
        if (char === '(') depth += 1;
        if (char === ')') depth -= 1;
        if (char === ',' && depth <= 0) {
            items.push(buffer.trim());
            buffer = '';
        } else {
            buffer += char;
        }
    }
    items.push(buffer.trim());
    return items.filter(Boolean);
}

/** Bullet list where unmarked lines continue the item above. */
function parseBulletList(lines) {
    const items = [];
    for (const raw of lines) {
        const line = raw.replace(/\t/g, ' ').trim();
        if (!line || line === ENTRY_MARK) continue;

        if (BULLET.test(line)) {
            items.push(stripBullet(line));
        } else if (items.length > 0) {
            items[items.length - 1] += ` ${line}`;
        }
    }
    return items;
}

async function extractLines(pdfPath) {
    // The legacy build is the one that runs outside a browser.
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const data = new Uint8Array(require('node:fs').readFileSync(pdfPath));
    const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;

    const lines = [];
    for (let pageNo = 1; pageNo <= doc.numPages; pageNo += 1) {
        const page = await doc.getPage(pageNo);
        const content = await page.getTextContent();

        // Group text items into visual lines by their y coordinate, then sort
        // each line left-to-right. PDF text order is not reading order.
        const rows = new Map();
        for (const item of content.items) {
            if (!item.str) continue;
            const y = Math.round(item.transform[5]);
            const key = [...rows.keys()].find((k) => Math.abs(k - y) <= 2) ?? y;
            if (!rows.has(key)) rows.set(key, []);
            rows.get(key).push({ x: item.transform[4], width: item.width ?? 0, str: item.str });
        }

        [...rows.entries()]
            .sort((a, b) => b[0] - a[0])
            .forEach(([, parts]) => {
                // Resumes right-align location and dates into a second column.
                // pdf.js renders that gap as a single whitespace item whose width
                // spans the whole run, so a wide blank item is the column break.
                const text = parts
                    .sort((a, b) => a.x - b.x)
                    .map((part) =>
                        part.str.trim() === '' && part.width > COLUMN_GAP ? '\t' : part.str,
                    )
                    .join('');

                const cleaned = text.replace(/[ ]{2,}/g, ' ').trim();
                if (cleaned) lines.push(cleaned);
            });
    }
    return lines;
}

/** Splits the flat line list into { sectionName: lines[] }. */
function splitSections(lines) {
    const out = { header: [] };
    let current = 'header';

    for (const line of lines) {
        const normalised = line.toLowerCase().replace(/[^a-z]/g, '');
        if (SECTIONS.includes(normalised) && line.length < 20) {
            current = normalised === 'certifications' ? 'certificates' : normalised;
            out[current] = [];
            continue;
        }
        (out[current] ??= []).push(line);
    }
    return out;
}

const isBullet = (line) => BULLET.test(line);
const stripBullet = (line) => line.replace(BULLET, '').trim();

/**
 * Entries look like:
 *   <Organisation>  <Location>
 *   •                          <- boundary marker, on its own line
 *   <Role>  <Dates>
 *   ◦ highlight…
 *     …wrapped continuation
 *
 * Location and dates are right-aligned, so they land at the end of their line.
 */
function parseEntries(lines) {
    const clean = lines.map((line) => line.trim()).filter(Boolean);

    // Each lone "•" is preceded by the line that actually opens the entry.
    const starts = clean.reduce((acc, line, index) => {
        if (line === ENTRY_MARK && index > 0) acc.push(index - 1);
        return acc;
    }, []);

    return starts.map((start, position) => {
        const end = position + 1 < starts.length ? starts[position + 1] : clean.length;
        const block = clean.slice(start, end).filter((line) => line !== ENTRY_MARK);

        const highlights = [];
        let metaLine = null;

        for (const line of block.slice(1)) {
            if (line.startsWith(HIGHLIGHT_MARK)) {
                highlights.push(stripBullet(line).replace(/\t/g, ' '));
            } else if (highlights.length > 0) {
                highlights[highlights.length - 1] += ` ${line.replace(/\t/g, ' ')}`;
            } else if (metaLine === null) {
                metaLine = line;
            } else {
                metaLine += ` ${line}`;
            }
        }

        return { titleLine: block[0], metaLine, highlights };
    });
}

/** Pulls a trailing date range like "June 2025 – Sept 2025 & Jan 2026 – Jun 2026". */
function splitTrailingDates(line) {
    if (!line) return { text: line, dates: null };
    const match = line.match(
        /((?:[A-Z][a-z]{2,8}\.?\s*)?\d{4}\s*[–\-—]\s*(?:[A-Z][a-z]{2,8}\.?\s*)?(?:\d{4}|Present|Now)(?:\s*&\s*(?:[A-Z][a-z]{2,8}\.?\s*)?\d{4}\s*[–\-—]\s*(?:[A-Z][a-z]{2,8}\.?\s*)?(?:\d{4}|Present|Now))*)\s*$/,
    );
    if (!match) return { text: line.trim(), dates: null };
    return { text: line.slice(0, match.index).trim(), dates: match[1].trim() };
}

/** Splits "Skills" lines shaped as "• Category: a, b, c", honouring wrapped lines. */
function parseSkills(lines) {
    const groups = [];

    for (const raw of lines) {
        const line = raw.replace(/\t/g, ' ').trim();
        if (!line) continue;

        const bulleted = BULLET.test(line);
        const body = stripBullet(line);
        const match = body.match(/^([^:]{2,40}):\s*(.+)$/);

        if (bulleted && match) {
            groups.push({ label: match[1].trim(), items: splitList(match[2]) });
        } else if (groups.length > 0) {
            groups[groups.length - 1].items.push(...splitList(body));
        }
    }
    return groups;
}

function parseHeader(lines) {
    const joined = lines.join(' ').replace(/\t/g, ' ');
    return {
        name: columns(lines[0])[0] ?? null,
        location: columns(lines[1])[0] ?? null,
        email: joined.match(/[\w.+-]+@[\w.-]+\.\w+/)?.[0] ?? null,
        phone: joined.match(/\+\d[\d\s-]{7,}\d/)?.[0]?.trim() ?? null,
    };
}

async function main() {
    const [pdfArg, ...flags] = process.argv.slice(2);
    if (!pdfArg) {
        console.error('Usage: npm run sync:resume -- "path/to/resume.pdf" [--text]');
        process.exit(1);
    }

    const pdfPath = resolve(process.cwd(), pdfArg);
    const lines = repairSuperscripts(await extractLines(pdfPath));

    if (flags.includes('--text')) {
        console.log(lines.join('\n'));
        return;
    }

    const sections = splitSections(lines);

    const payload = {
        sourceFile: pdfArg,
        parsedAt: new Date().toISOString(),
        profile: parseHeader(sections.header ?? []),
        education: parseEntries(sections.education ?? []).map((entry) => {
            const [institution, location] = columns(entry.titleLine);
            const [qualification, dates] = columns(entry.metaLine);
            return {
                institution: institution ?? null,
                location: location ?? null,
                qualification: qualification ?? null,
                period: dates ?? splitTrailingDates(qualification ?? '').dates,
                notes: entry.highlights,
            };
        }),
        experience: parseEntries(sections.experience ?? []).map((entry) => {
            const [company, location] = columns(entry.titleLine);
            const [title, dates] = columns(entry.metaLine);
            return {
                company: company ?? null,
                location: location ?? null,
                title: title ?? null,
                period: dates ?? splitTrailingDates(title ?? '').dates,
                highlights: entry.highlights,
            };
        }),
        projects: parseEntries(sections.projects ?? []).map((entry) => ({
            title: (columns(entry.titleLine)[0] ?? '').replace(/\s*\[Link\]\s*$/, '').trim(),
            stack: splitList((columns(entry.metaLine)[0] ?? '').replace(/^Tech Stack:\s*/i, '')),
            highlights: entry.highlights,
        })),
        skills: parseSkills(sections.skills ?? []),
        achievements: parseBulletList(sections.achievements ?? []),
        certificates: parseBulletList(sections.certificates ?? []).map((line) => {
            const cleaned = line.replace(/\s*View Certificate\s*$/i, '').trim();
            const match = cleaned.match(/^(.*?)\s*\(([^)]+)\)$/);
            return match
                ? { name: match[1].trim(), issuer: match[2].trim() }
                : { name: cleaned, issuer: null };
        }),
    };

    await writeFile(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

    await mkdir(dirname(OUT_PDF), { recursive: true });
    await copyFile(pdfPath, OUT_PDF);

    console.log('Parsed from', pdfArg);
    console.log(`  profile      ${payload.profile.name ?? '—'} · ${payload.profile.email ?? '—'}`);
    console.log(`  education    ${payload.education.length}`);
    console.log(`  experience   ${payload.experience.length}`);
    console.log(`  projects     ${payload.projects.length}`);
    console.log(`  skills       ${payload.skills.length} groups`);
    console.log(`  achievements ${payload.achievements.length}`);
    console.log(`  certificates ${payload.certificates.length}`);
    console.log('\nWrote src/data/resume.generated.json and public/resume.pdf');
    console.log('Review with: git diff src/data/ && npm run build');
}

main().catch((error) => {
    console.error(`\nResume sync failed: ${error.message}`);
    process.exit(1);
});
