/**
 * Roles, schooling and awards — driven by the resume.
 *
 * `resume.generated.json` is rewritten by `npm run sync:resume -- <pdf>` and
 * should not be edited by hand. PDF parsing is best-effort, so anything the
 * parser gets wrong (or that reads better rewritten) goes in the overlays
 * below, keyed by company or institution. Those edits survive every re-sync.
 */

import resume from './resume.generated.json';

export interface Role {
    title: string;
    company: string;
    period: string;
    location: string;
    highlights: string[];
}

export interface Study {
    institution: string;
    qualification: string;
    period: string;
    result: string;
}

export interface Certificate {
    name: string;
    issuer: string | null;
}

/**
 * Per-company corrections. Any field left out falls through to the resume.
 * These two rewrite the resume's em-dashed bullets into plainer punctuation for
 * the web; the resume itself is unchanged.
 */
const roleOverrides: Record<string, Partial<Role>> = {
    'Cellcomm Solutions': {
        highlights: [
            'Migrated platform storage from JSON files to SQLite, achieving 99% faster data loads (0.002s) and implementing automated, metadata-tracked backups for full recovery coverage, on an open-source stack that keeps infrastructure costs near zero.',
        ],
    },
    'Sakhatech Information Systems': {
        highlights: [
            'Enhanced model accuracy by 18% through end-to-end ML pipeline development, covering data preprocessing, feature engineering, and model training in Python with production-level tuning and cross-functional experimentation.',
        ],
    },
};

/**
 * LaTeX emits both quotes in a pair as closing quotes, so titles arrive as
 * ”like this”. Flip the leading one back.
 */
const tidyQuotes = (text: string) => text.replace(/”([^”]*)”/g, '“$1”');

/**
 * Schooling the one-page resume no longer lists. Kept because dropping it is a
 * content decision, not a parsing one — delete these two if you'd rather the
 * education list stop at the degree.
 */
const priorEducation: Study[] = [
    {
        institution: 'PACE Junior College',
        qualification: 'Pre-University Education',
        period: '2020 — 2022',
        result: '75%',
    },
    {
        institution: 'Don Bosco High School',
        qualification: 'High School',
        period: '2013 — 2020',
        result: '89%',
    },
];

/** En dashes from LaTeX read better as em-dash-spaced ranges on screen. */
const tidyPeriod = (period: string | null) => (period ?? '').replace(/\s*–\s*/g, ' — ');

export const roles: Role[] = resume.experience.map((entry) => ({
    title: entry.title ?? '',
    company: entry.company ?? '',
    period: tidyPeriod(entry.period),
    location: entry.location ?? '',
    highlights: entry.highlights,
    ...roleOverrides[entry.company ?? ''],
}));

export const education: Study[] = [
    ...resume.education.map((entry) => {
        // "Bachelor of Technology - Computer Science; CGPA: 9.68"
        const [qualification, result] = (entry.qualification ?? '').split(';');
        return {
            institution: entry.institution ?? '',
            qualification: (qualification ?? '').replace(/^Bachelor of Technology\s*-\s*/, 'B.Tech, ').trim(),
            period: tidyPeriod(entry.period),
            result: (result ?? '').replace(':', '').trim(),
        };
    }),
    ...priorEducation,
];

export const achievements: string[] = resume.achievements.map(tidyQuotes);

export const certificates: Certificate[] = resume.certificates;

/** Full skills taxonomy, straight from the resume — shown as text beside the icon field. */
export const skillTaxonomy = resume.skills;

/** The most recent role, used for the hero status line. */
export const currentRole = roles[0];
