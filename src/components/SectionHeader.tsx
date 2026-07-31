import { Reveal, RevealWords } from './Reveal';

interface SectionHeaderProps {
    index: string;
    title: string;
    /** Optional line set beside the heading on wide screens. */
    aside?: string;
}

/**
 * The editorial spine of the page: a monospaced index, a rule, and a serif
 * heading that reveals word by word. Every section opens with exactly this.
 */
export const SectionHeader = ({ index, title, aside }: SectionHeaderProps) => (
    <header className="mb-14 md:mb-20">
        <Reveal>
            <div className="flex items-center gap-4">
                <span className="label text-ember">{index}</span>
                <span className="h-px w-10 bg-line" aria-hidden="true" />
                <span className="label">{title}</span>
            </div>
        </Reveal>

        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-16">
            <h2 className="font-display text-display-sm">
                <RevealWords text={title} delay={0.08} />
            </h2>

            {aside && (
                <Reveal delay={0.16} className="md:max-w-xs md:text-right">
                    <p className="text-sm leading-relaxed text-muted">{aside}</p>
                </Reveal>
            )}
        </div>
    </header>
);
