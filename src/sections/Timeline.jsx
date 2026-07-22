import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Timeline.css';

gsap.registerPlugin(ScrollTrigger);

const timelineItems = [
  {
    year: '2016',
    title: 'Class X — 94%',
    description: 'West Bengal Board of Secondary Education',
    type: 'education',
  },
  {
    year: '2018',
    title: 'Class XII — 89%',
    description: 'West Bengal Council of Higher Secondary Education',
    type: 'education',
  },
  {
    year: '2022',
    title: 'B.Tech in Computer Science',
    description: 'West Bengal University of Technology (WBUT)',
    type: 'education',
  },
  {
    year: '2022',
    title: 'Joined PwC India',
    description: 'Started as Associate in Cyber Security consulting at PricewaterhouseCoopers',
    type: 'career',
  },
  {
    year: '2024',
    title: "Chairperson's Award",
    description: 'Received prestigious award for exceptional performance and contribution at PwC India',
    type: 'achievement',
  },
  {
    year: '2025',
    title: 'Certified Threat Intelligence Analyst',
    description: 'Achieved CTIA certification, validating expertise in threat intelligence',
    type: 'certification',
  },
  {
    year: '2026',
    title: 'Senior Associate — Cyber Security',
    description: 'Promoted to Senior Associate. Leading threat intelligence, OSINT, and dark web monitoring operations',
    type: 'career',
  },
];

const typeIcons = {
  education: '🎓',
  career: '💼',
  achievement: '🏆',
  certification: '📜',
};

export default function Timeline() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the line growth
      gsap.fromTo(lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: 1,
          },
        }
      );

      // Animate each item
      itemsRef.current.forEach((item) => {
        if (!item) return;
        gsap.fromTo(item,
          { opacity: 0, x: item.dataset.side === 'left' ? -60 : 60 },
          {
            opacity: 1, x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section timeline" id="timeline" ref={sectionRef}>
      <div className="section-inner">
        <div className="about__label font-mono">
          <span className="about__label-line"></span>
          MY JOURNEY
        </div>

        <div className="timeline__container">
          <div className="timeline__line" ref={lineRef}></div>

          {timelineItems.map((item, i) => {
            const side = i % 2 === 0 ? 'left' : 'right';
            return (
              <div
                key={i}
                ref={(el) => (itemsRef.current[i] = el)}
                className={`timeline__item timeline__item--${side}`}
                data-side={side}
              >
                <div className="timeline__dot">
                  <span>{typeIcons[item.type]}</span>
                </div>
                <div className="timeline__card glass">
                  <span className="timeline__year font-mono">{item.year}</span>
                  <h3 className="timeline__title">{item.title}</h3>
                  <p className="timeline__description">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
