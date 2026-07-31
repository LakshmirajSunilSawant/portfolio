# Portfolio

Personal site for Lakshmiraj Sunil Sawant. Vite + React + TypeScript + Tailwind, deployed on Vercel.

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # typecheck + production build
npm run lint

npm run sync:github               # refresh projects from GitHub
npm run sync:resume -- <pdf>      # refresh experience/education/skills from a resume PDF
```

## Editing content

All copy lives in `src/data/`. No component needs touching to update the site.

| File | Holds |
|---|---|
| `site.ts` | Name, intro, availability line, email, social links, résumé path, section list |
| `career.ts` | Overlay + derived shapes on top of the parsed resume |
| `projects.ts` | Which projects are featured, plus hand-written copy per repo |
| `skills.ts` | The icon subset that floats in the skills field |
| `resume.generated.json` | **Generated — do not edit.** Written by `npm run sync:resume` |
| `github.generated.json` | **Generated — do not edit.** Written by `npm run sync:github` |

### Resume

```bash
npm run sync:resume -- "~/Downloads/resume.pdf"
npm run sync:resume -- "~/Downloads/resume.pdf" --text   # dump extracted text and stop
```

This extracts the PDF's text, parses it into experience, education, skills,
achievements and certificates, writes `src/data/resume.generated.json`, and
copies the PDF to `public/resume.pdf` so the Résumé links resolve. Review the
diff and commit.

It runs at build time rather than as an upload page for a structural reason: the
site is static, so a browser upload has nowhere to persist. It could only write
to one visitor's `localStorage` — which is why the old `/admin` panel never
actually published anything.

PDF parsing is best-effort, because the format carries visual layout rather than
structure. The parser handles the quirks of a LaTeX resume — right-aligned
columns detected by gap width, bullets that land on their own line, wrapped
continuation lines, superscript ordinals split off (`2` + `nd`) — but anything it
gets wrong should be corrected in the `roleOverrides` map in `career.ts`, not in
the generated file. Overlay edits survive every future sync.

The hero's status line is derived from the most recent role, so it can't go stale
on its own. Set `site.status.text` to a string to override it.

### Projects

Project cards are GitHub metadata plus hand-written copy. `npm run sync:github`
rewrites `github.generated.json` with every public, non-fork repo; the `curation`
map in `projects.ts` overlays a better title, blurb and tech stack per repo and
survives every re-sync. A repo with no curation entry still renders, falling back
to its GitHub description and detected languages.

- Reorder the featured row by editing the `featured` array.
- Hide a repo with `hidden: true` in its curation entry.
- Set `GITHUB_TOKEN` in the environment if you ever hit the API rate limit.

The sync runs at build time rather than in the browser: the unauthenticated
GitHub API allows 60 requests/hour *per client IP*, so a runtime fetch would
rate-limit real visitors and put a spinner in front of the projects section.

### Résumé

The header, footer and contact section link to `public/resume.pdf`. Drop the file
there, or set `resumeUrl: null` in `site.ts` to hide those links.

## Design notes

- **Palette** — "Ink & Ember": warm near-black / warm paper, burnt-orange accent.
  Defined as CSS custom properties in `index.css` and exposed to Tailwind as
  `paper`, `surface`, `line`, `ink`, `muted`, `ember`. The accent shifts between
  themes rather than inverting, so both states are deliberately designed.
- **Type** — Instrument Serif (display), Inter Tight (body), JetBrains Mono
  (indices, labels, tags). Self-hosted via `@fontsource`, Latin subsets only.
- **Theme** — dark by default, respecting `prefers-color-scheme` and remembering
  the choice. An inline script in `index.html` applies it before first paint to
  avoid a flash; that script must stay render-blocking.
- **Motion** — one mechanic throughout: content slides up from behind a clip
  mask (`components/Reveal.tsx`). Everything respects `prefers-reduced-motion`.

### The one motion gotcha

In `Reveal`, the viewport trigger lives on the **mask**, never on the masked
element. An element translated `110%` down sits entirely outside its
`overflow-hidden` parent, and IntersectionObserver intersects a target's rect
with its ancestors' clip rects — so a masked element reports
`isIntersecting: false` forever and never animates in. Above-the-fold content
additionally uses `immediate`, which animates on mount instead of on scroll, so
crawlers and link-preview bots that never fire an observer still see the hero.
