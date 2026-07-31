import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { archiveFilters, featuredProjects, otherProjects } from '../data/projects';
import { SectionHeader } from '../components/SectionHeader';
import { ProjectCard } from '../components/ProjectCard';
import { FadeIn } from '../components/Reveal';
import { cn } from '../lib/cn';

const EASE = [0.16, 1, 0.3, 1] as const;

export const Projects = () => {
    const reduced = useReducedMotion();
    const [expanded, setExpanded] = useState(false);
    const [filter, setFilter] = useState<string | null>(null);

    const archive = useMemo(
        () => (filter ? otherProjects.filter((project) => project.stack.includes(filter)) : otherProjects),
        [filter],
    );

    return (
        <section id="projects" className="mx-auto max-w-shell px-6 py-24 md:px-10 md:py-32">
            <SectionHeader
                index="03"
                title="Projects"
                aside={`${featuredProjects.length + otherProjects.length} public repositories, synced from GitHub.`}
            />

            {/*
              Asymmetric on purpose: the lead project spans both columns, so the
              row has a clear focal point instead of three equal-weight tiles.
            */}
            <div className="grid gap-x-10 md:grid-cols-2">
                {featuredProjects.map((project, index) => (
                    <FadeIn key={project.name} delay={index * 0.07} className={index === 0 ? 'md:col-span-2' : ''}>
                        <ProjectCard project={project} wide={index === 0} />
                    </FadeIn>
                ))}
            </div>

            {otherProjects.length > 0 && (
                <div className="mt-16 border-t border-line pt-10">
                    <button
                        type="button"
                        onClick={() => setExpanded((open) => !open)}
                        aria-expanded={expanded}
                        aria-controls="project-archive"
                        className="group flex w-full items-center justify-between gap-6 text-left"
                    >
                        <span className="font-display text-2xl md:text-3xl">
                            {expanded ? 'Close the archive' : 'More from the archive'}
                        </span>
                        <span className="flex items-center gap-4">
                            <span className="label hidden sm:inline">{otherProjects.length} more</span>
                            <Plus
                                size={22}
                                aria-hidden="true"
                                className={cn(
                                    'shrink-0 text-muted transition-all duration-500 ease-reveal group-hover:text-ember',
                                    expanded && 'rotate-45',
                                )}
                            />
                        </span>
                    </button>

                    <AnimatePresence initial={false}>
                        {expanded && (
                            <motion.div
                                id="project-archive"
                                initial={reduced ? false : { height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={reduced ? undefined : { height: 0, opacity: 0 }}
                                transition={{ duration: 0.6, ease: EASE }}
                                className="overflow-hidden"
                            >
                                <div className="pt-12">
                                    <div className="mb-10 flex flex-wrap gap-x-2 gap-y-2">
                                        <FilterChip
                                            label="All"
                                            active={filter === null}
                                            onClick={() => setFilter(null)}
                                        />
                                        {archiveFilters.map((tech) => (
                                            <FilterChip
                                                key={tech}
                                                label={tech}
                                                active={filter === tech}
                                                onClick={() => setFilter(filter === tech ? null : tech)}
                                            />
                                        ))}
                                    </div>

                                    <div className="grid gap-x-10 md:grid-cols-2 lg:grid-cols-3">
                                        {archive.map((project) => (
                                            <motion.div
                                                key={project.name}
                                                layout={!reduced}
                                                initial={reduced ? false : { opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.45, ease: EASE }}
                                            >
                                                <ProjectCard project={project} />
                                            </motion.div>
                                        ))}
                                    </div>

                                    {archive.length === 0 && (
                                        <p className="py-10 text-sm text-muted">
                                            Nothing tagged {filter} outside the featured set.
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </section>
    );
};

const FilterChip = ({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) => (
    <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cn(
            'border px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] transition-colors duration-300',
            active
                ? 'border-ember bg-ember/10 text-ember'
                : 'border-line text-muted hover:border-muted hover:text-ink',
        )}
    >
        {label}
    </button>
);
