import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Skills.css';

gsap.registerPlugin(ScrollTrigger);

const capabilities = [
  {
    title: 'Threat Intelligence & OSINT',
    description: 'Expert in MISP, Azure Sentinel, dark web monitoring, brand protection strategies, and advanced OSINT investigations. Certified Threat Intelligence Analyst.',
    icon: '🛡️',
    skills: ['MISP', 'Azure Sentinel', 'OSINT', 'Dark Web', 'Brand Protection'],
  },
  {
    title: 'Full-Stack Development',
    description: 'Building end-to-end applications with MERN stack, Django, Flutter, and modern frontend frameworks. From mobile apps to scalable web platforms.',
    icon: '⚡',
    skills: ['React', 'Node.js', 'Django', 'Flutter', 'Firebase'],
  },
  {
    title: 'DevSecOps & Automation',
    description: 'Integrating security into CI/CD pipelines, automating threat detection workflows, and building self-healing database pipelines with Python.',
    icon: '🔧',
    skills: ['Python', 'CI/CD', 'Docker', 'Automation', 'SQL'],
  },
  {
    title: 'Data Visualization & ML',
    description: 'Exploratory data analysis, machine learning model development, and creating actionable insights through compelling data visualizations.',
    icon: '📊',
    skills: ['Python', 'ML/DL', 'Data Viz', 'EDA', 'AI Enrichment'],
  },
];

export default function Skills() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Simple stagger reveal — no sticky pinning, works in both themes
      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        gsap.fromTo(card,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Subtle 3D tilt on hover effect via CSS, no brightness filter
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section skills" id="skills" ref={sectionRef}>
      <div className="section-inner">
        <div className="about__label font-mono">
          <span className="about__label-line"></span>
          CAPABILITIES
        </div>

        <div className="skills__stack">
          {capabilities.map((cap, i) => (
            <div
              key={i}
              ref={(el) => (cardsRef.current[i] = el)}
              className="skills__card glass-strong"
              style={{ '--card-index': i }}
            >
              <div className="skills__card-icon">{cap.icon}</div>
              <div className="skills__card-content">
                <h3 className="skills__card-title">{cap.title}</h3>
                <p className="skills__card-description">{cap.description}</p>
                <div className="skills__card-tags">
                  {cap.skills.map((skill) => (
                    <span key={skill} className="skills__card-tag font-mono">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="skills__card-number font-mono">0{i + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
