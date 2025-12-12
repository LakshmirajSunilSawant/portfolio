import { motion } from "framer-motion";
import { ExternalLink, Code2 } from "lucide-react";
import { resumeData } from "../data/resume";


export const Projects = () => {
    return (
        <section id="projects" className="py-20 relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
            >
                <span className="text-purple-500 font-medium tracking-wider text-sm uppercase">Selected Work</span>
                <h2 className="text-4xl md:text-5xl font-bold mt-2">Projects</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {resumeData.projects.map((project, index) => (
                    <motion.a
                        key={index}
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.3 } }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative h-full bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all overflow-hidden flex flex-col cursor-pointer"
                    >
                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Ripple Effect on Hover */}
                        <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>

                        <div className="relative z-10 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400 group-hover:bg-purple-500/30 transition-colors">
                                    <Code2 size={24} />
                                </div>
                                {project.link && (
                                    <div className="text-gray-400 group-hover:text-purple-400 transition-colors">
                                        <ExternalLink size={20} />
                                    </div>
                                )}
                            </div>

                            <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
                                {project.title}
                            </h3>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.techStack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 border border-white/5 text-gray-300 group-hover:border-purple-500/30 group-hover:bg-purple-500/10 transition-colors"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            <div className="space-y-2 text-gray-400 text-sm leading-relaxed">
                                {project.description.map((desc, i) => (
                                    <p key={i}>{desc}</p>
                                ))}
                            </div>
                        </div>
                    </motion.a>
                ))}
            </div>
        </section>
    );
};
