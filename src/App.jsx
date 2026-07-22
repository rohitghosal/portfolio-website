import { ThemeProvider } from './context/ThemeContext';
import { useLenis } from './hooks/useLenis';
import { useLiquidGlass } from './hooks/useLiquidGlass';
import { useRef } from 'react';
import HeroScene from './components/three/HeroScene';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import Hero from './sections/Hero';
import About from './sections/About';
import Interlude from './sections/Interlude';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Timeline from './sections/Timeline';
import Contact from './sections/Contact';
import './App.css';

function AppContent() {
  useLenis();
  const rootRef = useRef(null);

  // Apply Liquid Glass to navbar and glass sections
  useLiquidGlass(rootRef, '.liquid-glass', {
    blurAmount: 0.2,
    refraction: 0.5,
    chromAberration: 0.03,
    edgeHighlight: 0.04,
    fresnel: 0.8,
    cornerRadius: 16,
    zRadius: 25,
    shadowOpacity: 0.1,
  });

  return (
    <div className="app" ref={rootRef} style={{ position: 'relative' }}>
      {/* 3D Background — fixed behind everything */}
      <HeroScene />

      {/* Navigation */}
      <Navbar />

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Film grain overlay */}
      <div className="film-grain" aria-hidden="true" />

      {/* Scrollable content */}
      <main className="main-content">
        <Hero />

        <Interlude words={['SECURITY', 'INNOVATION']} id="interlude-1" />

        <About />

        <Interlude words={['DEPTH', 'MOTION']} id="interlude-2" />

        <Projects />

        <Interlude words={['BUILD', 'PROTECT']} id="interlude-3" />

        <Skills />

        <Timeline />

        <Contact />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
