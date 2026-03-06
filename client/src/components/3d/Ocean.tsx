import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MotionValue } from "framer-motion";

export default function Ocean({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
    const waterRef = useRef<THREE.Mesh>(null);

    // Using a moderately dense plane to allow vertex manipulation for waves
    const geometry = useMemo(() => new THREE.PlaneGeometry(150, 150, 64, 64), []);

    useFrame((state) => {
        if (!waterRef.current) return;
        const time = state.clock.elapsedTime;
        const positionAttr = waterRef.current.geometry.attributes.position;

        // Animate vertices to create a rolling wave effect
        for (let i = 0; i < positionAttr.count; i++) {
            const u = geometry.attributes.uv.getX(i);
            const v = geometry.attributes.uv.getY(i);

            const wave1 = Math.sin(u * 15 + time * 1.5) * 0.2;
            const wave2 = Math.cos(v * 20 + time * 1.2) * 0.2;
            const bigWave = Math.sin(u * 5 + time * 0.5) * 0.5;

            positionAttr.setZ(i, wave1 + wave2 + bigWave);
        }
        positionAttr.needsUpdate = true;
    });

    return (
        <mesh ref={waterRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
            <meshStandardMaterial
                color="#010a15"
                roughness={0.1}
                metalness={0.8}
                transparent
                opacity={0.9}
            />
        </mesh>
    );
}
