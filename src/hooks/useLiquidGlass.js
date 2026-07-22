import { useEffect, useRef } from 'react';

/**
 * Hook to apply Apple-style Liquid Glass effect to elements.
 * Uses @ybouane/liquidglass for realistic glass refraction,
 * blur, chromatic aberration, and lighting effects via WebGL shaders.
 */
export function useLiquidGlass(rootRef, glassSelector = '.liquid-glass', config = {}) {
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return;

    let destroyed = false;

    async function init() {
      try {
        const { LiquidGlass } = await import('@ybouane/liquidglass');

        if (destroyed) return;

        const root = rootRef.current;
        const glassElements = root.querySelectorAll(glassSelector);

        if (!glassElements.length) return;

        // Apply default config to each glass element
        const defaultConfig = {
          blurAmount: 0.2,
          refraction: 0.5,
          chromAberration: 0.03,
          edgeHighlight: 0.04,
          specular: 0,
          fresnel: 0.8,
          cornerRadius: 20,
          zRadius: 30,
          shadowOpacity: 0.15,
          brightness: 0,
          saturation: 0,
          ...config,
        };

        glassElements.forEach((el) => {
          if (!el.dataset.config) {
            el.dataset.config = JSON.stringify(defaultConfig);
          }
        });

        const instance = await LiquidGlass.init({
          root,
          glassElements,
        });

        if (destroyed) {
          instance.destroy();
          return;
        }

        instanceRef.current = instance;
      } catch (err) {
        // Silently fail — CSS glassmorphism fallback is already in place
        console.warn('LiquidGlass not available, using CSS fallback:', err.message);
      }
    }

    // Delay init slightly to ensure DOM is fully rendered
    const timer = setTimeout(init, 500);

    return () => {
      destroyed = true;
      clearTimeout(timer);
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, [rootRef, glassSelector, config]);

  return instanceRef;
}
