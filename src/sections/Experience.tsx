import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { resumeData } from "../data/resume";

export const Experience = () => {
    return (
        <section id="experience" className="py-20 relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
            >
                <span className="text-purple-500 font-medium tracking-wider text-sm uppercase">Career Path</span>
                <h2 className="text-4xl md:text-5xl font-bold mt-2">Experience</h2>
            </motion.div>

            <div className="relative border-l border-white/10 ml-4 md:ml-10 space-y-12">
                {resumeData.experience.map((exp, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="relative pl-8 md:pl-16"
                    >
                        {/* Timeline Dot */}
                        <div className="absolute -left-[5px] top-0 h-3 w-3 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>

                        <div className="group relative overflow-hidden rounded-2xl bg-white/5 p-6 hover:bg-white/10 transition-colors border border-white/5 hover:border-white/10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{exp.role}</h3>
                                    <div className="flex items-center gap-2 text-purple-400 font-medium">
                                        <Briefcase size={16} />
                                        <span>{exp.company}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start md:items-end gap-1 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} />
                                        <span>{exp.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} />
                                        <span>{exp.location}</span>
                                    </div>
                                </div>
                            </div>

                            <ul className="space-y-2 list-disc list-outside ml-4 text-gray-300">
                                {exp.description.map((desc, i) => (
                                    <li key={i} className="leading-relaxed">
                                        {desc}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
