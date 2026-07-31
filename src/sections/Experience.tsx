import { roles } from '../data/career';
import { SectionHeader } from '../components/SectionHeader';
import { FadeIn } from '../components/Reveal';

/**
 * A ledger rather than a timeline: no dots, no connecting rail, just ruled rows
 * with the period set in mono at the left. It scans faster and it doesn't cost
 * a decorative column on mobile.
 */
export const Experience = () => (
    <section id="experience" className="mx-auto max-w-shell px-6 py-24 md:px-10 md:py-32">
        <SectionHeader index="02" title="Experience" aside="Three internships across product, platform and ML." />

        <ol>
            {roles.map((role, index) => (
                <FadeIn
                    key={`${role.company}-${role.title}`}
                    delay={index * 0.06}
                    className="border-t border-line last:border-b"
                >
                    <li className="group grid gap-5 py-9 md:grid-cols-12 md:gap-8">
                        <div className="md:col-span-3">
                            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                                {role.period}
                            </p>
                            <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">
                                {role.location}
                            </p>
                        </div>

                        <div className="md:col-span-9">
                            <h3 className="font-display text-2xl leading-tight md:text-3xl">
                                {role.title}
                            </h3>
                            <p className="mt-1 text-sm text-muted">{role.company}</p>

                            <ul className="mt-5 space-y-3 md:max-w-2xl">
                                {role.highlights.map((highlight) => (
                                    <li key={highlight} className="flex gap-4 text-sm leading-relaxed text-muted">
                                        <span className="mt-2 h-px w-5 shrink-0 bg-line transition-colors duration-500 group-hover:bg-ember" aria-hidden="true" />
                                        {highlight}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                </FadeIn>
            ))}
        </ol>
    </section>
);
