import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, ContactShadows, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

const Robot = ({ isDark }) => {
  const group = useRef();
  const headRef = useRef();
  
  // Track mouse movement to rotate the robot's head
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Gentle floating animation for the whole group
    group.current.position.y = Math.sin(t / 1.5) / 10;
    
    // Make the head look at the mouse cursor
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, (state.mouse.x * Math.PI) / 4, 0.1);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, (-state.mouse.y * Math.PI) / 4, 0.1);
    }
  });

  const materials = useMemo(() => {
    return {
      body: new THREE.MeshStandardMaterial({
        color: isDark ? '#e2e8f0' : '#ffffff', // Clean light gray/white
        roughness: 0.2,
        metalness: 0.1,
      }),
      head: new THREE.MeshStandardMaterial({
        color: isDark ? '#f1f5f9' : '#ffffff', 
        roughness: 0.2,
        metalness: 0.1,
      }),
      screen: new THREE.MeshStandardMaterial({
        color: '#0f172a', // Dark blue/black screen
        roughness: 0.2,
        metalness: 0.8,
      }),
      eye: new THREE.MeshStandardMaterial({
        color: '#06b6d4', // Cyan
        emissive: '#06b6d4',
        emissiveIntensity: 2,
        toneMapped: false,
      }),
    };
  }, [isDark]);

  return (
    <group ref={group} dispose={null} scale={1.2}>
      {/* Base / Body */}
      <mesh material={materials.body} position={[0, -1.2, 0]}>
        <capsuleGeometry args={[0.7, 0.8, 32, 32]} />
      </mesh>
      
      {/* Left Arm */}
      <mesh material={materials.body} position={[-1.1, -1.1, 0]} rotation={[0, 0, -Math.PI / 8]}>
        <capsuleGeometry args={[0.25, 0.8, 16, 16]} />
      </mesh>
      
      {/* Right Arm */}
      <mesh material={materials.body} position={[1.1, -1.1, 0]} rotation={[0, 0, Math.PI / 8]}>
        <capsuleGeometry args={[0.25, 0.8, 16, 16]} />
      </mesh>

      {/* Neck separator (hidden slightly) */}
      <mesh material={materials.screen} position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
      </mesh>

      <group ref={headRef} position={[0, 0.4, 0]}>
        {/* Head */}
        <RoundedBox args={[1.8, 1.3, 1.4]} radius={0.3} smoothness={4} material={materials.head} />
        
        {/* Ear rings */}
        <mesh material={materials.head} position={[-0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.2, 0.2, 16, 16]} />
        </mesh>
        <mesh material={materials.head} position={[0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.2, 0.2, 16, 16]} />
        </mesh>
        
        {/* Screen / Face Bezel */}
        <RoundedBox args={[1.5, 1.0, 1.45]} radius={0.2} smoothness={4} material={materials.screen} />

        {/* Eyes (Happy half circles) */}
        <mesh material={materials.eye} position={[-0.35, 0.1, 0.73]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.05, 32, 1, false, 0, Math.PI]} />
        </mesh>
        <mesh material={materials.eye} position={[0.35, 0.1, 0.73]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.05, 32, 1, false, 0, Math.PI]} />
        </mesh>

        {/* Mouth (Happy smile) */}
        <mesh material={materials.eye} position={[0, -0.2, 0.73]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.05, 32, 1, false, 0, Math.PI]} />
        </mesh>
      </group>
    </group>
  );
};

const RobotScene = () => {
  const { isDark } = useTheme();

  return (
    <div className="w-full h-full min-h-[400px] relative">
      {/* Fallback blurred background glow matching the robot */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
      </div>
      
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} className="w-full h-full">
        <ambientLight intensity={isDark ? 0.8 : 1.2} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color={'#ffffff'} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#e2e8f0" />
        
        <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
          <Robot isDark={isDark} />
        </Float>
        
        <Sparkles 
          count={100} 
          scale={5} 
          size={3} 
          speed={0.4} 
          opacity={isDark ? 0.5 : 0.8} 
          color="#a78bfa" 
        />
        
        <ContactShadows 
          position={[0, -2.5, 0]} 
          opacity={isDark ? 0.8 : 0.3} 
          scale={10} 
          blur={2.5} 
          far={4} 
        />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          minPolarAngle={Math.PI / 2.5} 
          maxPolarAngle={Math.PI / 2} 
        />
      </Canvas>
    </div>
  );
};

export default RobotScene;
