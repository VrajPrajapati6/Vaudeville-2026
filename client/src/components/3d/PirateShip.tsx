import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MotionValue } from "framer-motion";
import * as THREE from "three";
import { Float } from "@react-three/drei";

export default function PirateShip({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
    const shipGroupRef = useRef<THREE.Group>(null);
    const shipModelRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!shipGroupRef.current || !shipModelRef.current) return;
        const scroll = scrollYProgress.get(); // 0 to 1

        // Wave bobbing applied to inner model
        const time = state.clock.elapsedTime;
        const waveY = Math.sin(time * 2) * 0.2;
        const waveRotZ = Math.sin(time * 1.5) * 0.05;
        const waveRotX = Math.cos(time * 1.2) * 0.05;

        shipModelRef.current.position.y = waveY;
        shipModelRef.current.rotation.set(waveRotX, -Math.PI / 2 + waveRotZ + scroll * 0.2, waveRotZ);

        // Main path movement applied to outer group
        // Sailing from left to right and slightly inward then outward
        const startX = -20;
        const endX = 25;
        const x = THREE.MathUtils.lerp(startX, endX, scroll);

        const z = -10 + Math.sin(scroll * Math.PI) * 12;

        // Let the ship sink a bit if scrolling past the end (docked)
        const yOffset = scroll > 0.9 ? THREE.MathUtils.lerp(0, -0.5, (scroll - 0.9) * 10) : 0;

        shipGroupRef.current.position.set(x, yOffset, z);
    });

    return (
        <group ref={shipGroupRef}>
            <group ref={shipModelRef}>
                {/* Hull */}
                <mesh position={[0, -0.2, 0]}>
                    <boxGeometry args={[4.5, 1.2, 1.8]} />
                    <meshStandardMaterial color="#3e2723" roughness={0.9} />
                </mesh>

                {/* Front Deck (Bow) */}
                <mesh position={[-2.5, 0.2, 0]} rotation={[0, 0, Math.PI / 6]}>
                    <boxGeometry args={[1.5, 1, 1.6]} />
                    <meshStandardMaterial color="#4e342e" roughness={0.9} />
                </mesh>

                {/* Back Deck (Stern) */}
                <mesh position={[2, 0.5, 0]} rotation={[0, 0, -Math.PI / 12]}>
                    <boxGeometry args={[2, 1.5, 1.7]} />
                    <meshStandardMaterial color="#4e342e" roughness={0.9} />
                </mesh>

                {/* Main Mast */}
                <mesh position={[0, 2.5, 0]}>
                    <cylinderGeometry args={[0.08, 0.1, 5]} />
                    <meshStandardMaterial color="#2d1a11" />
                </mesh>

                {/* Front Mast */}
                <mesh position={[-1.5, 2, 0]}>
                    <cylinderGeometry args={[0.06, 0.08, 4]} />
                    <meshStandardMaterial color="#2d1a11" />
                </mesh>

                {/* Back Mast */}
                <mesh position={[1.5, 2, 0]}>
                    <cylinderGeometry args={[0.06, 0.08, 3]} />
                    <meshStandardMaterial color="#2d1a11" />
                </mesh>

                {/* Main Sails */}
                <mesh position={[0, 2.5, 0]} rotation={[0, Math.PI / 4, 0]}>
                    <planeGeometry args={[3, 3, 4, 4]} />
                    <meshStandardMaterial color="#e0e0e0" side={THREE.DoubleSide} />
                </mesh>

                <mesh position={[0, 0.5, 0]} rotation={[0, Math.PI / 4, 0]}>
                    <planeGeometry args={[3.5, 2, 4, 4]} />
                    <meshStandardMaterial color="#e0e0e0" side={THREE.DoubleSide} />
                </mesh>

                {/* Front Sails */}
                <mesh position={[-1.5, 2, 0]} rotation={[0, Math.PI / 4, 0]}>
                    <planeGeometry args={[2, 2.5, 4, 4]} />
                    <meshStandardMaterial color="#e0e0e0" side={THREE.DoubleSide} />
                </mesh>

                {/* Lanterns */}
                <pointLight position={[-3.2, 1, 0]} color="#ff9900" intensity={2} distance={8} />
                <mesh position={[-3.2, 1, 0]}>
                    <sphereGeometry args={[0.1]} />
                    <meshBasicMaterial color="#ffcc00" />
                </mesh>

                <pointLight position={[3, 1.5, 0]} color="#ff9900" intensity={2} distance={8} />
                <mesh position={[3, 1.5, 0]}>
                    <sphereGeometry args={[0.1]} />
                    <meshBasicMaterial color="#ffcc00" />
                </mesh>
            </group>
        </group>
    );
}
