import { achievements, certificates, education } from '../data/career';
import { SectionHeader } from '../components/SectionHeader';
import { FadeIn, Reveal } from '../components/Reveal';

export const About = () => (
    <section id="about" className="mx-auto max-w-shell px-6 py-24 md:px-10 md:py-32">
        <SectionHeader index="01" title="About" aside="Education, and the things worth putting on a wall." />

        <div className="grid gap-16 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-7">
                <Reveal>
                    <p className="font-display text-2xl leading-snug md:text-3xl">
                        Computer science graduate, three internships deep, most at home where machine
                        learning meets the systems that have to keep it running.
                    </p>
                </Reveal>

                <div className="mt-8 space-y-5 text-muted md:max-w-readable">
                    <FadeIn delay={0.08}>
                        <p className="leading-relaxed">
                            The work I keep coming back to sits at the seam between a model and the
                            infrastructure around it: feature stores that stop training and serving
                            drifting apart, pipelines that survive a bad day, remediation that runs
                            before anyone gets paged. It is less photogenic than the model itself, and
                            it is usually what decides whether the thing is real.
                        </p>
                    </FadeIn>
                    <FadeIn delay={0.14}>
                        <p className="leading-relaxed">
                            Off the clock that mostly means shipping side projects until they break in
                            an interesting way, and then fixing that.
                        </p>
                    </FadeIn>
                </div>

                <FadeIn delay={0.18} className="mt-12">
                    <h3 className="label mb-5">Certifications</h3>
                    <ul className="space-y-4">
                        {certificates.map((certificate) => (
                            <li key={certificate.name} className="flex gap-4 text-sm leading-relaxed">
                                <span className="mt-2 h-px w-5 shrink-0 bg-ember" aria-hidden="true" />
                                <span className="text-muted">
                                    {certificate.name}
                                    {certificate.issuer && (
                                        <span className="ml-2 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-muted/70">
                                            {certificate.issuer}
                                        </span>
                                    )}
                                </span>
                            </li>
                        ))}
                    </ul>
                </FadeIn>

                <FadeIn delay={0.2} className="mt-12">
                    <h3 className="label mb-5">Recognition</h3>
                    <ul className="space-y-4">
                        {achievements.map((item) => (
                            <li key={item} className="flex gap-4 text-sm leading-relaxed text-muted">
                                <span className="mt-2 h-px w-5 shrink-0 bg-ember" aria-hidden="true" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </FadeIn>
            </div>

            <div className="md:col-span-5 md:col-start-9">
                <FadeIn>
                    <h3 className="label mb-6">Education</h3>
                    <ol className="space-y-px">
                        {education.map((study) => (
                            <li key={study.institution} className="border-t border-line py-5 last:border-b">
                                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">
                                    {study.period}
                                </p>
                                <p className="mt-2 text-base leading-snug text-ink">{study.institution}</p>
                                <p className="mt-1 text-sm text-muted">{study.qualification}</p>
                                <p className="mt-2 font-mono text-xs text-ember">{study.result}</p>
                            </li>
                        ))}
                    </ol>
                </FadeIn>
            </div>
        </div>
    </section>
);
