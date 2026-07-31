import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { site } from '../data/site';
import { SectionHeader } from '../components/SectionHeader';
import { FadeIn, RevealWords } from '../components/Reveal';
import { cn } from '../lib/cn';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const elsewhere = [
    { label: 'GitHub', value: '@LakshmirajSunilSawant', href: site.social.github },
    { label: 'LinkedIn', value: 'lakshmiraj-sawant', href: site.social.linkedin },
    { label: 'Leetcode', value: 'lakshmirajsawant', href: site.social.leetcode },
    ...(site.resumeUrl ? [{ label: 'Résumé', value: 'PDF', href: site.resumeUrl }] : []),
];

export const Contact = () => {
    const [status, setStatus] = useState<Status>('idle');
    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);

        setStatus('sending');
        setError('');

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    access_key: site.contactFormKey,
                    name: data.get('name'),
                    email: data.get('email'),
                    message: data.get('message'),
                    subject: `Portfolio enquiry from ${data.get('name')}`,
                    from_name: 'Portfolio contact form',
                }),
            });

            const result = await response.json();

            if (result.success) {
                setStatus('sent');
                form.reset();
            } else {
                setStatus('error');
                setError(result.message ?? 'That did not go through. Try again?');
            }
        } catch {
            setStatus('error');
            setError('Network error. Email works too.');
        }
    };

    return (
        <section id="contact" className="mx-auto max-w-shell px-6 py-24 md:px-10 md:py-32">
            <SectionHeader index="05" title="Contact" />

            <div className="grid gap-16 md:grid-cols-12 md:gap-10">
                <div className="md:col-span-6">
                    <h3 className="font-display text-display-sm leading-[1.05]">
                        <RevealWords text="Have something worth building?" />
                    </h3>

                    <FadeIn delay={0.1}>
                        <a
                            href={`mailto:${site.email}`}
                            className="link-underline mt-10 inline-flex items-center gap-2 text-lg text-ink md:text-xl"
                        >
                            {site.email}
                            <ArrowUpRight size={18} aria-hidden="true" />
                        </a>
                    </FadeIn>

                    <FadeIn delay={0.16} className="mt-12">
                        <dl className="space-y-px">
                            {elsewhere.map((item) => (
                                <div key={item.label} className="border-t border-line last:border-b">
                                    <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="group flex items-center justify-between gap-4 py-4"
                                    >
                                        <dt className="label">{item.label}</dt>
                                        <dd className="flex items-center gap-2 text-sm text-muted transition-colors group-hover:text-ink">
                                            {item.value}
                                            <ArrowUpRight
                                                size={14}
                                                aria-hidden="true"
                                                className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                            />
                                        </dd>
                                    </a>
                                </div>
                            ))}
                        </dl>
                    </FadeIn>
                </div>

                <FadeIn delay={0.12} className="md:col-span-5 md:col-start-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <Field id="name" label="Name" />
                        <Field id="email" label="Email" type="email" />
                        <Field id="message" label="Message" multiline />

                        <div className="flex flex-wrap items-center gap-6">
                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className={cn(
                                    'group relative overflow-hidden border border-ink px-8 py-3.5',
                                    'font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink',
                                    'transition-colors duration-500 hover:text-paper',
                                    'disabled:cursor-not-allowed disabled:opacity-50',
                                )}
                            >
                                {/* Fill wipes up from the bottom on hover. */}
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-reveal group-hover:scale-y-100 group-disabled:hidden"
                                />
                                <span className="relative">
                                    {status === 'sending' ? 'Sending' : 'Send message'}
                                </span>
                            </button>

                            <p
                                role="status"
                                aria-live="polite"
                                className={cn(
                                    'font-mono text-[0.6875rem] uppercase tracking-[0.12em]',
                                    status === 'error' ? 'text-ember' : 'text-muted',
                                )}
                            >
                                {status === 'sent' && 'Sent. I’ll be in touch.'}
                                {status === 'error' && error}
                            </p>
                        </div>
                    </form>
                </FadeIn>
            </div>
        </section>
    );
};

/** Underline-only input. The label sits above in mono, matching the section indices. */
const Field = ({
    id,
    label,
    type = 'text',
    multiline = false,
}: {
    id: string;
    label: string;
    type?: string;
    multiline?: boolean;
}) => {
    const shared =
        'w-full border-0 border-b border-line bg-transparent pb-2 text-ink placeholder:text-muted/50 focus:border-ember focus:outline-none focus:ring-0 transition-colors duration-300';

    return (
        <div>
            <label htmlFor={id} className="label mb-3 block">
                {label}
            </label>
            {multiline ? (
                <textarea id={id} name={id} rows={4} required className={cn(shared, 'resize-none')} />
            ) : (
                <input id={id} name={id} type={type} required className={shared} />
            )}
        </div>
    );
};
