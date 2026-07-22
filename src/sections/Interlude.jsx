import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Interlude.css';

gsap.registerPlugin(ScrollTrigger);

export default function Interlude({ words = ['DEPTH', 'MOTION'], id }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const wordEls = sectionRef.current?.querySelectorAll('.interlude__word');
      wordEls?.forEach((el, i) => {
        gsap.fromTo(el,
          { xPercent: i % 2 === 0 ? -30 : 30 },
          {
            xPercent: i % 2 === 0 ? 30 : -30,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="interlude" id={id} ref={sectionRef}>
      {words.map((word, i) => (
        <div key={i} className="interlude__word-container">
          <span className="interlude__word">{word}</span>
        </div>
      ))}
    </section>
  );
}
