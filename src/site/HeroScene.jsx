import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Line, Sparkles, Stars, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../lib/theme';

const useLight = () => useTheme() === 'light';

const NUCLEONS = 19;
const ORBITS = [
  { spin: 0, r: 2.05, tilt: 1.22, color: '#22d3ee', speed: 1.1, electrons: [0] },
  { spin: Math.PI / 5, r: 2.4, tilt: 1.3, color: '#34d399', speed: 0.8, electrons: [2.1, 2.1 + Math.PI] },
  { spin: (Math.PI * 2) / 5, r: 2.05, tilt: 1.22, color: '#fbbf24', speed: 1.3, electrons: [4.2] },
  { spin: (Math.PI * 3) / 5, r: 2.4, tilt: 1.3, color: '#a78bfa', speed: 0.95, electrons: [1, 1 + Math.PI] },
  { spin: (Math.PI * 4) / 5, r: 2.05, tilt: 1.22, color: '#fb7185', speed: 1.2, electrons: [3.3] }
];

function Nucleus() {
  const ref = useRef();
  const light = useLight();
  const glow = light ? THREE.NormalBlending : THREE.AdditiveBlending;
  const particles = useMemo(() => {
    const golden = Math.PI * (3 - Math.sqrt(5));
    return Array.from({ length: NUCLEONS }, (_, i) => {
      const y = 1 - (i / (NUCLEONS - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const a = i * golden;
      const d = i === 0 ? 0 : 0.36;
      return { pos: [Math.cos(a) * r * d, y * d, Math.sin(a) * r * d], proton: i % 2 === 0 };
    });
  }, []);
  useFrame((_, dt) => {
    ref.current.rotation.y += dt * 0.35;
    ref.current.rotation.x += dt * 0.12;
  });
  return (
    <group>
      <group ref={ref}>
        {particles.map((p, i) => (
          <mesh key={i} position={p.pos}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial
              color={p.proton ? '#34d399' : '#a78bfa'}
              emissive={p.proton ? '#10b981' : '#7c3aed'}
              emissiveIntensity={0.6}
              roughness={0.25}
              metalness={0.4}
            />
          </mesh>
        ))}
      </group>
      <mesh>
        <sphereGeometry args={[0.85, 32, 32]} />
        <meshBasicMaterial key={glow} color="#22d3ee" transparent opacity={light ? 0.1 : 0.07} depthWrite={false} blending={glow} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.25, 32, 32]} />
        <meshBasicMaterial key={glow} color="#34d399" transparent opacity={light ? 0.06 : 0.035} depthWrite={false} blending={glow} />
      </mesh>
      <pointLight color="#34d399" intensity={6} distance={4} />
    </group>
  );
}

function Electron({ r, color, speed, offset }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed + offset;
    ref.current.position.set(Math.cos(t) * r, Math.sin(t) * r, 0);
  });
  return (
    <Trail width={1.6} length={5} color={color} attenuation={w => w * w}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.09, 20, 20]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </Trail>
  );
}

function Orbit({ spin, r, tilt, color, speed, electrons }) {
  const points = useMemo(
    () => Array.from({ length: 129 }, (_, i) => {
      const a = (i / 128) * Math.PI * 2;
      return [Math.cos(a) * r, Math.sin(a) * r, 0];
    }),
    [r]
  );
  return (
    <group rotation={[0, 0, spin]}>
      <group rotation={[tilt, 0, 0]}>
        <Line points={points} color={color} lineWidth={1.4} transparent opacity={0.6} />
        {electrons.map(offset => (
          <Electron key={offset} r={r} color={color} speed={speed} offset={offset} />
        ))}
      </group>
    </group>
  );
}

function DataCore() {
  const ref = useRef();
  useFrame((_, dt) => {
    ref.current.rotation.y += dt * 0.08;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.6}>
      <group ref={ref} rotation={[0.25, 0, -0.15]}>
        <Nucleus />
        {ORBITS.map(o => (
          <Orbit key={o.spin} {...o} />
        ))}
      </group>
    </Float>
  );
}

