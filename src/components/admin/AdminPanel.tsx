import { useState } from 'react';
import { Upload, Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { parseResumeText } from '../../utils/resumeParser';
import { saveResumeData } from '../../utils/localStorage';

const ADMIN_PASSWORD = '12345678';

export const AdminPanel = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [parsing, setParsing] = useState(false);
    const [parsedData, setParsedData] = useState<any>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            setMessage(null);
        } else {
            setMessage({ type: 'error', text: 'Invalid password' });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setMessage(null);
        }
    };

    const handleParse = async () => {
        if (!file) {
            setMessage({ type: 'error', text: 'Please select a file first' });
            return;
        }

        setParsing(true);
        setMessage(null);

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const text = e.target?.result as string;
                const parsed = parseResumeText(text);
                setParsedData(parsed);
                setMessage({ type: 'success', text: 'Resume parsed successfully!' });
                setParsing(false);
            };
            reader.onerror = () => {
                setMessage({ type: 'error', text: 'Error reading file' });
                setParsing(false);
            };
            reader.readAsText(file);
        } catch (error) {
            setMessage({ type: 'error', text: 'Error parsing resume' });
            setParsing(false);
        }
    };

    const handleSave = () => {
        if (!parsedData) {
            setMessage({ type: 'error', text: 'No data to save' });
            return;
        }

        const success = saveResumeData(parsedData);
        if (success) {
            setMessage({ type: 'success', text: 'Resume data saved! Refresh the page to see changes.' });
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } else {
            setMessage({ type: 'error', text: 'Error saving data' });
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
                <div className="max-w-md w-full">
                    <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
                        <div className="flex items-center justify-center mb-6">
                            <div className="p-4 bg-purple-500/20 rounded-full">
                                <Lock size={32} className="text-purple-400" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-center mb-2">Admin Panel</h1>
                        <p className="text-gray-400 text-center mb-8">Enter password to access</p>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-3 pr-12 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                        placeholder="Enter password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {message && (
                                <div className={`p-4 rounded-xl ${message.type === 'error' ? 'bg-red-500/10 border border-red-500/50 text-red-400' : 'bg-green-500/10 border border-green-500/50 text-green-400'}`}>
                                    {message.text}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity"
                            >
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Resume Uploader</h1>
                    <p className="text-gray-400">Upload your resume to automatically update your portfolio</p>
                </div>

                <div className="bg-white/5 rounded-3xl p-8 border border-white/10 mb-6">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-4">
                                Upload Resume (TXT, PDF)
                            </label>
                            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 hover:border-purple-500/50 transition-colors">
                                <input
                                    type="file"
                                    accept=".txt,.pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="flex flex-col items-center cursor-pointer"
                                >
                                    <Upload size={48} className="text-purple-400 mb-4" />
                                    <p className="text-white font-medium mb-2">
                                        {file ? file.name : 'Click to upload or drag and drop'}
                                    </p>
                                    <p className="text-gray-400 text-sm">TXT or PDF files only</p>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleParse}
                                disabled={!file || parsing}
                                className="flex-1 bg-purple-500 text-white font-bold py-4 rounded-xl hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {parsing ? 'Parsing...' : 'Parse Resume'}
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!parsedData}
                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                            >
                                Save & Apply
                            </button>
                        </div>

                        {message && (
                            <div className={`flex items-center gap-3 p-4 rounded-xl ${message.type === 'error' ? 'bg-red-500/10 border border-red-500/50 text-red-400' : 'bg-green-500/10 border border-green-500/50 text-green-400'}`}>
                                {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                                <span>{message.text}</span>
                            </div>
                        )}
                    </div>
                </div>

                {parsedData && (
                    <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
                        <h2 className="text-2xl font-bold mb-6">Parsed Data Preview</h2>
                        <pre className="bg-black/50 p-6 rounded-xl overflow-auto text-sm text-gray-300 max-h-96">
                            {JSON.stringify(parsedData, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};
