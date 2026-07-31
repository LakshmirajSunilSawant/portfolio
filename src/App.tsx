import { Grain } from './components/Grain';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Experience } from './sections/Experience';
import { Projects } from './sections/Projects';
import { Skills } from './sections/Skills';
import { Contact } from './sections/Contact';

const App = () => (
    <>
        <Grain />
        <Header />
        <main>
            <Hero />
            <About />
            <Experience />
            <Projects />
            <Skills />
            <Contact />
        </main>
        <Footer />
    </>
);

export default App;
