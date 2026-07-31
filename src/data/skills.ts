/**
 * Skills come in two shapes.
 *
 * The complete taxonomy is read from the resume (see `career.ts`) and rendered
 * as text — that's the authoritative list, and it updates itself on every
 * `npm run sync:resume`.
 *
 * `fieldSkills` below is the curated subset that floats in the icon field: only
 * technologies with a recognisable logo, since "REST APIs" or "System Design"
 * have nothing to draw. Icons are imported individually so Rollup can
 * tree-shake the rest of the ~3,000-icon set out of the bundle. A skill with
 * `path: null` falls back to a typeset monogram.
 */

import {
    siApacheairflow,
    siApacheflink,
    siApachekafka,
    siC,
    siCplusplus,
    siDocker,
    siDuckdb,
    siFastapi,
    siGit,
    siGithubactions,
    siGrafana,
    siJavascript,
    siKubernetes,
    siMlflow,
    siNextdotjs,
    siOllama,
    siOpenjdk,
    siPostgresql,
    siPostman,
    siPrometheus,
    siPython,
    siReact,
    siSqlite,
    siSupabase,
    siTailwindcss,
    siTensorflow,
    siTypescript,
} from 'simple-icons';

export interface Skill {
    name: string;
    /** SVG path data on a 24×24 viewBox, or null to fall back to a monogram. */
    path: string | null;
    /** Brand hex without the leading '#'. Used only on hover. */
    hex: string | null;
}

const icon = (source: { path: string; hex: string }, name: string): Skill => ({
    name,
    path: source.path,
    hex: source.hex,
});

/** Kept in rough "language → framework → data → ML → infra" order. */
export const fieldSkills: Skill[] = [
    icon(siPython, 'Python'),
    icon(siTypescript, 'TypeScript'),
    icon(siJavascript, 'JavaScript'),
    icon(siOpenjdk, 'Java'),
    icon(siCplusplus, 'C++'),
    icon(siC, 'C'),

    icon(siFastapi, 'FastAPI'),
    icon(siReact, 'React'),
    icon(siNextdotjs, 'Next.js'),
    icon(siTailwindcss, 'Tailwind CSS'),
    icon(siPostman, 'Postman'),

    icon(siPostgresql, 'PostgreSQL'),
    icon(siSupabase, 'Supabase'),
    icon(siSqlite, 'SQLite'),
    icon(siDuckdb, 'DuckDB'),

    icon(siTensorflow, 'TensorFlow'),
    icon(siOllama, 'Ollama'),
    icon(siMlflow, 'MLflow'),

    icon(siDocker, 'Docker'),
    icon(siKubernetes, 'Kubernetes'),
    icon(siApachekafka, 'Kafka'),
    icon(siApacheflink, 'Flink'),
    icon(siApacheairflow, 'Airflow'),
    icon(siGit, 'Git'),
    icon(siGithubactions, 'GitHub Actions'),
    icon(siPrometheus, 'Prometheus'),
    icon(siGrafana, 'Grafana'),
];
