
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Cylinder, Float, Sparkles, Center } from '@react-three/drei';
import { useSpring, animated, config } from '@react-spring/three';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';

export default function CoinFlipScene() {
    const { coinFlip } = useGameStore();
    const groupRef = useRef<THREE.Group>(null);
    const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

    // Rotation Logic
    // HEADS = 0 rotation on X
    // TAILS = PI rotation on X
    
    // While flipping, we can spin continuously using useFrame, 
    // but useSpring is cleaner for the final landing.
    
    // Calculate target rotation
    // If flipping, we just spin. 
    // If result is HEADS -> multiple of 2PI
    // If result is TAILS -> multiple of 2PI + PI
    
    const rotations = useRef(0);
    
    useEffect(() => {
        if (coinFlip.isFlipping) {
            rotations.current += 5; // Add spins
        }
    }, [coinFlip.isFlipping]);

    const targetRotation = coinFlip.isFlipping 
        ? rotations.current * Math.PI * 2 // Continues spinning forward?
        : rotations.current * Math.PI * 2 + (coinFlip.lastResult === 'TAILS' ? Math.PI : 0);

    const { rotation } = useSpring({
        rotation: [coinFlip.isFlipping ? targetRotation + 10 : targetRotation, 0, 0],
        config: coinFlip.isFlipping ? { duration: 2000 } : config.wobbly
    });

    // Continuous spin override during "flipping" state to make it look fast
    useFrame((state, delta) => {
        if (coinFlip.isFlipping && groupRef.current) {
             groupRef.current.rotation.x += delta * 15;
        } else if (groupRef.current) {
            // Apply the spring value when stopped
             // This is a bit tricky mixing spring and frame. 
             // Simpler: Just rely on Spring for the landing.
        }
    });

    return (
        <group position={[0, 1, 0]}>
            <Float speed={coinFlip.isFlipping ? 0 : 2} rotationIntensity={coinFlip.isFlipping ? 0 : 0.5} floatIntensity={0.5}>
                
                {/* The Rotating Coin Group */}
                <animated.group 
                    ref={groupRef} 
                    rotation={coinFlip.isFlipping ? [0,0,0] : rotation as any}
                >
                    {/* Coin Edge (Gold) */}
                    <Cylinder args={[2.5, 2.5, 0.3, 64]} rotation={[Math.PI/2, 0, 0]}>
                        <meshPhysicalMaterial 
                            color="#FFD700" 
                            metalness={0.8} 
                            roughness={0.2}
                            clearcoat={1} 
                        />
                    </Cylinder>
                    
                    {/* Face 1: HEADS (Eliezer / Hamster) - Z+ */}
                    <group position={[0, 0, 0.16]}>
                         <Cylinder args={[2.3, 2.3, 0.05, 64]} rotation={[Math.PI/2, 0, 0]}>
                            <meshPhysicalMaterial color="#FFB74D" metalness={0.4} roughness={0.3} />
                        </Cylinder>
                        <Center>
                            <Text 
                                position={[0, 0, 0.05]} 
                                fontSize={1.5} 
                                color="#FFF" 
                                font="https://unpkg.com/three@0.160.0/examples/fonts/droid/droid_sans_bold.typeface.json"
                            >
                                🐹
                            </Text>
                            <Text 
                                position={[0, -1.2, 0.05]} 
                                fontSize={0.3} 
                                color="#000" 
                                font="https://unpkg.com/three@0.160.0/examples/fonts/droid/droid_sans_bold.typeface.json"
                            >
                                HEADS
                            </Text>
                        </Center>
                    </group>

                    {/* Face 2: TAILS (Diamond / TON) - Z- (Rotated PI around Y to face back) */}
                    <group position={[0, 0, -0.16]} rotation={[0, Math.PI, 0]}>
                         <Cylinder args={[2.3, 2.3, 0.05, 64]} rotation={[Math.PI/2, 0, 0]}>
                            <meshPhysicalMaterial color="#4FC3F7" metalness={0.4} roughness={0.3} />
                        </Cylinder>
                        <Center>
                            <Text 
                                position={[0, 0, 0.05]} 
                                fontSize={1.5} 
                                color="#FFF"
                            >
                                💎
                            </Text>
                            <Text 
                                position={[0, -1.2, 0.05]} 
                                fontSize={0.3} 
                                color="#000" 
                                font="https://unpkg.com/three@0.160.0/examples/fonts/droid/droid_sans_bold.typeface.json"
                            >
                                TAILS
                            </Text>
                        </Center>
                    </group>

                </animated.group>
            </Float>
            
            {/* Win Effects */}
            {!coinFlip.isFlipping && coinFlip.lastResult && (
                <Sparkles count={50} scale={6} size={4} speed={0.4} opacity={1} color={coinFlip.lastResult === 'HEADS' ? "#FFD700" : "#4FC3F7"} />
            )}
        </group>
    );
}