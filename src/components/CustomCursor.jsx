import { useEffect, useRef, useState } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    // Don't show custom cursor on touch devices
    if ('ontouchstart' in window) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    const move = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dot) {
        dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
      }
    };

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.12;
      cursorY += (mouseY - cursorY) * 0.12;
      if (cursor) {
        cursor.style.transform = `translate(${cursorX - 20}px, ${cursorY - 20}px) scale(${hovered ? 1.5 : 1})`;
      }
      requestAnimationFrame(animate);
    };

    const handleMouseOver = (e) => {
      // Skip expansion when hovering inside the navbar
      if (e.target.closest('.navbar')) return;

      if (e.target.closest('a, button, .interactive')) {
        setHovered(true);
      }
    };

    const handleMouseOut = (e) => {
      if (e.target.closest('a, button, .interactive')) {
        setHovered(false);
      }
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);
    animate();

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [hovered]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

  return (
    <>
      <div ref={cursorRef} className={`custom-cursor ${hovered ? 'custom-cursor--hovered' : ''}`} />
      <div ref={dotRef} className="custom-cursor-dot" />
    </>
  );
}
