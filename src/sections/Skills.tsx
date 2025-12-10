import { motion } from "framer-motion";
import { resumeData } from "../data/resume";

export const Skills = () => {
    const categories = Object.keys(resumeData.skills) as Array<keyof typeof resumeData.skills>;

    return (
        <section id="skills" className="py-20 relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16 text-center md:text-left"
            >
                <span className="text-purple-500 font-medium tracking-wider text-sm uppercase">Technologies</span>
                <h2 className="text-4xl md:text-5xl font-bold mt-2">Technical Skills</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {categories.map((category, index) => (
                    <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-purple-500/30 hover:bg-white/[0.07] transition-all group"
                    >
                        <h3 className="text-xl font-bold capitalize mb-4 text-purple-400 border-b border-white/10 pb-2 group-hover:text-purple-300 transition-colors">
                            {category}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {resumeData.skills[category].map((skill, skillIndex) => (
                                <motion.span
                                    key={skill}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    transition={{ delay: skillIndex * 0.02 }}
                                    viewport={{ once: true }}
                                    className="px-3 py-1.5 text-sm bg-white/5 rounded-lg text-gray-300 hover:bg-purple-500/20 hover:text-white hover:border-purple-500/50 border border-transparent transition-all cursor-default"
                                >
                                    {skill}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
