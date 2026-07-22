import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

// Simplex noise vertex shader for morphing blob
const vertexShader = `
  uniform float uTime;
  uniform float uScrollProgress;
  uniform vec2 uMouse;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  // Simplex 3D noise
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main() {
    vec3 pos = position;
    float breathe = sin(uTime * 0.5 + uScrollProgress * 3.14159) * 0.15;
    float noise = snoise(pos * 1.5 + uTime * 0.3) * (0.35 + breathe);
    noise += snoise(pos * 3.0 - uTime * 0.2) * 0.15;
    
    // Mouse influence
    float mouseInfluence = (uMouse.x * 0.1 + uMouse.y * 0.1);
    noise += mouseInfluence * 0.05;
    
    pos += normal * noise;
    vDisplacement = noise;
    vNormal = normalize(normalMatrix * normal);
    vPosition = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  void main() {
    // Fresnel effect for glow edges
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
    
    // Color gradient based on displacement + time
    float t = vDisplacement * 2.0 + 0.5;
    vec3 color = mix(uColor1, uColor2, smoothstep(0.0, 0.5, t));
    color = mix(color, uColor3, smoothstep(0.5, 1.0, t));
    
    // Add fresnel glow
    color += fresnel * uColor3 * 0.6;
    
    // Shimmer
    float shimmer = sin(vPosition.x * 10.0 + uTime) * sin(vPosition.y * 10.0 + uTime * 0.7) * 0.05;
    color += shimmer;
    
    gl_FragColor = vec4(color, 0.9);
  }
`;

export default function Blob({ scrollProgress, mousePosition }) {
  const meshRef = useRef();
  const shellRef = useRef();
  const { theme } = useTheme();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScrollProgress: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uColor1: { value: new THREE.Color('#8b5cf6') },
    uColor2: { value: new THREE.Color('#06b6d4') },
    uColor3: { value: new THREE.Color('#10b981') },
  }), []);

  // Update colors based on theme
  useMemo(() => {
    if (theme === 'light') {
      uniforms.uColor1.value.set('#7c3aed');
      uniforms.uColor2.value.set('#d4a017');
      uniforms.uColor3.value.set('#059669');
    } else {
      uniforms.uColor1.value.set('#8b5cf6');
      uniforms.uColor2.value.set('#06b6d4');
      uniforms.uColor3.value.set('#10b981');
    }
  }, [theme, uniforms]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    uniforms.uTime.value = t;
    uniforms.uScrollProgress.value = scrollProgress;
    uniforms.uMouse.value.set(mousePosition.x, mousePosition.y);

    if (meshRef.current) {
      // Drift side-to-side based on scroll
      meshRef.current.position.x = Math.sin(scrollProgress * Math.PI * 2) * 1.5;
      meshRef.current.position.y = Math.cos(t * 0.3) * 0.2;
      meshRef.current.rotation.y = t * 0.15;
      meshRef.current.rotation.x = t * 0.1;
    }

    if (shellRef.current) {
      // Counter-rotate the wireframe shell
      shellRef.current.rotation.y = -t * 0.1;
      shellRef.current.rotation.x = -t * 0.07;
      shellRef.current.rotation.z = t * 0.05;
    }
  });

  return (
    <group>
      {/* Morphing blob */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 64]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
        />
      </mesh>

      {/* Wireframe icosahedron shell */}
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[2.2, 1]} />
        <meshBasicMaterial
          color={theme === 'dark' ? '#8b5cf6' : '#7c3aed'}
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>
    </group>
  );
}
