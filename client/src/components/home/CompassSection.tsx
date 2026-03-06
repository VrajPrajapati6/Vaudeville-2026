import { useState, useEffect, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import compassBg from "@/assets/images/compass-bg.png";
import compassImg from "@/assets/images/compass.png";

type Stage = "loading" | "compass" | "activating" | "revealing" | "main";

interface CompassSectionProps {
    stage: Stage;
    handleEnter: () => void;
}

export default function CompassSection({ stage, handleEnter }: CompassSectionProps) {
    const compassRef = useRef<HTMLDivElement>(null);

    const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
    const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

    const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
    const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

    const [compassRotation, setCompassRotation] = useState(0);

    useEffect(() => {
        if (stage !== "compass") return;

        const handlePointerMove = (x: number, y: number) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const dx = x - centerX;
            const dy = y - centerY;

            mouseX.set(dx);
            mouseY.set(dy);

            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            setCompassRotation(angle);
        };

        const handleMouseMove = (e: MouseEvent) => {
            handlePointerMove(e.clientX, e.clientY);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                handlePointerMove(touch.clientX, touch.clientY);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("touchmove", handleTouchMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, [stage, mouseX, mouseY]);

    return (
        <motion.div
            key="compass"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex flex-col items-center justify-center z-30"
        >
            {/* Background */}
            <motion.div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${compassBg})` }}
            />

            {/* Dark Overlay */}
            <motion.div
                className="absolute inset-0 bg-black"
                animate={{
                    opacity:
                        stage === "activating"
                            ? 0.6
                            : stage === "revealing"
                                ? 1
                                : 0.4,
                }}
                transition={{ duration: 0.7 }}
            />

            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4">

                {/* Compass */}
                <motion.div
                    ref={compassRef}
                    style={{ rotateX, rotateY }}
                    animate={
                        stage === "activating"
                            ? { scale: 1.1 }
                            : stage === "revealing"
                                ? { scale: 4, opacity: 0 }
                                : { scale: 1, opacity: 1 }
                    }
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="
            relative
            w-[min(75vw,75vh)]
            h-[min(75vw,75vh)]
            max-w-[620px]
            max-h-[620px]
            md:w-[min(60vw,60vh)]
            md:h-[min(60vw,60vh)]
          "
                >
                    <motion.img
                        src={compassImg}
                        alt="Navigational Compass"
                        style={{ rotate: compassRotation }}
                        animate={
                            stage === "activating"
                                ? {
                                    filter:
                                        "drop-shadow(0 0 45px rgba(212,175,55,0.9))",
                                }
                                : {
                                    filter:
                                        "drop-shadow(0 0 30px rgba(212,175,55,0.6))",
                                }
                        }
                        transition={{ duration: 0.4 }}
                        className="w-full h-full object-contain"
                    />
                </motion.div>

                {/* Button */}
                {stage === "compass" && (
                    <motion.button
                        onClick={handleEnter}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="
              mt-8 sm:mt-12
              px-6 sm:px-10
              py-4 sm:py-5
              bg-black/60
              backdrop-blur-xl
              border border-[#d4af37]/50
              text-[#d4af37]
              font-cinzel
              font-bold
              tracking-[0.2em] sm:tracking-[0.3em]
              text-sm sm:text-xl
              rounded-full
              shadow-2xl
              hover:scale-105
              transition-transform
              duration-300
              text-center
            "
                    >
                        ENTER THE VOYAGE
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}
