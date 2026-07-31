import { site } from '../data/site';

const links = [
    { label: 'GitHub', href: site.social.github, external: true },
    { label: 'LinkedIn', href: site.social.linkedin, external: true },
    { label: 'Email', href: `mailto:${site.email}`, external: false },
    ...(site.resumeUrl ? [{ label: 'Résumé', href: site.resumeUrl, external: true }] : []),
];

export const Footer = () => (
    <footer className="border-t border-line">
        <div className="mx-auto flex max-w-shell flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10">
            <p className="label normal-case tracking-normal">
                © {new Date().getFullYear()} {site.name}
            </p>

            <nav aria-label="Elsewhere">
                <ul className="flex flex-wrap gap-x-7 gap-y-2">
                    {links.map((link) => (
                        <li key={link.label}>
                            <a
                                href={link.href}
                                {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                                className="link-underline label transition-colors hover:text-ink"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    </footer>
);
