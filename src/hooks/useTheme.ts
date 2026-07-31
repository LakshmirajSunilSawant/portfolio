import { useCallback, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

const read = (): Theme =>
    (document.documentElement.getAttribute('data-theme') as Theme | null) ?? 'dark';

/**
 * Reads the theme the inline script in index.html already applied, and writes
 * changes back to both the document and localStorage. It never sets the
 * attribute on mount, which is what keeps the first paint flash-free.
 */
export const useTheme = () => {
    const [theme, setTheme] = useState<Theme>(read);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        try {
            localStorage.setItem('theme', theme);
        } catch {
            /* Private browsing can reject writes; the in-memory theme still applies. */
        }
    }, [theme]);

    const toggle = useCallback(() => {
        setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
    }, []);

    return { theme, toggle };
};
