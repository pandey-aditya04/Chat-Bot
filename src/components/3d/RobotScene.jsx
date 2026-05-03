import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Sphere, PerspectiveCamera } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

const RobotModel = () => {
  const group = useRef();
  const head = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t / 2) * 0.1;
    head.current.rotation.x = Math.sin(t) * 0.1;
    head.current.rotation.y = Math.cos(t / 2) * 0.2;
  });

  return (
    <group ref={group}>
      <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
        {/* Head */}
        <mesh ref={head} position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial 
            color="#6366f1" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#6366f1"
            emissiveIntensity={0.2}
          />
          {/* Eyes */}
          <mesh position={[0.2, 0.1, 0.4]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[-0.2, 0.1, 0.4]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </mesh>

        {/* Body */}
        <mesh position={[0, -0.3, 0]}>
          <capsuleGeometry args={[0.4, 0.6, 32, 32]} />
          <meshStandardMaterial 
            color="#4f46e5" 
            metalness={0.8} 
            roughness={0.2}
          />
        </mesh>

        {/* Decorative Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
          <torusGeometry args={[0.6, 0.02, 16, 100]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={2} />
        </mesh>

        {/* Floating Particles */}
        <Sphere args={[1.5, 64, 64]}>
          <MeshDistortMaterial
            color="#6366f1"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0}
            transparent
            opacity={0.1}
          />
        </Sphere>
      </Float>
    </group>
  );
};

const RobotScene = () => {
  return (
    <div className="w-full h-[500px] cursor-grab active:cursor-grabbing">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <RobotModel />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
};

export default RobotScene;
