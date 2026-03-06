import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Ocean from "./Ocean";
import PirateShip from "./PirateShip";
import CinematicElements from "./CinematicElements";
import { MotionValue } from "framer-motion";
import { Environment } from "@react-three/drei";

export default function StoryScene({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none user-select-none">
      <Canvas 
        camera={{ position: [0, 5, 20], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#02040a"]} />
        <fogExp2 attach="fog" args={["#02040a", 0.02]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} color="#d4af37" />
        <Suspense fallback={null}>
          <Ocean scrollYProgress={scrollYProgress} />
          <PirateShip scrollYProgress={scrollYProgress} />
          <CinematicElements scrollYProgress={scrollYProgress} />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
