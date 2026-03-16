import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Particles = () => {
  const pointsRef = useRef();
  const { mouse, viewport } = useThree();

  const particlesPosition = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
       const r = 20 * Math.cbrt(Math.random());
       const theta = Math.random() * 2 * Math.PI;
       const phi = Math.acos(2 * Math.random() - 1);
       positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
       positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
       positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    // base rotation
    pointsRef.current.rotation.x += delta * 0.05;
    pointsRef.current.rotation.y += delta * 0.05;
    
    // parallax based on mouse
    const targetX = (mouse.x * viewport.width) / 10;
    const targetY = (mouse.y * viewport.height) / 10;
    
    pointsRef.current.position.x += (targetX - pointsRef.current.position.x) * 0.02;
    pointsRef.current.position.y += (targetY - pointsRef.current.position.y) * 0.02;
  });

  return (
    <Points ref={pointsRef} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#818cf8"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

export default function ThreeBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-[#0B0F19]">
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
        <fog attach="fog" args={['#0B0F19', 10, 25]} />
        <ambientLight intensity={0.5} />
        <Particles />
      </Canvas>
    </div>
  );
}
