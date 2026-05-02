import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const Orb = () => {
  const mesh = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.y += 0.003;
      mesh.current.rotation.x = Math.sin(t * 0.4) * 0.15;
    }
  });

  return (
    <Sphere ref={mesh} args={[1.8, 64, 64]}>
      <MeshDistortMaterial
        color="#6366f1"
        roughness={0.1}
        metalness={0.8}
        distort={0.4}
        speed={2}
        iridescence={1}
        iridescenceIOR={1.8}
      />
    </Sphere>
  );
};

const HeroOrb = () => {
  return (
    <div className="w-full h-full min-h-[500px] relative pointer-events-none opacity-85">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={4} color="#6366f1" />
        <pointLight position={[-10, -5, 5]} intensity={2} color="#8b5cf6" />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <Orb />
        </Float>
      </Canvas>
    </div>
  );
};

export default HeroOrb;
