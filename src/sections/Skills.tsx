import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { skillTaxonomy } from '../data/career';
import { useTheme } from '../hooks/useTheme';
import { SectionHeader } from '../components/SectionHeader';
import { FadeIn } from '../components/Reveal';

/*
  The field is code-split and only requested once the section is close to the
  viewport, so neither the motion loop nor the icon paths are in the critical
  bundle. Until then this is a static list, which is also the no-JS result.
*/
const SkillsField = lazy(() =>
    import('../components/SkillsField').then((module) => ({ default: module.SkillsField })),
);

export const Skills = () => {
    const { theme } = useTheme();
    const sentinel = useRef<HTMLDivElement>(null);
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        const element = sentinel.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '300px' },
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="skills" className="mx-auto max-w-shell px-6 py-24 md:px-10 md:py-32">
            <SectionHeader
                index="04"
                title="Skills"
                aside="Hover to hold one still. Tap to name it."
            />

            <div className="grid gap-12 md:grid-cols-12 md:gap-10">
                <div className="md:col-span-5 lg:col-span-4">
                    <FadeIn>
                        <dl className="space-y-7">
                            {skillTaxonomy.map((group) => (
                                <div key={group.label}>
                                    <dt className="label mb-2">{group.label}</dt>
                                    <dd className="text-sm leading-relaxed text-muted">
                                        {group.items.join(', ')}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </FadeIn>
                </div>

                <div ref={sentinel} className="md:col-span-7 lg:col-span-7 lg:col-start-6">
                    <Suspense fallback={<div className="h-[26rem] sm:h-[30rem]" />}>
                        {shouldLoad ? <SkillsField theme={theme} /> : <div className="h-[26rem] sm:h-[30rem]" />}
                    </Suspense>
                </div>
            </div>
        </section>
    );
};
