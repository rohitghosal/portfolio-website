import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

/* ──────────────────────────────────────────────────────────
   Stylised procedural planet with swirling atmosphere bands,
   inner glow, and orbiting ring — inspired by the ladunjexa
   3D-portfolio aesthetic but fully procedural (no GLTF).
   ────────────────────────────────────────────────────────── */

// ── Planet Surface Shader ────────────────────────────────
const planetVertex = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const planetFragment = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // Simplex-like hash
  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(dot(hash(i), f),
                   dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
               mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                   dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // Swirling bands — latitude-based with noise distortion
    vec2 uv = vUv;
    float lat = uv.y;
    float lon = uv.x;

    // Distort longitude for organic swirl
    float swirl = fbm(vec2(lon * 4.0 + uTime * 0.05, lat * 8.0)) * 0.6;
    float bands = fbm(vec2(lon * 6.0 + swirl + uTime * 0.02, lat * 12.0 + uTime * 0.01));

    // Deep surface pattern
    float detail = fbm(vec2(lon * 16.0 + uTime * 0.03, lat * 16.0 - uTime * 0.015)) * 0.3;

    // Combine into a continent-like pattern
    float pattern = bands + detail;

    // Map pattern to 4-colour palette
    vec3 color = uColor1; // deep ocean
    color = mix(color, uColor2, smoothstep(-0.2, 0.1, pattern));  // shallow ocean
    color = mix(color, uColor3, smoothstep(0.1, 0.35, pattern));  // land
    color = mix(color, uColor4, smoothstep(0.35, 0.6, pattern));  // highlights/peaks

    // Fresnel edge glow (atmosphere rim)
    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.5);
    color += fresnel * uColor2 * 0.8;

    // Subtle specular highlight
    vec3 lightDir = normalize(vec3(1.0, 0.5, 0.8));
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(vNormal, halfDir), 0.0), 40.0);
    color += spec * vec3(1.0, 0.95, 0.9) * 0.4;

    // Soft diffuse lighting
    float diffuse = max(dot(vNormal, lightDir), 0.0);
    color *= 0.5 + diffuse * 0.6;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// ── Atmosphere Glow Shader ───────────────────────────────
const atmosphereVertex = `
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragment = `
  uniform vec3 uAtmosphereColor;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.5);
    float alpha = fresnel * uIntensity;
    gl_FragColor = vec4(uAtmosphereColor, alpha * 0.7);
  }
`;

// ── Ring Shader ──────────────────────────────────────────
const ringVertex = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ringFragment = `
  uniform vec3 uRingColor1;
  uniform vec3 uRingColor2;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    // Distance from center of the ring torus cross-section
    float dist = abs(vUv.y - 0.5) * 2.0;
    float alpha = 1.0 - smoothstep(0.0, 1.0, dist);

    // Stripe pattern along the ring
    float stripes = sin(vUv.x * 120.0 + uTime * 0.3) * 0.5 + 0.5;
    stripes = smoothstep(0.3, 0.7, stripes);

    vec3 color = mix(uRingColor1, uRingColor2, stripes);
    alpha *= 0.5 * (0.6 + stripes * 0.4);

    gl_FragColor = vec4(color, alpha);
  }
`;

export default function Planet({ scrollProgress, mousePosition }) {
  const groupRef = useRef();
  const planetRef = useRef();
  const atmosphereRef = useRef();
  const ringRef = useRef();
  const { theme } = useTheme();

  const planetUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('#0a1628') },
    uColor2: { value: new THREE.Color('#1e3a5f') },
    uColor3: { value: new THREE.Color('#10b981') },
    uColor4: { value: new THREE.Color('#8b5cf6') },
  }), []);

  const atmosphereUniforms = useMemo(() => ({
    uAtmosphereColor: { value: new THREE.Color('#8b5cf6') },
    uIntensity: { value: 1.2 },
  }), []);

  const ringUniforms = useMemo(() => ({
    uRingColor1: { value: new THREE.Color('#e8d5c4') },
    uRingColor2: { value: new THREE.Color('#c4a68a') },
    uTime: { value: 0 },
  }), []);

  // Theme-reactive colours
  useMemo(() => {
    if (theme === 'light') {
      planetUniforms.uColor1.value.set('#1a2a4a');
      planetUniforms.uColor2.value.set('#2d5a8a');
      planetUniforms.uColor3.value.set('#059669');
      planetUniforms.uColor4.value.set('#7c3aed');
      atmosphereUniforms.uAtmosphereColor.value.set('#7c3aed');
      ringUniforms.uRingColor1.value.set('#f0dcc8');
      ringUniforms.uRingColor2.value.set('#d4a68a');
    } else {
      planetUniforms.uColor1.value.set('#0a1628');
      planetUniforms.uColor2.value.set('#1e3a5f');
      planetUniforms.uColor3.value.set('#10b981');
      planetUniforms.uColor4.value.set('#8b5cf6');
      atmosphereUniforms.uAtmosphereColor.value.set('#8b5cf6');
      ringUniforms.uRingColor1.value.set('#e8d5c4');
      ringUniforms.uRingColor2.value.set('#c4a68a');
    }
  }, [theme, planetUniforms, atmosphereUniforms, ringUniforms]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    planetUniforms.uTime.value = t;
    ringUniforms.uTime.value = t;

    if (groupRef.current) {
      // Auto-rotate like the reference
      groupRef.current.rotation.y = t * 0.08;

      // Gentle mouse-parallax tilt
      const targetTiltX = mousePosition.y * 0.15;
      const targetTiltY = mousePosition.x * 0.15;
      groupRef.current.rotation.x += (targetTiltX + 0.15 - groupRef.current.rotation.x) * 0.03;

      // Subtle float
      groupRef.current.position.y = Math.sin(t * 0.4) * 0.15;

      // Drift based on scroll
      groupRef.current.position.x = Math.sin(scrollProgress * Math.PI) * 1.0;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.02;
    }
  });

  // Ring geometry — torus
  const ringGeometry = useMemo(() => {
    return new THREE.TorusGeometry(2.8, 0.15, 16, 100);
  }, []);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Planet sphere */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[1.8, 128, 128]} />
        <shaderMaterial
          vertexShader={planetVertex}
          fragmentShader={planetFragment}
          uniforms={planetUniforms}
        />
      </mesh>

      {/* Atmospheric glow shell */}
      <mesh ref={atmosphereRef} scale={1.12}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <shaderMaterial
          vertexShader={atmosphereVertex}
          fragmentShader={atmosphereFragment}
          uniforms={atmosphereUniforms}
          transparent
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Swirling ring / orbital band */}
      <mesh ref={ringRef} geometry={ringGeometry} rotation={[Math.PI / 2.5, 0.3, 0]}>
        <shaderMaterial
          vertexShader={ringVertex}
          fragmentShader={ringFragment}
          uniforms={ringUniforms}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Second thinner ring */}
      <mesh rotation={[Math.PI / 2.2, -0.2, 0.4]}>
        <torusGeometry args={[3.2, 0.04, 8, 100]} />
        <meshBasicMaterial
          color={theme === 'dark' ? '#8b5cf6' : '#7c3aed'}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Wireframe icosahedron cage */}
      <mesh rotation={[0.4, 0.3, 0]}>
        <icosahedronGeometry args={[3.5, 1]} />
        <meshBasicMaterial
          color={theme === 'dark' ? '#8b5cf6' : '#7c3aed'}
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>
    </group>
  );
}
