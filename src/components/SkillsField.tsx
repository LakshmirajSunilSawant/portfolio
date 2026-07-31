import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { fieldSkills, type Skill } from '../data/skills';
import type { Theme } from '../hooks/useTheme';
import { cn } from '../lib/cn';

/*
  A hand-rolled motion loop rather than a physics library.

  Matter.js would be ~90KB gzipped for a rigid-body solver we'd use maybe 5% of
  — what's actually needed here is edge bouncing and elastic circle collisions,
  which is the ~60 lines below. Owning the loop also makes the two requirements
  a library would fight us on trivial: pausing a single body on hover, and
  freezing the whole thing for `prefers-reduced-motion`.

  The loop writes `transform` straight to the DOM nodes. Nothing here passes
  through React state, so a moving field costs zero re-renders per frame.
*/

const SIZE = 52;      // tile edge, px
const RADIUS = SIZE / 2;
const SPEED = 0.22;   // px per frame at 60fps — a drift, not a bounce house
const RESTITUTION = 0.9;

interface Body {
    x: number;
    y: number;
    vx: number;
    vy: number;
    paused: boolean;
}

/**
 * Brand colours are only legible against one background. Simple Icons stores
 * Java and Next.js as #000000, which vanishes in dark mode — so anything too
 * close to the current background falls back to the foreground ink.
 */
const hoverColor = (hex: string | null, theme: Theme): string | undefined => {
    if (!hex) return undefined;
    const value = parseInt(hex, 16);
    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    if (theme === 'dark' && luminance < 0.22) return 'rgb(var(--ink))';
    if (theme === 'light' && luminance > 0.82) return 'rgb(var(--ink))';
    return `#${hex}`;
};

const SkillGlyph = ({ skill }: { skill: Skill }) =>
    skill.path ? (
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
            <path d={skill.path} />
        </svg>
    ) : (
        // No Simple Icons glyph exists (Gosu, Power BI, Tableau) — set a monogram.
        <span aria-hidden="true" className="font-mono text-[0.6875rem] font-medium tracking-tight">
            {skill.name
                .split(' ')
                .map((word) => word[0])
                .join('')
                .slice(0, 3)}
        </span>
    );

