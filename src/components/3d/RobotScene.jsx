import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, PerspectiveCamera, RoundedBox } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

const RobotModel = () => {
  const group = useRef();
  const head = useRef();
  const leftEye = useRef();
  const rightEye = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const { x, y } = state.mouse;
    
    // Smoothly follow mouse
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.4, 0.1);
    head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, -y * 0.3, 0.1);
    head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, x * 0.6, 0.1);
    
    // Animate eyes (blinking/pulsing)
    const eyeScale = 1 + Math.sin(t * 2) * 0.05;
    leftEye.current.scale.set(eyeScale, eyeScale, eyeScale);
    rightEye.current.scale.set(eyeScale, eyeScale, eyeScale);
    
    // Add subtle idle bobbing
    group.current.position.y = Math.sin(t) * 0.1;
  });

  return (
    <group ref={group}>
      <Float speed={3} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Head */}
        <group ref={head} position={[0, 0.6, 0]}>
          <RoundedBox args={[1.2, 0.9, 0.8]} radius={0.3} smoothness={4}>
            <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.2} />
          </RoundedBox>
          
          {/* Face Screen */}
          <mesh position={[0, 0, 0.36]}>
            <RoundedBox args={[0.9, 0.6, 0.1]} radius={0.15} smoothness={4}>
              <meshStandardMaterial color="#1a1a2e" roughness={0} metalness={0.8} />
            </RoundedBox>
          </mesh>

          {/* Cyan Eyes */}
          <mesh ref={leftEye} position={[-0.25, 0.05, 0.42]}>
            <sphereGeometry args={[0.1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshBasicMaterial color="#40e0d0" />
          </mesh>
          <mesh ref={rightEye} position={[0.25, 0.05, 0.42]}>
            <sphereGeometry args={[0.1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshBasicMaterial color="#40e0d0" />
          </mesh>
          
          {/* Mouth (optional, matches the smile in image) */}
          <mesh position={[0, -0.15, 0.42]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.08, 0.02, 16, 32, Math.PI]} />
            <meshBasicMaterial color="#40e0d0" />
          </mesh>
        </group>

        {/* Body */}
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.2} />
        </mesh>
        
        {/* Decorative line on body */}
        <mesh position={[0, -0.5, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
           <torusGeometry args={[0.3, 0.01, 16, 100, Math.PI]} />
           <meshBasicMaterial color="#e2e8f0" />
        </mesh>

        {/* Floating Arms */}
        <mesh position={[-0.8, -0.2, 0]} rotation={[0, 0, 0.2]}>
          <capsuleGeometry args={[0.15, 0.4, 16, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.8, -0.2, 0]} rotation={[0, 0, -0.2]}>
          <capsuleGeometry args={[0.15, 0.4, 16, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Soft shadow below */}
        <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.1} />
        </mesh>
      </Float>
    </group>
  );
};

const RobotScene = () => {
  return (
    <div className="w-full h-[500px] cursor-grab active:cursor-grabbing">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={45} />
        <ambientLight intensity={0.8} />
        <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#6366f1" />
        
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
