import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';

const PALETTE = ['#34d399', '#22d3ee', '#a78bfa', '#fbbf24', '#fb7185'];

function DataCore() {
  const shell = useRef();
  const inner = useRef();
  useFrame((state, dt) => {
    shell.current.rotation.y += dt * 0.15;
    shell.current.rotation.x += dt * 0.05;
    inner.current.rotation.y -= dt * 0.2;
  });
  return (
    <Float speed={1.6} rotationIntensity={0.5} floatIntensity={1.2}>
      <group>
        <mesh ref={inner}>
          <icosahedronGeometry args={[1.25, 24]} />
          <MeshDistortMaterial
            color="#2b6c8f"
            emissive="#0e7490"
            emissiveIntensity={0.55}
            roughness={0.18}
            metalness={0.25}
            distort={0.38}
            speed={1.8}
            iridescence={1}
            iridescenceIOR={1.6}
            clearcoat={1}
          />
        </mesh>
        <mesh ref={shell} scale={1.75}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.22} />
        </mesh>
      </group>
    </Float>
  );
}

function OrbitRing({ radius, count, tilt, speed, color, size = 0.035 }) {
  const ref = useRef();
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
        <pointsMaterial color={color} size={size} sizeAttenuation transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.004, 8, 160]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

function BarSkyline() {
  const group = useRef();
  const bars = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        x: (i - 6.5) * 0.32,
        h: 0.3 + Math.abs(Math.sin(i * 1.7)) * 1.4 + (i % 4 === 0 ? 0.6 : 0),
        color: PALETTE[i % PALETTE.length],
        phase: i * 0.4
      })),
    []
  );
  const refs = useRef([]);
  useFrame(state => {
    const t = state.clock.elapsedTime;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const b = bars[i];
      const grow = Math.min(1, t / 1.6);
      const h = b.h * grow * (0.85 + Math.sin(t * 1.2 + b.phase) * 0.15);
      m.scale.y = Math.max(0.01, h);
      m.position.y = h / 2;
    });
  });
  return (
    <group ref={group} position={[0.4, -2.9, -3.2]} rotation={[0.18, -0.35, 0]} scale={0.85}>
      {bars.map((b, i) => (
        <mesh key={i} ref={el => (refs.current[i] = el)} position={[b.x, 0, 0]}>
          <boxGeometry args={[0.18, 1, 0.18]} />
          <meshStandardMaterial color={b.color} emissive={b.color} emissiveIntensity={0.55} roughness={0.3} metalness={0.4} transparent opacity={0.85} />
        </mesh>
      ))}
      <gridHelper args={[6, 24, '#22d3ee', '#1e293b']} position={[0, 0, 0]} />
    </group>
  );
}

function FloatingShapes() {
  const shapes = useMemo(
    () => [
      { pos: [-3.6, 1.6, -2], geo: 'oct', color: '#34d399', s: 0.35 },
      { pos: [3.8, 1.9, -2.5], geo: 'torus', color: '#a78bfa', s: 0.32 },
      { pos: [-3.2, -1.4, -1.5], geo: 'box', color: '#22d3ee', s: 0.28 },
      { pos: [3.4, -1.2, -1], geo: 'tet', color: '#fbbf24', s: 0.3 }
    ],
    []
  );
  return shapes.map((s, i) => (
    <Float key={i} speed={2 + i * 0.3} rotationIntensity={2} floatIntensity={2}>
      <mesh position={s.pos} scale={s.s}>
        {s.geo === 'oct' && <octahedronGeometry args={[1, 0]} />}
        {s.geo === 'torus' && <torusKnotGeometry args={[0.8, 0.25, 96, 12]} />}
        {s.geo === 'box' && <boxGeometry args={[1.2, 1.2, 1.2]} />}
        {s.geo === 'tet' && <tetrahedronGeometry args={[1.1, 0]} />}
        <meshStandardMaterial color={s.color} emissive={s.color} emissiveIntensity={0.35} wireframe={i % 2 === 0} roughness={0.2} metalness={0.7} />
      </mesh>
    </Float>
  ));
}

function Rig({ children }) {
  const ref = useRef();
  useFrame(state => {
    const { x, y } = state.pointer;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, x * 0.35, 0.05);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -y * 0.2, 0.05);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, x * 0.6, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, y * 0.4, 0.04);
    state.camera.lookAt(0, 0, 0);
  });
  return <group ref={ref}>{children}</group>;
}

export default function HeroScene() {
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
        <ambientLight intensity={0.35} />
        <pointLight position={[4, 3, 4]} intensity={40} color="#34d399" />
        <pointLight position={[-4, -2, 3]} intensity={40} color="#a78bfa" />
        <pointLight position={[0, 4, -3]} intensity={25} color="#22d3ee" />
        <Rig>
          <group position={compact ? [0, 0.6, 0] : [1.9, 0.1, 0]} scale={compact ? 0.8 : 1}>
            <DataCore />
            <OrbitRing radius={2.4} count={180} tilt={[0.4, 0, 0.2]} speed={0.25} color="#34d399" />
            <OrbitRing radius={2.9} count={140} tilt={[-0.5, 0, -0.3]} speed={-0.18} color="#a78bfa" />
            <OrbitRing radius={3.4} count={120} tilt={[1.2, 0, 0.1]} speed={0.12} color="#22d3ee" size={0.03} />
            <BarSkyline />
          </group>
          <FloatingShapes />
        </Rig>
        <Sparkles count={compact ? 40 : 90} scale={[12, 7, 6]} size={2.2} speed={0.35} color="#22d3ee" opacity={0.7} />
        <Stars radius={60} depth={40} count={compact ? 1200 : 2500} factor={3} saturation={0} fade speed={0.6} />
        <fog attach="fog" args={['#05060a', 8, 22]} />
      </Canvas>
    </div>
  );
}