function OrbitRing({ radius, count, tilt, speed, color, size = 0.035 }) {
  const ref = useRef();
  const light = useLight();
  const blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const jitter = 1 + (Math.random() - 0.5) * 0.08;
      arr[i * 3] = Math.cos(a) * radius * jitter;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.12;
      arr[i * 3 + 2] = Math.sin(a) * radius * jitter;
    }
    return arr;
  }, [radius, count]);
  useFrame((_, dt) => {
    ref.current.rotation.y += dt * speed;
  });
  return (
    <group rotation={tilt}>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial key={blending} color={color} size={size} sizeAttenuation transparent opacity={0.9} depthWrite={false} blending={blending} />
      </points>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.004, 8, 160]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

const TREND = [0.25, 0.55, 0.4, 0.85, 0.7, 1.15, 0.95, 1.45, 1.3, 1.8];

function TrendChart({ position }) {
  const light = useLight();
  const tube = useRef();
  const area = useRef();
  const dots = useRef([]);
  const { curve, points, areaGeo, indexCount } = useMemo(() => {
    const pts = TREND.map((v, i) => new THREE.Vector3((i - (TREND.length - 1) / 2) * 0.42, v, Math.sin(i * 0.9) * 0.12));
    const c = new THREE.CatmullRomCurve3(pts);
    const samples = c.getPoints(120);
    const pos = [];
    samples.forEach(p => pos.push(p.x, p.y, p.z, p.x, 0, p.z));
    const idx = [];
    for (let i = 0; i < samples.length - 1; i++) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    return { curve: c, points: pts, areaGeo: g, indexCount: 120 * 8 * 6 };
  }, []);

  useFrame(state => {
    const t = state.clock.elapsedTime;
    const p = Math.min(1, Math.max(0, (t - 0.6) / 2.4));
    const eased = 1 - Math.pow(1 - p, 3);
    tube.current.geometry.setDrawRange(0, Math.floor(eased * indexCount));
    area.current.geometry.setDrawRange(0, Math.floor(eased * 120) * 6);
    dots.current.forEach((d, i) => {
      if (!d) return;
      const shown = eased >= i / (TREND.length - 1) - 0.001;
      const pulse = 1 + Math.sin(t * 3 + i) * 0.18;
      d.scale.setScalar(shown ? pulse : 0.001);
    });
  });

  const w = (TREND.length - 1) * 0.42;
  return (
    <group position={position} rotation={[0.12, -0.45, 0]}>
      <mesh ref={tube}>
        <tubeGeometry args={[curve, 120, 0.022, 8, false]} />
        <meshBasicMaterial color="#34d399" toneMapped={false} />
      </mesh>
      <mesh ref={area} geometry={areaGeo}>
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {points.map((p, i) => (
        <group key={i} position={p}>
          <mesh ref={el => (dots.current[i] = el)}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshBasicMaterial color={i === points.length - 1 ? '#fbbf24' : light ? '#10b981' : '#a7f3d0'} toneMapped={false} />
          </mesh>
          <Line points={[[0, 0, 0], [0, -p.y, 0]]} color="#22d3ee" lineWidth={0.6} transparent opacity={0.25} dashed dashSize={0.05} gapSize={0.05} />
        </group>
      ))}
      <Line points={[[-w / 2 - 0.2, 0, 0], [w / 2 + 0.3, 0, 0]]} color="#475569" lineWidth={1} />
      <Line points={[[-w / 2 - 0.2, 0, 0], [-w / 2 - 0.2, 2.1, 0]]} color="#475569" lineWidth={1} />
      {[0.5, 1, 1.5, 2].map(y => (
        <Line key={y} points={[[-w / 2 - 0.2, y, 0], [w / 2 + 0.3, y, 0]]} color={light ? '#cbd5e1' : '#1e293b'} lineWidth={0.5} transparent opacity={0.6} />
      ))}
    </group>
  );
}

