/**
 * Syncs public GitHub repositories into src/data/github.generated.json.
 *
 * Run with `npm run sync:github` whenever you ship a new repo. This is a
 * build-time fetch on purpose: the unauthenticated GitHub API allows 60
 * requests/hour *per client IP*, so fetching at runtime would rate-limit real
 * visitors and put a loading state in front of the projects section.
 *
 * Set GITHUB_TOKEN in the environment to raise the rate limit if you hit it.
 */

import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const USER = 'LakshmirajSunilSawant';

/** Repos that should never appear as portfolio projects. */
const EXCLUDED = new Set([
    'portfolio', // this site
    USER,        // GitHub profile README repo
]);

/** Languages that describe tooling noise rather than a project's stack. */
const IGNORED_LANGUAGES = new Set([
    'CSS', 'HTML', 'SCSS', 'Makefile', 'Shell', 'PowerShell', 'Batchfile', 'Procfile',
]);

const outFile = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/github.generated.json');

const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function api(path) {
    const res = await fetch(`https://api.github.com${path}`, { headers });
    if (!res.ok) {
        throw new Error(`GitHub API ${res.status} ${res.statusText} for ${path}`);
    }
    return res.json();
}

/**
 * Turns GitHub's byte-count language map into an ordered stack list, dropping
 * styling/scripting noise and normalising Dockerfile -> Docker.
 */
function stackFromLanguages(languages) {
    return Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .map(([name]) => (name === 'Dockerfile' ? 'Docker' : name))
        .filter((name) => !IGNORED_LANGUAGES.has(name))
        .slice(0, 6);
}

async function main() {
    const repos = await api(`/users/${USER}/repos?per_page=100&sort=pushed`);

    const kept = repos.filter((repo) => !repo.fork && !repo.archived && !EXCLUDED.has(repo.name));

    const entries = [];
    for (const repo of kept) {
        const languages = await api(`/repos/${USER}/${repo.name}/languages`);
        entries.push({
            name: repo.name,
            description: repo.description?.trim() || null,
            language: repo.language,
            stack: stackFromLanguages(languages),
            topics: repo.topics ?? [],
            stars: repo.stargazers_count,
            homepage: repo.homepage?.trim() || null,
            url: repo.html_url,
            pushedAt: repo.pushed_at,
        });
        console.log(`  ${repo.name.padEnd(32)} ${stackFromLanguages(languages).join(', ')}`);
    }

    const payload = {
        user: USER,
        fetchedAt: new Date().toISOString(),
        repos: entries,
    };

    await writeFile(outFile, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    console.log(`\nWrote ${entries.length} repos (of ${repos.length} fetched) to src/data/github.generated.json`);
}

main().catch((error) => {
    console.error(`\nSync failed: ${error.message}`);
    console.error('The existing github.generated.json was left untouched.');
    process.exit(1);
});
