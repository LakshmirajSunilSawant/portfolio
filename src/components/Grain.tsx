/**
 * Film-grain overlay.
 *
 * A single fixed layer painting a tiled fractal-noise SVG as a data URI — no
 * network request, no canvas, no per-frame work. Opacity is a theme token so
 * light mode can carry slightly more texture (it needs it; dark hides grain).
 */
const NOISE = `\
<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>\
<filter id='n'>\
<feTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/>\
<feColorMatrix type='saturate' values='0'/>\
</filter>\
<rect width='100%' height='100%' filter='url(#n)'/>\
</svg>`;

export const Grain = () => (
    <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay"
        style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(NOISE)}")`,
            backgroundRepeat: 'repeat',
            opacity: 'var(--grain-opacity)',
        }}
    />
);