function FloatingShapes() {
  const shapes = useMemo(
    () => [
      { pos: [-3.6, 1.6, -2], geo: 'oct', color: '#34d399', s: 0.35 },
      { pos: [0.4, 3.1, -3.5], geo: 'torus', color: '#a78bfa', s: 0.26 },
      { pos: [-3.2, -1.4, -1.5], geo: 'box', color: '#22d3ee', s: 0.28 }
    ],
    []
  );
  return shapes.map((s, i) => (
    <Float key={i} speed={2 + i * 0.3} rotationIntensity={2} floatIntensity={2}>
      <mesh position={s.pos} scale={s.s}>
        {s.geo === 'oct' && <octahedronGeometry args={[1, 0]} />}
        {s.geo === 'torus' && <torusKnotGeometry args={[0.8, 0.25, 96, 12]} />}
        {s.geo === 'box' && <boxGeometry args={[1.2, 1.2, 1.2]} />}
        <meshStandardMaterial color={s.color} emissive={s.color} emissiveIntensity={0.35} wireframe={i % 2 === 0} roughness={0.2} metalness={0.7} />
      </mesh>
    </Float>
  ));
}

function Rig({ children, baseZ }) {
  const ref = useRef();
  useFrame(state => {
    const { x, y } = state.pointer;
    const s = Math.min(window.scrollY / window.innerHeight, 1.2);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, x * 0.35 + s * 0.9, 0.05);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -y * 0.2 + s * 0.35, 0.05);
    ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, s * 0.25, 0.05);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, x * 0.6, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, y * 0.4, 0.04);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, baseZ - s * 3, 0.06);
    state.camera.lookAt(0, 0, 0);
  });
  return <group ref={ref}>{children}</group>;
}

function Composition({ compact }) {
  const width = useThree(s => s.viewport.width);
  if (compact) {
    return (
      <group position={[0, 0.6, 0]} scale={0.8}>
        <DataCore />
        <OrbitRing radius={3.4} count={140} tilt={[1.2, 0, 0.1]} speed={0.12} color="#a78bfa" size={0.03} />
        <TrendChart position={[0, -3.4, -1]} />
      </group>
    );
  }
  const scale = THREE.MathUtils.clamp(width / 11, 0.62, 1);
  return (
    <group position={[width * 0.22, 0.15, 0]} scale={scale}>
      <DataCore />
      <OrbitRing radius={3.4} count={120} tilt={[1.2, 0, 0.1]} speed={0.12} color="#22d3ee" size={0.03} />
      <TrendChart position={[-0.9, -3.2, -0.8]} />
    </group>
  );
}

export default function HeroScene() {
  const light = useLight();
  const wrap = useRef(null);
  const [visible, setVisible] = useState(true);
  const [compact, setCompact] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(wrap.current);
    const onResize = () => setCompact(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => {
      io.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, compact ? 9 : 7], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        eventSource={document.body}
        eventPrefix="client"
      >
        <ambientLight intensity={light ? 0.9 : 0.35} />
        <pointLight position={[4, 3, 4]} intensity={40} color="#34d399" />
        <pointLight position={[-4, -2, 3]} intensity={40} color="#a78bfa" />
        <pointLight position={[0, 4, -3]} intensity={25} color="#22d3ee" />
        <Rig baseZ={compact ? 9 : 7}>
          <Composition compact={compact} />
          <FloatingShapes />
        </Rig>
        <Sparkles count={compact ? 40 : 90} scale={[12, 7, 6]} size={2.2} speed={0.35} color={light ? '#0891b2' : '#22d3ee'} opacity={0.7} />
        {!light && <Stars radius={60} depth={40} count={compact ? 1200 : 2500} factor={3} saturation={0} fade speed={0.6} />}
        <fog key={light ? 'l' : 'd'} attach="fog" args={[light ? '#f5f7fb' : '#05060a', 8, 22]} />
      </Canvas>
    </div>
  );
}
