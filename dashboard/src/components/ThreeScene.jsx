import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function FlyingShape({ shape, color, position, scale = 1 }) {
  const mesh = useRef();
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.15;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const geometry = useMemo(() => {
    if (shape === 'box') return new THREE.BoxGeometry(1, 1, 1);
    if (shape === 'tetra') return new THREE.TetrahedronGeometry(0.8, 0);
    return new THREE.OctahedronGeometry(0.6, 0);
  }, [shape]);

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh ref={mesh} geometry={geometry} position={position} scale={scale}>
        <meshBasicMaterial color={color} wireframe />
      </mesh>
    </Float>
  );
}

export default function ThreeScene() {
  return (
    <group>
      <FlyingShape shape="tetra" color="#22c55e" position={[-3, 0.5, -4]} scale={0.6} />
      <FlyingShape shape="box" color="#3b82f6" position={[3, -0.3, -5]} scale={0.5} />
      <FlyingShape shape="octa" color="#eab308" position={[0, -1.2, -6]} scale={0.4} />
    </group>
  );
}
