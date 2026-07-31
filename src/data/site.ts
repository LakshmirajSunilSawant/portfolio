/**
 * Identity, contact points and navigation. Everything a visitor reads about
 * "who" rather than "what" lives here.
 */

export const site = {
    name: 'Lakshmiraj Sunil Sawant',
    shortName: 'Lakshmiraj',
    initials: 'LS',
    role: 'Software Engineer & ML Practitioner',

    /** Words the hero headline cycles through. Keep them short and concrete. */
    heroSubjects: [
        'ML pipelines',
        'self-healing infra',
        'trading systems',
        'developer tools',
    ],

    /**
     * The small human line under the hero. `text` is derived from the most
     * recent role in the resume so it can't drift out of date; override it here
     * only if you want it to say something the resume doesn't.
     */
    status: {
        text: null as string | null,
        availability: 'Open to full-time SWE and ML roles',
    },

    intro:
        'I work on the unglamorous half of intelligent systems: the ingestion, the serving, the monitoring, the part that has to still be standing on a Tuesday morning. Mostly Python and TypeScript, usually with a database and a queue somewhere in the middle.',

    email: 'sawantlakshmiraj22@gmail.com',
    location: 'Mumbai, Maharashtra',

    social: {
        github: 'https://github.com/LakshmirajSunilSawant',
        linkedin: 'https://linkedin.com/in/lakshmiraj-sawant',
        leetcode: 'https://leetcode.com/u/lakshmirajsawant/',
    },

    /** Drop the PDF at public/resume.pdf. Set to null to hide the link entirely. */
    resumeUrl: '/resume.pdf' as string | null,

    /** Web3Forms public access key. This key is public by design — it only permits form submission. */
    contactFormKey: '8140282c-872e-49ce-86d3-4a89ae03b1e1',
} as const;

export const sections = [
    { index: '01', label: 'About', id: 'about' },
    { index: '02', label: 'Experience', id: 'experience' },
    { index: '03', label: 'Projects', id: 'projects' },
    { index: '04', label: 'Skills', id: 'skills' },
    { index: '05', label: 'Contact', id: 'contact' },
] as const;

export type SectionId = (typeof sections)[number]['id'];
