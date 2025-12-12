
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Box, Torus, Float, Center, Text3D } from '@react-three/drei';
import * as THREE from 'three';
import { BoosterType } from '../../types';

interface Booster3DProps {
  type: BoosterType;
}

const FONT_URL = 'https://unpkg.com/three@0.160.0/examples/fonts/droid/droid_sans_bold.typeface.json';

const MaterialClay = ({ 
  color, 
  emissive = "#000", 
  emissiveIntensity = 0,
  metalness = 0.1 
}: { 
  color: string, 
  emissive?: string, 
  emissiveIntensity?: number,
  metalness?: number 
}) => (
  <meshPhysicalMaterial 
    color={color} 
    roughness={0.3} 
    metalness={metalness} 
    clearcoat={0.8}
    clearcoatRoughness={0.1}
    emissive={emissive}
    emissiveIntensity={emissiveIntensity}
  />
);

export default function Booster3D({ type }: Booster3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
        // Gentle rotation
        groupRef.current.rotation.y += 0.01;
        // Bobbing is handled by Float, but we can add some dynamic scale pulse
        const t = state.clock.getElapsedTime();
        const scale = 1 + Math.sin(t * 2) * 0.02;
        groupRef.current.scale.set(scale, scale, scale);
    }
  });

  const renderModel = () => {
    switch(type) {
        case 'bomb':
            return (
                <group scale={1.2}>
                    {/* Bomb Body */}
                    <Sphere args={[0.7, 32, 32]}>
                        <MaterialClay color="#334155" />
                    </Sphere>
                    {/* Cap */}
                    <Cylinder args={[0.25, 0.25, 0.1, 32]} position={[0, 0.65, 0]}>
                         <MaterialClay color="#94A3B8" metalness={0.5} />
                    </Cylinder>
                    {/* Fuse */}
                    <Cylinder args={[0.08, 0.08, 0.4, 16]} position={[0, 0.8, 0]}>
                         <meshStandardMaterial color="#D1D5DB" />
                    </Cylinder>
                    {/* Spark */}
                    <Sphere args={[0.15]} position={[0.1, 1.0, 0]}>
                        <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={2} toneMapped={false} />
                    </Sphere>
                </group>
            );
        case 'shuffle':
            return (
                <group scale={1.1}>
                    {/* Two cubes orbiting/swapping */}
                     <group position={[-0.4, 0.2, 0]} rotation={[0.4, 0.4, 0]}>
                        <Box args={[0.5, 0.5, 0.5]} radius={0.1}>
                             <MaterialClay color="#FF8A65" />
                        </Box>
                     </group>
                     <group position={[0.4, -0.2, 0]} rotation={[-0.4, -0.4, 0]}>
                        <Box args={[0.5, 0.5, 0.5]} radius={0.1}>
                             <MaterialClay color="#81D4FA" />
                        </Box>
                     </group>
                     {/* Arrows (Torus segments) */}
                     <Torus args={[0.8, 0.08, 16, 32, Math.PI]} rotation={[0, 0, 0]} position={[0, 0, 0]}>
                        <meshStandardMaterial color="#FFF" opacity={0.5} transparent />
                     </Torus>
                     <Torus args={[0.8, 0.08, 16, 32, Math.PI]} rotation={[0, 0, Math.PI]} position={[0, 0, 0]}>
                        <meshStandardMaterial color="#FFF" opacity={0.5} transparent />
                     </Torus>
                </group>
            );
        case 'extraMoves':
            return (
                <group scale={0.9}>
                    {/* Lightning Bolt constructed from boxes or custom shape? Let's use simple boxes for chunky look */}
                    <group rotation={[0, 0, -0.2]}>
                        <Box args={[0.4, 1.2, 0.2]} position={[0, 0.2, 0]} rotation={[0, 0, 0.3]}>
                             <MaterialClay color="#FCD34D" emissive="#F59E0B" emissiveIntensity={0.5} />
                        </Box>
                        <Box args={[0.4, 1.2, 0.2]} position={[0, -0.6, 0]} rotation={[0, 0, 0.3]}>
                             <MaterialClay color="#FCD34D" emissive="#F59E0B" emissiveIntensity={0.5} />
                        </Box>
                        {/* Center connection */}
                         <Box args={[0.8, 0.3, 0.2]} position={[0, -0.2, 0]}>
                             <MaterialClay color="#FCD34D" emissive="#F59E0B" emissiveIntensity={0.5} />
                        </Box>
                    </group>
                    {/* +5 Floating Text */}
                    <Center position={[0.8, 0, 0.5]}>
                        <Text3D font={FONT_URL} size={0.6} height={0.1} bevelEnabled bevelSize={0.02} bevelThickness={0.05}>
                            +5
                            <meshStandardMaterial color="#FFF" />
                        </Text3D>
                    </Center>
                </group>
            );
        case 'shield':
            return (
                <group scale={1.2}>
                    {/* Shield Shape: Flattened Octahedron or custom */}
                    <Cylinder args={[0.7, 0.0, 0.2, 6]} rotation={[Math.PI/2, 0, 0]} position={[0, 0.2, 0]}>
                         <MaterialClay color="#34D399" metalness={0.3} />
                    </Cylinder>
                    <Box args={[0.9, 0.9, 0.1]} position={[0, 0.2, -0.05]} rotation={[0,0,Math.PI/4]}>
                        <MaterialClay color="#059669" />
                    </Box>
                     <Center position={[0, 0.2, 0.15]}>
                        <Text3D font={FONT_URL} size={0.5} height={0.05} bevelEnabled bevelSize={0.02} bevelThickness={0.02}>
                            🛡️
                            <meshStandardMaterial color="#ECFDF5" />
                        </Text3D>
                    </Center>
                </group>
            );
        default:
            return <Sphere args={[0.5]}><meshStandardMaterial color="red" /></Sphere>;
    }
  };

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group ref={groupRef}>
            {renderModel()}
        </group>
        {/* Local Lights for the view */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[-2, -2, 2]} intensity={0.5} color="white" />
    </Float>
  );
}
