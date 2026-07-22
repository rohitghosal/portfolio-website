import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Preload, useGLTF, Points, PointMaterial } from '@react-three/drei';
import { random } from 'maath';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import './HeroScene.css';

/* ── Earth Model (exact same as ladunjexa reference) ───── */
function Earth() {
  const earth = useGLTF('./planet/scene.gltf');
  return (
    <primitive object={earth.scene} scale={2.8} position-y={-0.4} rotation-y={0} />
  );
}

/* ── Scene Background Manager ──────────────────────────── */
function SceneBackground({ theme }) {
  const { scene } = useThree();

  useEffect(() => {
    if (theme === 'dark') {
      scene.background = new THREE.Color('#06060e');
    } else {
      scene.background = new THREE.Color('#f0ece6');
    }
  }, [theme, scene]);

  return null;
}

/* ── Stars (maath inSphere — same as reference) ────────── */
function Stars(props) {
  const ref = useRef();
  const { theme } = useTheme();

  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5001), { radius: 15 })
  );

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color={theme === 'dark' ? '#f272c8' : '#000000'}
          size={0.08}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

/* ── Main Scene ────────────────────────────────────────── */
export default function HeroScene() {
  const { theme } = useTheme();

  return (
    <div className="hero-scene-container">
      <Canvas
        shadows
        frameloop="demand"
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true, alpha: false }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [-4, 3, 6],
        }}
      >
        <SceneBackground theme={theme} />

        <Suspense fallback={null}>
          {/* Orbit controls — auto rotate, no zoom/pan */}
          <OrbitControls
            autoRotate
            enablePan={false}
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />

          {/* Lighting — brighter in light mode */}
          <ambientLight intensity={theme === 'dark' ? 0.3 : 0.8} />
          <directionalLight
            position={[5, 3, 5]}
            intensity={theme === 'dark' ? 1.5 : 2.0}
          />
          <pointLight
            position={[-5, -3, 3]}
            intensity={0.5}
            color={theme === 'dark' ? '#8b5cf6' : '#7c3aed'}
          />

          {/* Earth GLTF model */}
          <Earth />

          {/* Stars inline */}
          <Stars />

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
