import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MotionValue } from "framer-motion";
import { Stars, Sparkles, Float } from "@react-three/drei";
import * as THREE from "three";

export default function CinematicElements({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
    const moonRef = useRef<THREE.Mesh>(null);
    const islandsRef = useRef<THREE.Group>(null);
    const treasureRef = useRef<THREE.Group>(null);
    const dockRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        const scroll = scrollYProgress.get();

        // Moon follows the scroll slightly to create parallax
        if (moonRef.current) {
            moonRef.current.position.y = 8 + scroll * 15;
            moonRef.current.position.z = -50 + scroll * 20;
        }

        // Islands (appear around scroll 0.4 for Events section)
        if (islandsRef.current) {
            const targetIslandY = (scroll > 0.35 && scroll < 0.6) ? -0.5 : -15;
            islandsRef.current.position.y = THREE.MathUtils.lerp(islandsRef.current.position.y, targetIslandY, 0.05);
        }

        // Treasure (appears around scroll 0.7 for Merch section)
        if (treasureRef.current) {
            const targetTreasureY = (scroll > 0.65 && scroll < 0.85) ? 0 : -10;
            treasureRef.current.position.y = THREE.MathUtils.lerp(treasureRef.current.position.y, targetTreasureY, 0.05);
        }

        // Dock (appears around scroll 0.9 for Core Crew section)
        if (dockRef.current) {
            const targetDockY = scroll > 0.85 ? -0.5 : -10;
            dockRef.current.position.y = THREE.MathUtils.lerp(dockRef.current.position.y, targetDockY, 0.05);
        }
    });

    return (
        <>
            {/* Stars Background */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            {/* Glowing Moon */}
            <mesh ref={moonRef} position={[15, 8, -50]}>
                <sphereGeometry args={[4, 32, 32]} />
                <meshBasicMaterial color="#fffae6" />
                <pointLight intensity={3} color="#fffae6" distance={150} decay={2} />
            </mesh>

            {/* Magical sparkles / fireflies */}
            <Sparkles count={150} scale={30} size={4} speed={0.4} opacity={0.5} position={[0, 2, 0]} color="#d4af37" />

            {/* Islands */}
            <group ref={islandsRef} position={[-8, -15, -12]}>
                <mesh position={[0, 0, 0]}>
                    <coneGeometry args={[5, 6, 8]} />
                    <meshStandardMaterial color="#11151c" roughness={1} />
                </mesh>
                <mesh position={[7, -1, -5]}>
                    <coneGeometry args={[4, 5, 6]} />
                    <meshStandardMaterial color="#11151c" roughness={1} />
                </mesh>
            </group>

            {/* Treasure Chest */}
            <group ref={treasureRef} position={[8, -10, -5]}>
                <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[1.2, 0.8, 1]} />
                        <meshStandardMaterial color="#8b5a2b" metalness={0.3} roughness={0.7} />
                    </mesh>
                    <mesh position={[0, 0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.6, 0.6, 1, 16, 1, false, 0, Math.PI]} />
                        <meshStandardMaterial color="#8b5a2b" metalness={0.3} roughness={0.7} />
                    </mesh>
                    <pointLight distance={8} intensity={6} color="#ffd700" position={[0, 1, 0]} />
                    <Sparkles count={30} scale={2} size={3} color="#ffd700" />
                </Float>
            </group>

            {/* Dock */}
            <group ref={dockRef} position={[15, -10, 4]}>
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[6, 0.6, 12]} />
                    <meshStandardMaterial color="#3e2723" roughness={1} />
                </mesh>
                <mesh position={[-2, 1, 4]}>
                    <cylinderGeometry args={[0.1, 0.1, 2.5]} />
                    <meshStandardMaterial color="#2d1a11" />
                </mesh>
                <pointLight position={[-2, 2.5, 4]} color="#ffaa00" intensity={4} distance={15} />
                <mesh position={[-2, 2.5, 4]}>
                    <sphereGeometry args={[0.15]} />
                    <meshBasicMaterial color="#ffcc00" />
                </mesh>
            </group>
        </>
    );
}
