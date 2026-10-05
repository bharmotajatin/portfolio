import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Line, MeshDistortMaterial, Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';

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

const TREND = [0.25, 0.55, 0.4, 0.85, 0.7, 1.15, 0.95, 1.45, 1.3, 1.8];

function TrendChart({ position }) {
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
            <meshBasicMaterial color={i === points.length - 1 ? '#fbbf24' : '#a7f3d0'} toneMapped={false} />
          </mesh>
          <Line points={[[0, 0, 0], [0, -p.y, 0]]} color="#22d3ee" lineWidth={0.6} transparent opacity={0.25} dashed dashSize={0.05} gapSize={0.05} />
        </group>
      ))}
      <Line points={[[-w / 2 - 0.2, 0, 0], [w / 2 + 0.3, 0, 0]]} color="#475569" lineWidth={1} />
      <Line points={[[-w / 2 - 0.2, 0, 0], [-w / 2 - 0.2, 2.1, 0]]} color="#475569" lineWidth={1} />
      {[0.5, 1, 1.5, 2].map(y => (
        <Line key={y} points={[[-w / 2 - 0.2, y, 0], [w / 2 + 0.3, y, 0]]} color="#1e293b" lineWidth={0.5} transparent opacity={0.6} />
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
        <OrbitRing radius={2.4} count={180} tilt={[0.4, 0, 0.2]} speed={0.25} color="#34d399" />
        <OrbitRing radius={2.9} count={140} tilt={[-0.5, 0, -0.3]} speed={-0.18} color="#a78bfa" />
        <TrendChart position={[0, -3.4, -1]} />
      </group>
    );
  }
  const scale = THREE.MathUtils.clamp(width / 11, 0.62, 1);
  return (
    <group position={[width * 0.22, 0.15, 0]} scale={scale}>
      <DataCore />
      <OrbitRing radius={2.4} count={180} tilt={[0.4, 0, 0.2]} speed={0.25} color="#34d399" />
      <OrbitRing radius={2.9} count={140} tilt={[-0.5, 0, -0.3]} speed={-0.18} color="#a78bfa" />
      <OrbitRing radius={3.4} count={120} tilt={[1.2, 0, 0.1]} speed={0.12} color="#22d3ee" size={0.03} />
      <TrendChart position={[-0.9, -3.2, -0.8]} />
    </group>
  );
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
        <Rig baseZ={compact ? 9 : 7}>
          <Composition compact={compact} />
          <FloatingShapes />
        </Rig>
        <Sparkles count={compact ? 40 : 90} scale={[12, 7, 6]} size={2.2} speed={0.35} color="#22d3ee" opacity={0.7} />
        <Stars radius={60} depth={40} count={compact ? 1200 : 2500} factor={3} saturation={0} fade speed={0.6} />
        <fog attach="fog" args={['#05060a', 8, 22]} />
      </Canvas>
    </div>
  );
}
