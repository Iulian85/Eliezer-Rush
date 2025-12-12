
import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Cylinder, Center, ContactShadows, Sparkles } from '@react-three/drei';
import { useSpring, animated, config } from '@react-spring/three';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';

export default function CoinFlipScene() {
    const { coinFlip } = useGameStore();
    const groupRef = useRef<THREE.Group>(null);
    
    // Rotation State Management
    // We accumulate rotation so the coin always spins "forward" and doesn't unwind
    const rotationAccumulator = useRef(0);
    
    // Visual State for animations
    const [isLanded, setIsLanded] = useState(false);

    useEffect(() => {
        if (coinFlip.isFlipping) {
            setIsLanded(false);
            // Prepare for toss: reset flags if needed
        } else if (!coinFlip.isFlipping && coinFlip.lastResult) {
            // FLIP FINISHED
            setIsLanded(true);
        }
    }, [coinFlip.isFlipping, coinFlip.lastResult]);

    // Calculate Target Rotation
    // 1 full spin = 2 * PI
    // Heads = 0 offset (relative to base), Tails = PI offset
    // Base orientation: The Cylinder is rotated PI/2 on X to stand up.
    // We animate the Group's X rotation.
    
    const getTargetRotation = () => {
        if (coinFlip.isFlipping) {
            // While flipping, target a high rotation number
            return rotationAccumulator.current + (Math.PI * 10); 
        } 
        
        // Calculate landing rotation
        const currentRev = Math.ceil(rotationAccumulator.current / (Math.PI * 2));
        const baseTarget = currentRev * (Math.PI * 2); // Next full clean rotation
        
        // Add outcome offset
        const outcomeOffset = coinFlip.lastResult === 'TAILS' ? Math.PI : 0;
        
        // Update accumulator so next flip starts from here
        const final = baseTarget + outcomeOffset;
        rotationAccumulator.current = final;
        return final;
    };

    const targetRot = getTargetRotation();

    // PHYSICS SPRINGS
    const { rotation, position } = useSpring({
        // Rotation: Spin fast when flipping, settle when done
        rotation: [targetRot, 0, 0],
        // Position: Toss up (y=3) when flipping, land (y=1) when done
        position: coinFlip.isFlipping ? [0, 3.5, 0] : [0, 0.8, 0],
        
        config: (key) => {
            if (key === 'position') {
                // Gravity-like effect: Fast up, bounce down
                return coinFlip.isFlipping 
                    ? { mass: 1, tension: 120, friction: 14 } // Toss up
                    : { mass: 2, tension: 200, friction: 12 }; // Heavy landing bounce
            }
            return { mass: 1, tension: 60, friction: 20 }; // Smooth rotation
        }
    });

    const isHeadsWin = coinFlip.lastResult === 'HEADS';

    return (
        <group position={[0, 0, 0]}>
            {/* Dynamic Shadow - Shrinks when coin goes up */}
            <animated.group scale={position.to(y => 1 - (y/5))}>
                 <ContactShadows opacity={0.6} scale={10} blur={2.5} far={10} resolution={256} color="#000000" />
            </animated.group>

            {/* The Coin Object */}
            <animated.group 
                ref={groupRef} 
                position={position as any}
                rotation={rotation as any}
            >
                {/* 1. Outer Ring (Gold/Metal) */}
                <Cylinder args={[2.0, 2.0, 0.25, 64]} rotation={[Math.PI/2, 0, 0]}>
                    <meshPhysicalMaterial 
                        color="#FCD34D" // Amber-Gold
                        metalness={0.7} 
                        roughness={0.2}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                    />
                </Cylinder>
                
                {/* 2. Face: HEADS (Z+) */}
                <group position={[0, 0, 0.13]}>
                     {/* Inset Face Background */}
                     <Cylinder args={[1.8, 1.8, 0.05, 64]} rotation={[Math.PI/2, 0, 0]}>
                        <meshPhysicalMaterial color="#FFEDD5" metalness={0.2} roughness={0.5} />
                    </Cylinder>
                    {/* Icon */}
                    <Center>
                        <Text 
                            position={[0, 0.2, 0.05]} 
                            fontSize={1.2} 
                            color="#D97706" // Dark Amber
                            font="https://unpkg.com/three@0.160.0/examples/fonts/droid/droid_sans_bold.typeface.json"
                        >
                            🐹
                        </Text>
                        <Text 
                            position={[0, -0.8, 0.05]} 
                            fontSize={0.3} 
                            color="#B45309"
                            font="https://unpkg.com/three@0.160.0/examples/fonts/droid/droid_sans_bold.typeface.json"
                        >
                            HEADS
                        </Text>
                    </Center>
                </group>

                {/* 3. Face: TAILS (Z-) */}
                <group position={[0, 0, -0.13]} rotation={[0, Math.PI, 0]}>
                     <Cylinder args={[1.8, 1.8, 0.05, 64]} rotation={[Math.PI/2, 0, 0]}>
                        <meshPhysicalMaterial color="#E0F2FE" metalness={0.2} roughness={0.5} />
                    </Cylinder>
                    <Center>
                        <Text 
                            position={[0, 0.2, 0.05]} 
                            fontSize={1.2} 
                            color="#0284C7" // Sky Blue
                        >
                            💎
                        </Text>
                        <Text 
                            position={[0, -0.8, 0.05]} 
                            fontSize={0.3} 
                            color="#0369A1" 
                            font="https://unpkg.com/three@0.160.0/examples/fonts/droid/droid_sans_bold.typeface.json"
                        >
                            TAILS
                        </Text>
                    </Center>
                </group>
            </animated.group>
            
            {/* Landing / Win Effects */}
            {isLanded && (
                <>
                    {/* Impact Dust (White subtle sparkles) */}
                    <Sparkles 
                        count={20} 
                        scale={5} 
                        size={2} 
                        speed={0.2} 
                        opacity={0.5} 
                        color="#FFF" 
                        position={[0, 0.5, 0]} 
                    />
                    
                    {/* Winner Glow (Gold or Blue) */}
                    <Sparkles 
                        count={40} 
                        scale={8} 
                        size={5} 
                        speed={0.5} 
                        opacity={1} 
                        color={isHeadsWin ? "#FBBF24" : "#38BDF8"} 
                        position={[0, 2, 0]}
                    />
                </>
            )}
        </group>
    );
}