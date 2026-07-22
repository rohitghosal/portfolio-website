import { useEffect, useState } from 'react';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [velocity, setVelocity] = useState(0);

  useEffect(() => {
    let lastScroll = 0;
    let lastTime = Date.now();

    function handleScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(Math.min(1, Math.max(0, p)));

      const now = Date.now();
      const dt = now - lastTime;
      if (dt > 0) {
        const v = Math.abs(scrollTop - lastScroll) / dt;
        setVelocity(v);
      }
      lastScroll = scrollTop;
      lastTime = now;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { progress, velocity };
}
