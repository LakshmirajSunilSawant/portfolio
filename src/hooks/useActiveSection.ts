import { useEffect, useState } from 'react';

/**
 * Tracks which section is currently in view, for the nav's active marker.
 *
 * Uses a single IntersectionObserver over all sections rather than a scroll
 * listener, so there's no per-frame layout reads while scrolling. The band
 * sits in the upper third of the viewport, which matches where a reader's
 * attention actually is.
 */
export const useActiveSection = (ids: readonly string[]) => {
    const [active, setActive] = useState<string | null>(null);

    useEffect(() => {
        const elements = ids
            .map((id) => document.getElementById(id))
            .filter((element): element is HTMLElement => element !== null);

        if (elements.length === 0) return;

        const visible = new Map<string, number>();

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
                }

                let best: string | null = null;
                let bestRatio = 0;
                for (const [id, ratio] of visible) {
                    if (ratio > bestRatio) {
                        best = id;
                        bestRatio = ratio;
                    }
                }
                if (best) setActive(best);
            },
            { rootMargin: '-12% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
        );

        elements.forEach((element) => observer.observe(element));
        return () => observer.disconnect();
    }, [ids]);

    return active;
};
