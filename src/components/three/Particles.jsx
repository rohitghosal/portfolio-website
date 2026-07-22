import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { random } from 'maath';
import { useTheme } from '../../context/ThemeContext';

/**
 * Deep-space starfield using maath random.inSphere —
 * matches the ladunjexa reference with slowly rotating
 * point-cloud stars.
 */
export default function Stars({ scrollVelocity = 0 }) {
  const ref = useRef();
  const { theme } = useTheme();

  // 5000 stars distributed in a sphere
  const [positions] = useState(() =>
    random.inSphere(new Float32Array(5001), { radius: 1.2 })
  );

  // Smaller accent stars
  const [accents] = useState(() =>
    random.inSphere(new Float32Array(1500), { radius: 1.5 })
  );

  useFrame((_state, delta) => {
    if (ref.current) {
      // Slow continuous rotation like the reference
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
      // Speed up slightly with scroll velocity
      ref.current.rotation.z += Math.abs(scrollVelocity) * delta * 0.02;
    }
  });

  const starColor = theme === 'dark' ? '#f8f6f0' : '#4a4a6a';
  const accentColor = theme === 'dark' ? '#f272c8' : '#7c3aed';

  return (
    <group rotation={[0, 0, Math.PI / 4]} ref={ref}>
      {/* Main starfield */}
      <Points positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={starColor}
          size={0.002}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>

      {/* Accent-coloured stars */}
      <Points positions={accents} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={accentColor}
          size={0.003}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
}
