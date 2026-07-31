/** @type {import('tailwindcss').Config} */

/** Lets every colour token accept an opacity modifier: `text-ink/60`. */
const token = (name) => ({ opacityValue }) =>
  opacityValue === undefined
    ? `rgb(var(--${name}))`
    : `rgb(var(--${name}) / ${opacityValue})`;

export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: token('paper'),
        surface: token('surface'),
        line: token('line'),
        ink: token('ink'),
        muted: token('muted'),
        ember: token('ember'),
      },
      fontFamily: {
        // Display serif for headlines only — it ships a single weight by design.
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Inter Tight Variable"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Fluid display sizes, so the hero needs no breakpoint ladder.
        'display-sm': ['clamp(2.25rem, 6vw, 3.5rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(2.75rem, 9vw, 5.5rem)', { lineHeight: '0.98', letterSpacing: '-0.025em' }],
        'display-lg': ['clamp(3rem, 12vw, 8rem)', { lineHeight: '0.94', letterSpacing: '-0.03em' }],
      },
      maxWidth: {
        shell: '78rem',
        readable: '38rem',
      },
      transitionTimingFunction: {
        // Slow-out expo. Every reveal uses it, so motion reads as one system.
        reveal: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
