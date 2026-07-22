import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload, useGLTF } from '@react-three/drei';

/* ── Earth GLTF model (same as ladunjexa reference) ───── */
function Earth() {
  const earth = useGLTF('./planet/scene.gltf');
  return (
    <primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />
  );
}

/* ── Earth Canvas — to be placed in the Contact section ── */
export default function EarthCanvas() {
  return (
    <Canvas
      shadows
      frameloop="demand"
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
      style={{ pointerEvents: 'auto' }}
    >
      <Suspense fallback={null}>
        <OrbitControls
          autoRotate
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} />
        <pointLight position={[-5, -3, 3]} intensity={0.5} color="#8b5cf6" />
        <Earth />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
