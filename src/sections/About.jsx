import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 4, suffix: '+', label: 'Years Experience' },
  { value: 14, suffix: '+', label: 'Projects Built' },
  { value: 3, suffix: '', label: 'Certifications' },
  { value: 1, suffix: '', label: "Chairperson's Award" },
];

const manifesto = `I'm a Cyber Security professional at PwC India with a passion for building innovative solutions. From threat intelligence and OSINT investigations to full-stack development and machine learning — I thrive at the intersection of security and technology. My work spans dark web monitoring, brand protection, DevSecOps automation, and malware analysis. I believe in continuous growth and pushing boundaries in the ever-evolving cybersecurity landscape.`;

export default function About() {
  const sectionRef = useRef(null);
  const wordsRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Word-by-word scrub
      const words = wordsRef.current?.querySelectorAll('.about__word');
      if (words?.length) {
        gsap.fromTo(words,
          { opacity: 0.15 },
          {
            opacity: 1,
            stagger: 0.05,
            scrollTrigger: {
              trigger: wordsRef.current,
              start: 'top 80%',
              end: 'bottom 60%',
              scrub: 1,
            },
          }
        );
      }

      // Stat counters
      const statEls = statsRef.current?.querySelectorAll('.about__stat-value');
      statEls?.forEach((el) => {
        const target = parseInt(el.getAttribute('data-value'), 10);
        gsap.fromTo(el,
          { innerText: 0 },
          {
            innerText: target,
            duration: 2,
            ease: 'power2.out',
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Stats cards stagger
      gsap.fromTo(
        statsRef.current?.querySelectorAll('.about__stat-card') || [],
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const words = manifesto.split(' ');

  return (
    <section className="section about" id="about" ref={sectionRef}>
      <div className="section-inner">
        <div className="about__label font-mono">
          <span className="about__label-line"></span>
          ABOUT ME
        </div>

        <div className="about__manifesto glass" ref={wordsRef}>
          <p className="about__text">
            {words.map((word, i) => (
              <span key={i} className="about__word">{word} </span>
            ))}
          </p>
        </div>

        <div className="about__stats" ref={statsRef}>
          {stats.map((stat, i) => (
            <div key={i} className="about__stat-card glass">
              <span className="about__stat-value gradient-text" data-value={stat.value}>
                0
              </span>
              <span className="about__stat-suffix gradient-text">{stat.suffix}</span>
              <span className="about__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
