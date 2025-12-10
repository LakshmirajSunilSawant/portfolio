import { useState } from 'react';
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Send, CheckCircle, AlertCircle } from "lucide-react";
import { resumeData } from "../data/resume";

export const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: 'YOUR_WEB3FORMS_ACCESS_KEY', // Will be replaced
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    subject: `New Portfolio Contact from ${formData.name}`,
                    from_name: 'Portfolio Contact Form'
                })
            });

            const data = await response.json();

            if (data.success) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
                setErrorMessage(data.message || 'Failed to send message');
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage('Network error. Please try again.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }));
    };

    return (
        <section id="contact" className="py-20 relative border-t border-white/10 mt-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="text-purple-500 font-medium tracking-wider text-sm uppercase">Get in Touch</span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6">Let's Connect</h2>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                    </p>

                    <div className="space-y-4">
                        <a
                            href={`mailto:${resumeData.email}`}
                            className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
                        >
                            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                <Mail size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Email</p>
                                <p className="text-white font-medium">{resumeData.email}</p>
                            </div>
                        </a>

                        <div className="flex gap-4 mt-6">
                            <a href={resumeData.social.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-lg hover:bg-white/10 text-white transition-colors">
                                <Github size={24} />
                            </a>
                            <a href={resumeData.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-lg hover:bg-white/10 text-white transition-colors">
                                <Linkedin size={24} />
                            </a>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white/5 p-8 rounded-3xl border border-white/10"
                >
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                disabled={status === 'loading'}
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={status === 'loading'}
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                            <textarea
                                id="message"
                                rows={4}
                                value={formData.message}
                                onChange={handleChange}
                                required
                                disabled={status === 'loading'}
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none disabled:opacity-50"
                                placeholder="Your message..."
                            ></textarea>
                        </div>

                        {status === 'success' && (
                            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/50 rounded-xl text-green-400">
                                <CheckCircle size={20} />
                                <span>Message sent successfully! I'll get back to you soon.</span>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400">
                                <AlertCircle size={20} />
                                <span>{errorMessage || 'Failed to send message. Please try again.'}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>{status === 'loading' ? 'Sending...' : 'Send Message'}</span>
                            <Send size={18} />
                        </button>
                    </form>
                </motion.div>
            </div>

            <footer className="mt-20 pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
                <p>© {new Date().getFullYear()} {resumeData.name}. All rights reserved.</p>
            </footer>
        </section>
    );
};
