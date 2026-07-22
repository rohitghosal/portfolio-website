import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { scrollToSection } from '../hooks/useLenis';
import './Navbar.css';

const navLinks = [
  { label: 'Home', target: '#hero' },
  { label: 'About', target: '#about' },
  { label: 'Projects', target: '#projects' },
  { label: 'Skills', target: '#skills' },
  { label: 'Journey', target: '#timeline' },
  { label: 'Contact', target: '#contact' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [sliderStyle, setSliderStyle] = useState({});
  const linksContainerRef = useRef(null);
  const linkRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detect which section is currently in view
  useEffect(() => {
    const sectionIds = navLinks.map(l => l.target.replace('#', ''));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionIds.indexOf(entry.target.id);
            if (idx !== -1) {
              setActiveIndex(idx);
            }
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Position the glass slider based on active or hovered link
  const updateSlider = useCallback(() => {
    const targetIdx = hoverIndex !== null ? hoverIndex : activeIndex;
    const linkEl = linkRefs.current[targetIdx];
    const container = linksContainerRef.current;

    if (linkEl && container) {
      const containerRect = container.getBoundingClientRect();
      const linkRect = linkEl.getBoundingClientRect();

      setSliderStyle({
        width: `${linkRect.width + 24}px`,
        height: `${linkRect.height + 12}px`,
        transform: `translateX(${linkRect.left - containerRect.left - 12}px)`,
        opacity: 1,
      });
    }
  }, [activeIndex, hoverIndex]);

  useEffect(() => {
    updateSlider();
  }, [updateSlider]);

  // Recalculate on resize
  useEffect(() => {
    window.addEventListener('resize', updateSlider);
    return () => window.removeEventListener('resize', updateSlider);
  }, [updateSlider]);

  const handleNavClick = (e, target, index) => {
    e.preventDefault();
    setMobileOpen(false);
    setActiveIndex(index);
    scrollToSection(target);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="main-nav">
      <div className="navbar__inner">
        <a
          href="#hero"
          className="navbar__logo gradient-text"
          onClick={(e) => handleNavClick(e, '#hero', 0)}
        >
          RG<span className="navbar__logo-dot">.</span>
        </a>

        <div
          className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}
          ref={linksContainerRef}
        >
          {/* Liquid glass slider */}
          <div className="navbar__glass-slider" style={sliderStyle} />

          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.target}
              ref={(el) => (linkRefs.current[i] = el)}
              className={`navbar__link ${activeIndex === i ? 'navbar__link--active' : ''}`}
              onClick={(e) => handleNavClick(e, link.target, i)}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="navbar__actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            id="theme-toggle"
          >
            <div className={`theme-toggle__icon ${theme === 'dark' ? 'theme-toggle__icon--dark' : 'theme-toggle__icon--light'}`}>
              {/* Sun */}
              <svg className="theme-toggle__sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              {/* Moon */}
              <svg className="theme-toggle__moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </div>
          </button>

          <button
            className={`navbar__hamburger ${mobileOpen ? 'navbar__hamburger--open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
