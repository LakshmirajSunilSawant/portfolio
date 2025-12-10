// Basic resume parser for text and PDF content
// Extracts key information from resume text

export interface ParsedResume {
    name: string;
    title: string;
    email: string;
    github?: string;
    linkedin?: string;
    experience: Array<{
        role: string;
        company: string;
        duration: string;
        location: string;
        description: string[];
    }>;
    projects: Array<{
        title: string;
        techStack: string[];
        description: string[];
        link?: string;
    }>;
    education: Array<{
        institution: string;
        degree: string;
        duration: string;
        grade: string;
    }>;
    skills: {
        languages: string[];
        databases: string[];
        tools: string[];
        frameworks: string[];
    };
}

export const parseResumeText = (text: string): Partial<ParsedResume> => {
    const result: Partial<ParsedResume> = {
        experience: [],
        projects: [],
        education: [],
        skills: {
            languages: [],
            databases: [],
            tools: [],
            frameworks: []
        }
    };

    // Extract email
    const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/);
    if (emailMatch) {
        result.email = emailMatch[0];
    }

    // Extract GitHub URL
    const githubMatch = text.match(/github\.com\/[\w-]+/i);
    if (githubMatch) {
        result.github = `https://${githubMatch[0]}`;
    }

    // Extract LinkedIn URL
    const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
    if (linkedinMatch) {
        result.linkedin = `https://${linkedinMatch[0]}`;
    }

    // Extract name (first line or before email)
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length > 0) {
        result.name = lines[0].trim();
    }

    // Extract title (usually second line or after name)
    if (lines.length > 1) {
        result.title = lines[1].trim();
    }

    // Parse sections
    const sections = text.split(/\n(?=[A-Z][A-Z\s]+\n)|(?:^|\n)(?:EXPERIENCE|PROJECTS|EDUCATION|SKILLS|TECHNICAL SKILLS)/gi);

    sections.forEach(section => {
        const sectionLower = section.toLowerCase();

        // Parse Experience
        if (sectionLower.includes('experience')) {
            const experiences = parseExperience(section);
            if (experiences.length > 0) {
                result.experience = experiences;
            }
        }

        // Parse Projects
        if (sectionLower.includes('project')) {
            const projects = parseProjects(section);
            if (projects.length > 0) {
                result.projects = projects;
            }
        }

        // Parse Education
        if (sectionLower.includes('education')) {
            const education = parseEducation(section);
            if (education.length > 0) {
                result.education = education;
            }
        }

        // Parse Skills
        if (sectionLower.includes('skill')) {
            const skills = parseSkills(section);
            if (skills) {
                result.skills = { ...result.skills, ...skills };
            }
        }
    });

    return result;
};

const parseExperience = (text: string): any[] => {
    const experiences: any[] = [];
    const lines = text.split('\n').filter(line => line.trim());

    // Simple pattern matching for experiences
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line && !line.match(/^(EXPERIENCE|Experience)/i)) {
            // Look for company/role patterns
            if (line.match(/[A-Z]/)) {
                const exp: any = {
                    role: line,
                    company: lines[i + 1] || '',
                    duration: '',
                    location: '',
                    description: []
                };

                // Collect description bullet points
                let j = i + 2;
                while (j < lines.length && lines[j].trim().startsWith('•')) {
                    exp.description.push(lines[j].trim().replace(/^•\s*/, ''));
                    j++;
                }

                if (exp.description.length > 0) {
                    experiences.push(exp);
                    i = j - 1;
                }
            }
        }
    }

    return experiences;
};

const parseProjects = (text: string): any[] => {
    const projects: any[] = [];
    const lines = text.split('\n').filter(line => line.trim());

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line && !line.match(/^(PROJECTS|Projects)/i)) {
            // Look for project titles
            if (line.match(/[A-Z]/) && !line.startsWith('•')) {
                const project: any = {
                    title: line,
                    techStack: [],
                    description: [],
                    link: ''
                };

                // Check for GitHub link
                const githubMatch = lines.slice(i, i + 3).join(' ').match(/github\.com\/[\w-]+\/[\w-]+/i);
                if (githubMatch) {
                    project.link = `https://${githubMatch[0]}`;
                }

                // Collect description bullet points
                let j = i + 1;
                while (j < lines.length && (lines[j].trim().startsWith('•') || lines[j].trim().startsWith('-'))) {
                    project.description.push(lines[j].trim().replace(/^[•-]\s*/, ''));
                    j++;
                }

                if (project.description.length > 0) {
                    projects.push(project);
                    i = j - 1;
                }
            }
        }
    }

    return projects;
};

const parseEducation = (text: string): any[] => {
    const education: any[] = [];
    const lines = text.split('\n').filter(line => line.trim());

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line && !line.match(/^(EDUCATION|Education)/i)) {
            if (line.match(/University|College|Institute|School/i)) {
                education.push({
                    institution: line,
                    degree: lines[i + 1] || '',
                    duration: lines[i + 2] || '',
                    grade: lines[i + 3] || ''
                });
            }
        }
    }

    return education;
};

const parseSkills = (text: string): any => {
    const skills = {
        languages: [] as string[],
        databases: [] as string[],
        tools: [] as string[],
        frameworks: [] as string[]
    };

    // Common programming languages
    const languagePattern = /\b(Python|Java|JavaScript|TypeScript|C\+\+|C|Go|Rust|Ruby|PHP|Swift|Kotlin|Scala|R|MATLAB|Gosu)\b/gi;
    const languages = text.match(languagePattern);
    if (languages) {
        skills.languages = [...new Set(languages.map(l => l.charAt(0).toUpperCase() + l.slice(1)))];
    }

    // Common databases
    const dbPattern = /\b(MySQL|PostgreSQL|MongoDB|Redis|SQLite|Oracle|SQL Server|Cassandra|DynamoDB|Firebase)\b/gi;
    const databases = text.match(dbPattern);
    if (databases) {
        skills.databases = [...new Set(databases.map(d => d.charAt(0).toUpperCase() + d.slice(1)))];
    }

    // Common tools
    const toolPattern = /\b(Docker|Kubernetes|Git|Jenkins|Terraform|Ansible|Prometheus|Grafana|Postman|VS Code|IntelliJ|Eclipse|Power BI|Tableau)\b/gi;
    const tools = text.match(toolPattern);
    if (tools) {
        skills.tools = [...new Set(tools.map(t => t.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')))];
    }

    // Common frameworks
    const frameworkPattern = /\b(React|Angular|Vue|Next\.js|Express|FastAPI|Flask|Django|Spring|TensorFlow|PyTorch|Scikit-Learn|Keras|Tailwind CSS|Bootstrap|Node\.js)\b/gi;
    const frameworks = text.match(frameworkPattern);
    if (frameworks) {
        skills.frameworks = [...new Set(frameworks.map(f => {
            if (f.toLowerCase() === 'next.js') return 'Next.js';
            if (f.toLowerCase() === 'node.js') return 'Node.js';
            return f.charAt(0).toUpperCase() + f.slice(1);
        }))];
    }

    return skills;
};

export const parsePDFFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target?.result as string;
                // Basic PDF text extraction (you can enhance this with a library)
                resolve(text);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
};
