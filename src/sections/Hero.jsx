import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(titleRef.current?.querySelectorAll('.hero__char') || [],
        { y: 100, opacity: 0, rotateX: -90 },
        {
          y: 0, opacity: 1, rotateX: 0,
          duration: 1.2,
          stagger: 0.04,
          ease: 'power4.out',
          delay: 0.5,
        }
      );

      // Subtitle fade in
      gsap.fromTo(subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 1.5, ease: 'power3.out' }
      );

      // Scroll indicator
      gsap.fromTo(scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, delay: 2, duration: 1 }
      );

      // Parallax on scroll
      gsap.to(titleRef.current, {
        y: -150,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const name = 'ROHIT GHOSAL';
  const chars = name.split('');

  return (
    <section className="section hero" id="hero" ref={sectionRef}>
      <div className="hero__content">
        <div className="hero__badge font-mono">
          <span className="hero__badge-dot"></span>
          Available for Opportunities
        </div>
        <h1 className="hero__title" ref={titleRef}>
          {chars.map((char, i) => (
            <span key={i} className="hero__char" style={{ display: char === ' ' ? 'inline' : 'inline-block' }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>
        <div className="hero__pills-wrapper" ref={subtitleRef}>
          <div className="hero__subtitle hero__subtitle-pill glass">
            <span className="gradient-text">Cyber Security Consultant</span>
            <span className="hero__divider">•</span>
            <span>Developer</span>
            <span className="hero__divider">•</span>
            <span>Creator</span>
          </div>
          <div className="hero__role hero__role-pill glass font-mono">
            Senior Associate @ PwC India
          </div>
        </div>
      </div>
      
      <div className="hero__scroll-indicator" ref={scrollIndicatorRef}>
        <div className="hero__scroll-line"></div>
        <span className="hero__scroll-text font-mono">SCROLL</span>
      </div>
    </section>
  );
}
