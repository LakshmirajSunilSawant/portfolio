import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { resumeData } from "../data/resume";
import { Link } from "react-scroll";

export const Hero = () => {
    return (
        <section id="hero" className="min-h-screen flex flex-col justify-center relative pt-20">
            <div className="max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex items-center gap-2 mb-6"
                >
                    <div className="h-[2px] w-12 bg-purple-500"></div>
                    <span className="text-purple-400 font-medium tracking-wide">HELLO WORLD</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
                >
                    I'm <span className="text-white">{resumeData.name.split(" ")[0]}</span>.
                    <br />
                    <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-purple-400 bg-clip-text text-transparent bg-[200%_auto] animate-gradient">
                        {resumeData.title}
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
                >
                    {resumeData.about}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-wrap gap-4"
                >
                    <Link
                        to="projects"
                        smooth={true}
                        duration={500}
                        className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        View Projects
                    </Link>
                    <div className="flex gap-4 items-center px-4">
                        <a href={resumeData.social.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors">
                            <Github size={20} />
                        </a>
                        <a href={resumeData.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors">
                            <Linkedin size={20} />
                        </a>
                        <a href={`mailto:${resumeData.email}`} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors">
                            <Mail size={20} />
                        </a>
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-400"
            >
                <ArrowDown size={24} />
            </motion.div>
        </section>
    );
};
