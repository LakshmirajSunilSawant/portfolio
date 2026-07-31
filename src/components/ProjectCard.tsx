import { ArrowUpRight, Github, Star } from 'lucide-react';
import type { Project } from '../data/projects';
import { cn } from '../lib/cn';

/**
 * One card, two densities. `wide` is used by the first featured project, which
 * spans two grid columns — it gets a serif display title and full blurb; the
 * rest stay compact so the row still reads as a set.
 */
export const ProjectCard = ({ project, wide = false }: { project: Project; wide?: boolean }) => {
    const primaryHref = project.demoUrl ?? project.repoUrl;

    return (
        <article
            className={cn(
                'group relative flex flex-col border-t border-line pt-6 transition-colors duration-500 hover:border-ember',
                wide && 'md:col-span-2',
            )}
        >
            <div className="mb-5 flex items-center justify-between gap-4">
                <span className="label">{project.year}</span>
                <span className="flex items-center gap-3">
                    {project.stars > 0 && (
                        <span className="label flex items-center gap-1">
                            <Star size={11} aria-hidden="true" />
                            {project.stars}
                        </span>
                    )}
                    <ArrowUpRight
                        size={17}
                        aria-hidden="true"
                        className="text-muted transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember"
                    />
                </span>
            </div>

            <h3
                className={cn(
                    'font-display leading-tight',
                    wide ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl',
                )}
            >
                {/* Stretched link: the whole card is the target, without nesting anchors. */}
                <a
                    href={primaryHref}
                    target="_blank"
                    rel="noreferrer"
                    className="after:absolute after:inset-0 after:content-['']"
                >
                    {project.title}
                </a>
            </h3>

            <p
                className={cn(
                    'mt-4 leading-relaxed text-muted',
                    wide ? 'max-w-2xl text-base' : 'text-sm',
                )}
            >
                {project.blurb}
            </p>

            <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-2">
                {project.stack.map((tech) => (
                    <li
                        key={tech}
                        className="border border-line px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-muted transition-colors duration-500 group-hover:border-ember/30"
                    >
                        {tech}
                    </li>
                ))}
            </ul>

            {/* Sits above the stretched link so both destinations stay reachable. */}
            <div className="relative z-10 mt-6 flex flex-wrap gap-5 pb-8">
                <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="link-underline label flex items-center gap-1.5 hover:text-ink"
                >
                    <Github size={12} aria-hidden="true" />
                    Source
                </a>
                {project.demoUrl && (
                    <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="link-underline label flex items-center gap-1.5 text-ember hover:text-ink"
                    >
                        Live demo
                    </a>
                )}
            </div>
        </article>
    );
};
