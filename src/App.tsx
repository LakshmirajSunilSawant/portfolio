import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from "./components/Navbar";
import { useMousePosition } from "./hooks/useMousePosition";
import { Hero } from "./sections/Hero";
import { Experience } from "./sections/Experience";
import { Projects } from "./sections/Projects";
import { Skills } from "./sections/Skills";
import { Contact } from "./sections/Contact";
import { ParticlesBackground } from "./components/ParticlesBackground";
import { CursorTrail } from "./components/CursorTrail";
import { AdminPanel } from "./components/admin/AdminPanel";
import { useEffect } from 'react';
import { loadResumeData } from './utils/localStorage';
import { resumeData as defaultResumeData } from './data/resume';

function MainPortfolio() {
  const { x, y } = useMousePosition();

  // Load custom resume data if available
  useEffect(() => {
    const customData = loadResumeData();
    if (customData) {
      // Merge custom data with default data
      Object.assign(defaultResumeData, customData);
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-purple-500/30">
      {/* Particles Background */}
      <ParticlesBackground />

      {/* Cursor Trail */}
      <CursorTrail />

      {/* Spotlight Effect */}
      <div
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${x}px ${y}px, rgba(147, 51, 234, 0.15), transparent 80%)`,
        }}
      />

      {/* Grid Background Pattern */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <Navbar />

      <main className="relative z-10 px-6 md:px-12 lg:px-24">
        <Hero />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPortfolio />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
