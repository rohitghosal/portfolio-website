import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: 'NocturnOps',
    subtitle: 'Ransomware Victim Detection Platform',
    description: 'An automated, real-time Threat Intelligence platform to monitor and aggregate ransomware group activities across the dark web. Features AI-driven enrichment, live geographical mapping, and actionable adversary tracking.',
    tags: ['Python', 'Flutter', 'AI/ML', 'Dark Web', 'Threat Intel'],
    color: '#8b5cf6',
    link: '#',
    duration: '7 Months',
  },
  {
    id: 2,
    title: 'Chatify',
    subtitle: 'Real-time Chat Application',
    description: 'A real-time chat application with Android integration. Chat with friends in different rooms securely and seamlessly with instant message delivery.',
    tags: ['Node.js', 'Socket.io', 'Android', 'Java'],
    color: '#10b981',
    link: 'https://github.com/rohitghosal/Chatify_version1.0.0',
    duration: 'Full Stack',
  },
  {
    id: 3,
    title: 'Image-Text-Detector',
    subtitle: 'Firebase ML Vision OCR',
    description: 'Android application for detecting and extracting text from images using Firebase ML Vision. Scan your images and extract text with ease.',
    tags: ['Java', 'Android', 'Firebase', 'ML Vision'],
    color: '#06b6d4',
    link: 'https://github.com/rohitghosal/Image-Text-Detector',
    duration: 'Mobile App',
  },
  {
    id: 4,
    title: 'WhatsApp Analytics',
    subtitle: 'Chat Data Visualization & EDA',
    description: 'Analyze WhatsApp group statistics — discover who sends the most messages, unique emojis used, activity patterns, and more through data visualization.',
    tags: ['Python', 'Data Science', 'EDA', 'Visualization'],
    color: '#f59e0b',
    link: 'https://github.com/rohitghosal/wap_grc_anls',
    duration: 'Data Project',
  },
];

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (y - 0.5) * -15,
      y: (x - 0.5) * 15,
    });
    setGlarePos({ x: x * 100, y: y * 100 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlarePos({ x: 50, y: 50 });
  };

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { y: 80, opacity: 0, rotateX: 5 },
      {
        y: 0, opacity: 1, rotateX: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  return (
    <div
      ref={cardRef}
      className="project-card glass"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        '--card-accent': project.color,
      }}
    >
      <div
        className="project-card__glare"
        style={{
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
        }}
      />

      <div className="project-card__header">
        <span className="project-card__number font-mono">0{index + 1}</span>
        <span className="project-card__duration font-mono">{project.duration}</span>
      </div>

      <h3 className="project-card__title">{project.title}</h3>
      <p className="project-card__subtitle">{project.subtitle}</p>
      <p className="project-card__description">{project.description}</p>

      <div className="project-card__tags">
        {project.tags.map((tag) => (
          <span key={tag} className="project-card__tag font-mono">{tag}</span>
        ))}
      </div>

      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="project-card__button magnetic-btn"
      >
        <span>View Project</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      </a>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);
  const marqueeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Marquee animation
      const marquees = marqueeRef.current?.querySelectorAll('.marquee__inner');
      marquees?.forEach((el, i) => {
        gsap.to(el, {
          xPercent: i % 2 === 0 ? -50 : 50,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section projects" id="projects" ref={sectionRef}>
      <div className="section-inner">
        <div className="about__label font-mono">
          <span className="about__label-line"></span>
          FEATURED WORK
        </div>

        <div className="projects__grid">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        <div className="projects__marquee" ref={marqueeRef}>
          <div className="marquee__track">
            <div className="marquee__inner">
              {'SECURITY • DEVELOPMENT • INNOVATION • RESEARCH • '.repeat(4)}
            </div>
          </div>
          <div className="marquee__track">
            <div className="marquee__inner marquee__inner--reverse">
              {'THREAT INTEL • OSINT • DEVOPS • FLUTTER • REACT • '.repeat(4)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