export const SkillsField = ({ theme }: { theme: Theme }) => {
    const reduced = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);
    const tileRefs = useRef<(HTMLElement | null)[]>([]);
    const bodies = useRef<Body[]>([]);
    const bounds = useRef({ width: 0, height: 0 });
    const frame = useRef<number>(0);
    const running = useRef(false);

    const [active, setActive] = useState<number | null>(null);
    const skills = useMemo(() => fieldSkills, []);

    const setPaused = useCallback((index: number, paused: boolean) => {
        const body = bodies.current[index];
        if (body) body.paused = paused;
    }, []);

    useEffect(() => {
        if (reduced) return;

        const container = containerRef.current;
        if (!container) return;

        /** Seeds positions on a jittered grid, so nothing starts overlapped. */
        const seed = (width: number, height: number) => {
            const columns = Math.max(1, Math.floor(width / (SIZE * 1.6)));
            const rows = Math.ceil(skills.length / columns);
            const cellW = width / columns;
            const cellH = height / rows;

            bodies.current = skills.map((_, index) => {
                const column = index % columns;
                const row = Math.floor(index / columns);
                const angle = Math.random() * Math.PI * 2;
                return {
                    x: Math.min(
                        Math.max(cellW * (column + 0.5) + (Math.random() - 0.5) * cellW * 0.5, RADIUS),
                        width - RADIUS,
                    ),
                    y: Math.min(
                        Math.max(cellH * (row + 0.5) + (Math.random() - 0.5) * cellH * 0.5, RADIUS),
                        height - RADIUS,
                    ),
                    vx: Math.cos(angle) * SPEED,
                    vy: Math.sin(angle) * SPEED,
                    paused: false,
                };
            });
        };

        const paint = () => {
            bodies.current.forEach((body, index) => {
                const element = tileRefs.current[index];
                if (element) {
                    element.style.transform = `translate3d(${body.x - RADIUS}px, ${body.y - RADIUS}px, 0)`;
                }
            });
        };

        const step = () => {
            const { width, height } = bounds.current;
            const list = bodies.current;

            for (const body of list) {
                if (body.paused) continue;

                body.x += body.vx;
                body.y += body.vy;

                // Bounce off the walls, clamping back inside so a body can't
                // get stuck oscillating outside the boundary.
                if (body.x < RADIUS) {
                    body.x = RADIUS;
                    body.vx = Math.abs(body.vx);
                } else if (body.x > width - RADIUS) {
                    body.x = width - RADIUS;
                    body.vx = -Math.abs(body.vx);
                }

                if (body.y < RADIUS) {
                    body.y = RADIUS;
                    body.vy = Math.abs(body.vy);
                } else if (body.y > height - RADIUS) {
                    body.y = height - RADIUS;
                    body.vy = -Math.abs(body.vy);
                }
            }

            // Pairwise elastic collisions. n is ~25, so ~300 checks a frame.
            for (let i = 0; i < list.length; i += 1) {
                for (let j = i + 1; j < list.length; j += 1) {
                    const a = list[i];
                    const b = list[j];
                    const dx = b.x - a.x;
                    const dy = b.y - a.y;
                    const distanceSq = dx * dx + dy * dy;
                    const minDistance = SIZE;

                    if (distanceSq === 0 || distanceSq >= minDistance * minDistance) continue;

                    const distance = Math.sqrt(distanceSq);
                    const nx = dx / distance;
                    const ny = dy / distance;

                    // Separate them first, so they don't stay interpenetrated.
                    const overlap = (minDistance - distance) / 2;
                    if (!a.paused) {
                        a.x -= nx * overlap;
                        a.y -= ny * overlap;
                    }
                    if (!b.paused) {
                        b.x += nx * overlap;
                        b.y += ny * overlap;
                    }

                    // Equal masses: exchange the velocity component along the normal.
                    const relative = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
                    if (relative > 0) continue;

                    const impulse = relative * RESTITUTION;
                    if (!a.paused) {
                        a.vx += impulse * nx;
                        a.vy += impulse * ny;
                    }
                    if (!b.paused) {
                        b.vx -= impulse * nx;
                        b.vy -= impulse * ny;
                    }
                }
            }

            paint();
            frame.current = requestAnimationFrame(step);
        };

        const start = () => {
            if (running.current) return;
            running.current = true;
            frame.current = requestAnimationFrame(step);
        };

        const stop = () => {
            running.current = false;
            cancelAnimationFrame(frame.current);
        };

        const resizeObserver = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            if (width === 0 || height === 0) return;
            bounds.current = { width, height };
            if (bodies.current.length === 0) {
                seed(width, height);
                paint();
            }
        });
        resizeObserver.observe(container);

        // Don't burn frames on a section nobody is looking at.
        const visibilityObserver = new IntersectionObserver(
            ([entry]) => (entry.isIntersecting ? start() : stop()),
            { threshold: 0 },
        );
        visibilityObserver.observe(container);

        const onVisibilityChange = () => {
            if (document.hidden) stop();
            else if (containerRef.current) start();
        };
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            stop();
            resizeObserver.disconnect();
            visibilityObserver.disconnect();
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, [reduced, skills]);

    // Reduced motion: the same tiles, laid out as a plain labelled grid.
    if (reduced) {
        return (
            <ul className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                    <li
                        key={skill.name}
                        className="flex items-center gap-2.5 border border-line px-3 py-2 text-muted"
                    >
                        <SkillGlyph skill={skill} />
                        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.1em]">
                            {skill.name}
                        </span>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <div
            ref={containerRef}
            className="relative h-[26rem] w-full touch-pan-y sm:h-[30rem]"
            role="list"
            aria-label="Technologies"
        >
            {skills.map((skill, index) => (
                <button
                    key={skill.name}
                    type="button"
                    role="listitem"
                    ref={(element) => {
                        tileRefs.current[index] = element;
                    }}
                    onMouseEnter={() => setPaused(index, true)}
                    onMouseLeave={() => setPaused(index, false)}
                    onFocus={() => {
                        setPaused(index, true);
                        setActive(index);
                    }}
                    onBlur={() => {
                        setPaused(index, false);
                        setActive((current) => (current === index ? null : current));
                    }}
                    onClick={() => setActive((current) => (current === index ? null : index))}
                    aria-label={skill.name}
                    style={{
                        width: SIZE,
                        height: SIZE,
                        // Overridden every frame by the loop; this only positions
                        // the tile for the first paint, before the loop starts.
                        transform: 'translate3d(-100px, -100px, 0)',
                        ['--brand' as string]: hoverColor(skill.hex, theme),
                    }}
                    className={cn(
                        'absolute left-0 top-0 flex items-center justify-center rounded-full border border-line bg-surface text-muted',
                        'transition-[color,border-color,transform] duration-300 will-change-transform',
                        'hover:scale-110 hover:border-ember/40 hover:text-[color:var(--brand,rgb(var(--ember)))]',
                        'focus-visible:scale-110 focus-visible:text-[color:var(--brand,rgb(var(--ember)))]',
                        active === index && 'scale-110 border-ember/40 text-[color:var(--brand,rgb(var(--ember)))]',
                    )}
                >
                    <SkillGlyph skill={skill} />

                    {active === index && (
                        <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap border border-line bg-paper px-2 py-1 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ink">
                            {skill.name}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};
