

export interface Experience {
    role: string;
    company: string;
    duration: string;
    location: string;
    description: string[];
}

export interface Project {
    title: string;
    techStack: string[];
    description: string[];
    link?: string;
}

export interface Education {
    institution: string;
    degree: string;
    duration: string;
    grade: string;
}

export const resumeData = {
    name: "Lakshmiraj Sunil Sawant",
    title: "Software Engineer & ML Practitioner",
    about: "Building high-performance systems and intelligent solutions. Passionate about AI/ML, distributed systems, and modern web technologies.",
    email: "sawantlakshmiraj22@gmail.com",
    social: {
        github: "https://github.com/LakshmirajSunilSawant",
        linkedin: "https://linkedin.com/in/lakshmiraj-sawant",
    },
    education: [
        {
            institution: "SRM Institute of Science and Technology",
            degree: "Bachelor of Technology - Computer Science",
            duration: "2022 - Present",
            grade: "CGPA: 9.69"
        },
        {
            institution: "PACE Junior College",
            degree: "Pre-University Education",
            duration: "2020 - 2022",
            grade: "Grade: 75%"
        },
        {
            institution: "Don Bosco High School",
            degree: "High School",
            duration: "2013 - 2020",
            grade: "Grade: 89%"
        }
    ] as Education[],
    experience: [
        {
            role: "Software Engineer Intern",
            company: "Cellcomm Solutions",
            duration: "Sept 2025 - Now",
            location: "Remote",
            description: [
                "Migrated platform storage from JSON files to SQLite, achieving 99% faster data loads (0.002 s) and implementing automated, metadata-tracked backups for full recovery coverage.",
                "Implemented the solution using open-source software, ensuring a low-cost, scalable, and maintainable data management system."
            ]
        },
        {
            role: "Consultant Developer Intern",
            company: "Guidewire Software",
            duration: "June 2025 - Sept 2025",
            location: "Bengaluru, India",
            description: [
                "Optimized database workflows, reducing data handling overhead by 15% through query optimization, rule-based validation, and automated synchronization across services.",
                "Collaborated in Agile sprints to review system performance, document enhancements, and guide roadmap decisions, improving overall scalability and maintainability by 20%."
            ]
        },
        {
            role: "Machine Learning Intern",
            company: "Sakha Technologies",
            duration: "Sept 2024 - Dec 2024",
            location: "Remote",
            description: [
                "Enhanced model accuracy by 18% through end-to-end machine learning pipeline development, including data preprocessing, feature engineering, and model training using Python and leading ML frameworks.",
                "Optimized performance via cross-functional experimentation and production-level tuning."
            ]
        }
    ] as Experience[],
    projects: [
        {
            title: "OneCommand Trader",
            techStack: ["FastAPI", "React", "SQLite", "Docker", "Redis", "Tailwind CSS", "TypeScript", "TensorFlow"],
            description: [
                "Engineered OneCommand Trader, a containerized AI trading system leveraging FastAPI, React, PostgreSQL, and Docker, processing natural language trades via Gemini NLP.",
                "Scaled the platform to support 100+ concurrent users and 10,000+ global stocks, delivering a faster and more reliable trading experience."
            ],
            link: "https://github.com/LakshmirajSunilSawant/onecommand-trader"
        },
        {
            title: "AI-Driven Observability Platform",
            techStack: ["FastAPI", "Next.js", "Python", "Kubernetes", "Prometheus", "Docker", "LSTM"],
            description: [
                "Built an AI-powered observability platform integrating LSTM-based anomaly prediction with 75% accuracy, enabling 5-minute early incident alerts for SRE teams.",
                "Developed a fully autonomous self-healing engine using Kubernetes and Prometheus that identifies root causes and executes safe, automated remediation actions."
            ],
            link: "https://github.com/LakshmirajSunilSawant/AI-powered-DevOps-Assistant"
        },
        {
            title: "TaxSmart AI – Intelligent Tax Filing Assistant",
            techStack: ["Next.js", "TypeScript", "FastAPI", "Python", "Tailwind CSS", "Ollama", "Llama 3.2", "Clerk", "Supabase"],
            description: [
                "Architected an end-to-end AI-driven tax advisory platform using Next.js 14, FastAPI, and Llama 3.2, implementing 4 core modules—ITR selection, deduction discovery, tax computation, and error validation—delivering real-time, on-device inference via Ollama.",
                "Engineered a context-aware conversational assistant with 7-form ITR classification logic, automating income-source analysis and significantly reducing user effort by generating instant, personalized tax recommendations."
            ],
            link: "https://github.com/LakshmirajSunilSawant/tax-assistant"
        }
    ] as Project[],
    skills: {
        languages: ["Python", "C++", "C", "Java", "JavaScript", "TypeScript", "Gosu"],
        databases: ["MySQL", "PostgreSQL", "SQLite"],
        tools: ["Docker", "Kubernetes", "Git", "Power BI", "Tableau", "Postman"],
        frameworks: ["React", "FastAPI", "TensorFlow", "Scikit-Learn", "Tailwind CSS", "Next.js"]
    },
    achievements: [
        "Ranked 2nd out of 1600 students in the Computer Science department for the 2022-23 academic year.",
        "Published a research paper titled 'Cardiovascular Ailment Prognosis and Risk Assessment' in the international journal IRAJ."
    ]
};
