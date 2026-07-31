import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { site } from '../data/site';
import { currentRole } from '../data/career';
import { Reveal } from '../components/Reveal';

const EASE = [0.16, 1, 0.3, 1] as const;
const INTERVAL = 2600;

/**
 * The one signature interaction on the page: a word in the headline cycles
 * through what Lakshmiraj actually builds. It deliberately reuses the same
 * clip-mask motion as every section reveal — a distinct effect here would read
 * as decoration; the shared mechanic reads as a house style.
 */
const RotatingSubject = () => {
    const reduced = useReducedMotion();
    const [index, setIndex] = useState(0);
    const subjects = site.heroSubjects;

    useEffect(() => {
        if (reduced) return;
        const timer = setInterval(() => {
            setIndex((current) => (current + 1) % subjects.length);
        }, INTERVAL);
        return () => clearInterval(timer);
    }, [reduced, subjects.length]);

    if (reduced) {
        return <span className="italic text-ember">{subjects[0]}</span>;
    }

    // Reserve the width of the longest option so the line below never jumps.
    const widest = subjects.reduce((a, b) => (b.length > a.length ? b : a), '');

    return (
        <span className="relative inline-grid overflow-hidden align-bottom">
            <span aria-hidden="true" className="invisible col-start-1 row-start-1 italic">
                {widest}
            </span>

            <span className="col-start-1 row-start-1" aria-hidden="true">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={subjects[index]}
                        className="block whitespace-nowrap italic text-ember"
                        initial={{ y: '105%' }}
                        animate={{ y: '0%' }}
                        exit={{ y: '-105%' }}
                        transition={{ duration: 0.7, ease: EASE }}
                    >
                        {subjects[index]}
                    </motion.span>
                </AnimatePresence>
            </span>

            {/* Read the full set once, rather than announcing every tick. */}
            <span className="sr-only">{subjects.join(', ')}</span>
        </span>
    );
};

/** Falls back to the latest role from the resume, so it can't go stale on its own. */
const statusText =
    site.status.text ?? `Most recently ${currentRole.title} at ${currentRole.company}`;

export const Hero = () => (
    <section className="relative flex min-h-[92svh] flex-col justify-center pb-20 pt-32">
        <div className="mx-auto w-full max-w-shell px-6 md:px-10">
            <Reveal immediate>
                <p className="label mb-10 flex items-center gap-3">
                    <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-ember opacity-70 motion-safe:animate-ping" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ember" />
                    </span>
                    {statusText}
                </p>
            </Reveal>

            <h1 className="font-display text-display-lg">
                <Reveal immediate delay={0.05}>
                    <span className="block">I build</span>
                </Reveal>
                <Reveal immediate delay={0.13}>
                    <RotatingSubject />
                </Reveal>
                <Reveal immediate delay={0.21}>
                    <span className="block">that hold up.</span>
                </Reveal>
            </h1>

            <div className="mt-14 grid gap-10 md:grid-cols-12 md:items-end">
                <Reveal immediate delay={0.34} className="md:col-span-6 lg:col-span-5">
                    <p className="max-w-readable text-base leading-relaxed text-muted md:text-lg">
                        {site.intro}
                    </p>
                </Reveal>

                <Reveal immediate delay={0.42} className="md:col-span-6 md:justify-self-end lg:col-span-4">
                    <p className="border-l border-ember pl-4 font-mono text-xs leading-relaxed text-ink">
                        {site.status.availability}
                    </p>
                </Reveal>
            </div>
        </div>

        <motion.a
            href="#about"
            aria-label="Scroll to about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted transition-colors hover:text-ink"
        >
            <ArrowDown size={18} className="motion-safe:animate-bounce" />
        </motion.a>
    </section>
);
