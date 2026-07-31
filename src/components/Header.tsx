import { useEffect, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { sections, site } from '../data/site';
import { useActiveSection } from '../hooks/useActiveSection';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/cn';

const sectionIds = sections.map((section) => section.id);

/** Native smooth scroll; `scroll-margin-top` on the sections handles the offset. */
const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export const Header = () => {
    const { theme, toggle } = useTheme();
    const active = useActiveSection(sectionIds);
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // The mobile sheet covers the page, so the page beneath it must not scroll.
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    useEffect(() => {
        if (!menuOpen) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setMenuOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [menuOpen]);

    const go = (id: string) => {
        setMenuOpen(false);
        scrollTo(id);
    };

    return (
        <>
            <a
                href="#about"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded focus:bg-ember focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
            >
                Skip to content
            </a>

            <header
                className={cn(
                    'fixed inset-x-0 top-0 z-40 transition-colors duration-500',
                    scrolled && 'border-b border-line bg-paper/80 backdrop-blur-md',
                )}
            >
                <div className="mx-auto flex max-w-shell items-center justify-between px-6 py-5 md:px-10">
                    <button
                        type="button"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="font-mono text-sm tracking-tight text-ink"
                        aria-label="Back to top"
                    >
                        {site.initials}
                        <span className="text-ember">.</span>
                    </button>

                    <nav aria-label="Sections" className="hidden md:block">
                        <ul className="flex items-center gap-8">
                            {sections.map((section) => (
                                <li key={section.id}>
                                    <button
                                        type="button"
                                        onClick={() => go(section.id)}
                                        aria-current={active === section.id ? 'true' : undefined}
                                        className={cn(
                                            'link-underline font-mono text-xs uppercase tracking-[0.14em] transition-colors',
                                            active === section.id
                                                ? 'text-ink'
                                                : 'text-muted hover:text-ink',
                                        )}
                                    >
                                        <span className="mr-1.5 text-ember/70">{section.index}</span>
                                        {section.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={toggle}
                            className="rounded-full p-2 text-muted transition-colors hover:text-ink"
                            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                        >
                            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                        </button>

                        <button
                            type="button"
                            onClick={() => setMenuOpen((open) => !open)}
                            className="rounded-full p-2 text-muted transition-colors hover:text-ink md:hidden"
                            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={menuOpen}
                        >
                            {menuOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </div>
            </header>

            {menuOpen && (
                <div className="fixed inset-0 z-30 bg-paper px-6 pt-24 md:hidden">
                    <ul className="flex flex-col">
                        {sections.map((section) => (
                            <li key={section.id} className="border-b border-line">
                                <button
                                    type="button"
                                    onClick={() => go(section.id)}
                                    className="flex w-full items-baseline gap-4 py-5 text-left"
                                >
                                    <span className="label text-ember">{section.index}</span>
                                    <span className="font-display text-3xl">{section.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
                        <a href={site.social.github} target="_blank" rel="noreferrer" className="label hover:text-ink">
                            GitHub
                        </a>
                        <a href={site.social.linkedin} target="_blank" rel="noreferrer" className="label hover:text-ink">
                            LinkedIn
                        </a>
                        <a href={`mailto:${site.email}`} className="label hover:text-ink">
                            Email
                        </a>
                        {site.resumeUrl && (
                            <a href={site.resumeUrl} target="_blank" rel="noreferrer" className="label hover:text-ink">
                                Résumé
                            </a>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
