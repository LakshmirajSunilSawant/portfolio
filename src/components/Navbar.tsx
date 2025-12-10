import { motion } from "framer-motion";
import { Link } from "react-scroll";

const navItems = [
    { name: "About", to: "hero" },
    { name: "Experience", to: "experience" },
    { name: "Projects", to: "projects" },
    { name: "Skills", to: "skills" },
    { name: "Contact", to: "contact" },
];

export const Navbar = () => {
    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6"
        >
            <ul className="flex items-center gap-8 rounded-full border border-white/10 bg-black/50 px-8 py-3 backdrop-blur-md shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300">
                {navItems.map((item) => (
                    <li key={item.name}>
                        <Link
                            to={item.to}
                            smooth={true}
                            duration={500}
                            className="relative cursor-pointer text-sm font-medium text-gray-400 hover:text-white transition-colors group"
                        >
                            {item.name}
                            <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </li>
                ))}
            </ul>
        </motion.nav>
    );
};
