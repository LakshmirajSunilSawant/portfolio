/**
 * Projects = GitHub metadata (synced) + hand-written copy (this file).
 *
 * `github.generated.json` is rewritten by `npm run sync:github` and should not
 * be edited by hand. Anything you want to say better than the repo says it goes
 * in `curation` below, keyed by repo name — those edits survive every re-sync.
 *
 * A repo with no entry here still renders; it just falls back to its GitHub
 * description and detected language stack.
 */

import generated from './github.generated.json';

export interface Curation {
    /** Display title, when the repo name isn't presentable. */
    title?: string;
    /** One or two punchy sentences. Overrides the GitHub description. */
    blurb?: string;
    /** The real stack, which language detection alone can't see (Kafka, Ollama, …). */
    stack?: string[];
    /** Live deployment, if GitHub's homepage field isn't set. */
    demo?: string;
    /** Hide from the site without deleting the repo. */
    hidden?: boolean;
}

/** Repo names, in the order they appear in the featured row. First one spans wide. */
/** Matches the three projects on the resume. Swap freely — it's just an order. */
export const featured = [
    'InferStream',
    'AI-powered-DevOps-Assistant',
    'tax-assistant',
];

export const curation: Record<string, Curation> = {
    InferStream: {
        title: 'InferStream',
        blurb:
            'Ingests 100 tick events a second across 7 symbols and turns them into predictions at under 100ms p99. PyFlink computes VWAP, momentum and volatility in sliding windows; Feast serves the same definitions to training and inference so the two cannot drift apart; Airflow retrains nightly while Evidently checks for drift hourly.',
        stack: ['Kafka', 'PyFlink', 'Feast', 'MLflow', 'Airflow', 'Docker'],
    },
    'AI-powered-DevOps-Assistant': {
        title: 'AntiGravity',
        blurb:
            'Predicts Kubernetes incidents five minutes before they land with an LSTM at 75% accuracy, traces the root cause through rule-based analysis, then executes remediation (pod restarts, autoscaling) without waiting for a human.',
        stack: ['Python', 'FastAPI', 'Kubernetes', 'Prometheus', 'Next.js', 'Docker'],
    },
    'VectorShift-Assignment': {
        hidden: true,
        title: 'Pipeline Builder',
        blurb:
            'A node-based pipeline editor built on the bet that most node types are data, not code, so adding one touches a single registry file. React Flow on the canvas, FastAPI behind it validating DAGs, streaming execution, and generating whole graphs from a plain-English prompt.',
        stack: ['React', 'FastAPI', 'Python', 'Zustand', 'Docker'],
    },
    'onecommand-trader': {
        title: 'OneCommand Trader',
        blurb:
            'Trade by typing what you mean. "Buy 10 Apple stocks" goes through Gemini and comes out an executed order, across both US and Indian markets, with portfolio tracking and ML price predictions attached.',
        stack: ['Python', 'FastAPI', 'React', 'PostgreSQL', 'Redis', 'Docker'],
    },
    'ca-pro-manager': {
        title: 'CA Pro Manager',
        blurb:
            'Practice management for chartered accountants: client records, filing status tracking, and a per-client tax assistant running Llama 3.2 locally through Ollama. Go API, Next.js 15 client.',
        stack: ['Go', 'Next.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Ollama'],
    },
    'tax-assistant': {
        title: 'TaxSmart AI',
        blurb:
            'Walks Indian taxpayers through filing: picks the right ITR form from your income sources, surfaces the deductions you qualify for, compares old regime against new, and catches errors before submission. Runs locally, so there is no per-query API bill.',
        stack: ['Next.js', 'TypeScript', 'FastAPI', 'Python', 'Ollama', 'Supabase'],
    },
    'VoltScan-MIL': {
        title: 'VoltScan',
        blurb:
            'Finds defects in photovoltaic cells while training on module-level labels only, with no pixel annotations. Vision Transformer features feed attention-based multi-instance learning for localisation, and Grad-CAM heatmaps explain every call.',
        stack: ['Python', 'Vision Transformers', 'FastAPI', 'React', 'Hugging Face'],
    },
    'selenium-elpais-browserstack': {
        hidden: true,
        title: 'El País Scraper',
        blurb:
            'Scrapes and translates El País opinion headlines, counts the words that keep recurring across them, then replays the entire pipeline on BrowserStack across five parallel desktop and mobile sessions.',
        stack: ['Python', 'Selenium', 'BrowserStack'],
    },
    'Leet-and-GFG': {
        hidden: true,
        title: 'Leet & GFG',
        // NOTE: this repo has no README and no GitHub description — blurb inferred
        // from the file contents. Rewrite it if it misses the mark.
        blurb:
            'A running record of data structures and algorithms practice: worked solutions to LeetCode and GeeksforGeeks problems in Python and Java.',
        stack: ['Python', 'Java', 'Algorithms'],
    },
};

export interface Project {
    name: string;
    title: string;
    blurb: string;
    stack: string[];
    repoUrl: string;
    demoUrl: string | null;
    stars: number;
    year: string;
    isFeatured: boolean;
}

function toProject(repo: (typeof generated.repos)[number]): Project {
    const edit = curation[repo.name] ?? {};
    return {
        name: repo.name,
        title: edit.title ?? repo.name,
        blurb: edit.blurb ?? repo.description ?? 'No description yet.',
        stack: edit.stack ?? repo.stack,
        repoUrl: repo.url,
        demoUrl: edit.demo ?? repo.homepage,
        stars: repo.stars,
        year: repo.pushedAt.slice(0, 4),
        isFeatured: featured.includes(repo.name),
    };
}

const all: Project[] = generated.repos
    .filter((repo) => !curation[repo.name]?.hidden)
    .map(toProject);

/** Featured projects, in the order given by `featured`. */
export const featuredProjects: Project[] = featured
    .map((name) => all.find((project) => project.name === name))
    .filter((project): project is Project => Boolean(project));

/** Everything else, most recently pushed first (the sync already sorts by push date). */
export const otherProjects: Project[] = all.filter((project) => !project.isFeatured);

/** Every distinct technology across the non-featured projects, for the filter row. */
export const archiveFilters: string[] = [
    ...new Set(otherProjects.flatMap((project) => project.stack)),
].sort((a, b) => a.localeCompare(b));

export const syncedAt = generated.fetchedAt;
