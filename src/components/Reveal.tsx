import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

const EASE = [0.16, 1, 0.3, 1] as const;

const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const;

/**
 * Slide-up-behind-a-mask, expressed as variants.
 *
 * The trigger has to live on the *mask*, never on the masked element. An
 * element translated 110% down sits entirely outside its `overflow-hidden`
 * parent, and IntersectionObserver intersects a target's rect with its
 * ancestors' clip rects — so the masked element reports isIntersecting: false
 * forever. It would never animate in, because it can't be seen, because it
 * hasn't animated in. Observing the mask (which is never clipped or moved) and
 * propagating the variant inward avoids that deadlock entirely.
 */
const slide: Variants = {
    hidden: { y: '110%' },
    shown: { y: '0%' },
};

interface RevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    /**
     * Animate on mount instead of on scroll-into-view. Use for anything above
     * the fold: a client that never delivers an IntersectionObserver callback
     * (a crawler, a link-preview bot, a headless screenshot) would otherwise
     * render the hero blank.
     */
    immediate?: boolean;
}

export const Reveal = ({ children, className, delay = 0, immediate = false }: RevealProps) => {
    const reduced = useReducedMotion();

    if (reduced) {
        return <span className={cn('block', className)}>{children}</span>;
    }

    const trigger = immediate
        ? { animate: 'shown' }
        : { whileInView: 'shown', viewport: VIEWPORT };

    return (
        <motion.span
            className={cn('block overflow-hidden', className)}
            initial="hidden"
            {...trigger}
        >
            <motion.span
                className="block"
                variants={slide}
                transition={{ duration: 0.9, ease: EASE, delay }}
            >
                {children}
            </motion.span>
        </motion.span>
    );
};

/**
 * Splits a string into words and reveals them in sequence. Reserved for the
 * few places where the extra emphasis is earned — section headings and the
 * hero — since per-word staggering on body copy is exhausting to read.
 *
 * One trigger on the container, staggered by delay on each word, so the same
 * clipping caveat as `Reveal` is handled once rather than per word.
 */
export const RevealWords = ({
    text,
    className,
    delay = 0,
    stagger = 0.055,
    immediate = false,
}: {
    text: string;
    className?: string;
    delay?: number;
    stagger?: number;
    immediate?: boolean;
}) => {
    const reduced = useReducedMotion();
    const words = text.split(' ');

    if (reduced) {
        return <span className={className}>{text}</span>;
    }

    const trigger = immediate
        ? { animate: 'shown' }
        : { whileInView: 'shown', viewport: VIEWPORT };

    return (
        <motion.span className={className} initial="hidden" {...trigger}>
            {words.map((word, index) => (
                // Words repeat, so the index has to be part of the key.
                <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
                    <motion.span
                        className="inline-block"
                        variants={slide}
                        transition={{ duration: 0.85, ease: EASE, delay: delay + index * stagger }}
                    >
                        {word}
                        {index < words.length - 1 ? ' ' : ''}
                    </motion.span>
                </span>
            ))}
        </motion.span>
    );
};

/** Plain fade-and-rise, for cards and blocks where a clip mask would crop content. */
export const FadeIn = ({ children, className, delay = 0 }: RevealProps) => {
    const reduced = useReducedMotion();

    return (
        <motion.div
            className={className}
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.7, ease: EASE, delay }}
        >
            {children}
        </motion.div>
    );
};
