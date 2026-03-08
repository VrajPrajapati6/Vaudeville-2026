import { useState, useEffect, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import compassBg from "@/assets/images/compass-bg.png";
import wheelImg from "@/assets/images/ship-wheel.png";

type Stage = "loading" | "compass" | "activating" | "revealing" | "main";

interface CompassSectionProps {
  stage: Stage;
  handleEnter: () => void;
}

export default function CompassSection({ stage, handleEnter }: CompassSectionProps) {

  const wheelRef = useRef<HTMLDivElement>(null);

  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const [wheelRotation, setWheelRotation] = useState(0);

  const dragging = useRef(false);
  const lastAngle = useRef<number | null>(null);

  /* ------------------ CALCULATE ANGLE ------------------ */

  const getAngle = (x: number, y: number) => {
    if (!wheelRef.current) return 0;

    const rect = wheelRef.current.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = x - centerX;
    const dy = y - centerY;

    return Math.atan2(dy, dx) * (180 / Math.PI);
  };

  /* ------------------ START DRAG ------------------ */

  const startDrag = (x: number, y: number) => {
    dragging.current = true;
    lastAngle.current = getAngle(x, y);
  };

  /* ------------------ DRAG MOVE ------------------ */

  const dragMove = (x: number, y: number) => {
    if (!dragging.current || lastAngle.current === null) return;

    const angle = getAngle(x, y);

    let delta = angle - lastAngle.current;

    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    setWheelRotation((prev) => {
      const newRotation = prev + delta;

      if (Math.abs(newRotation) > 160) {
        handleEnter();
      }

      return newRotation;
    });

    lastAngle.current = angle;
  };

  /* ------------------ END DRAG ------------------ */

  const endDrag = () => {
    dragging.current = false;
    lastAngle.current = null;
  };

  /* ------------------ MOUSE EVENTS ------------------ */

  useEffect(() => {

    const mouseMove = (e: MouseEvent) => {
      dragMove(e.clientX, e.clientY);
    };

    const mouseUp = () => endDrag();

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseUp);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);
    };

  }, []);

  /* ------------------ TOUCH EVENTS ------------------ */

  useEffect(() => {

    const touchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      dragMove(t.clientX, t.clientY);
    };

    const touchEnd = () => endDrag();

    window.addEventListener("touchmove", touchMove);
    window.addEventListener("touchend", touchEnd);

    return () => {
      window.removeEventListener("touchmove", touchMove);
      window.removeEventListener("touchend", touchEnd);
    };

  }, []);

  /* ------------------ PARALLAX EFFECT ------------------ */

  useEffect(() => {

    if (stage !== "compass") return;

    const pointerMove = (x: number, y: number) => {

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      mouseX.set(x - centerX);
      mouseY.set(y - centerY);
    };

    const mouseMove = (e: MouseEvent) => pointerMove(e.clientX, e.clientY);

    const touchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      pointerMove(t.clientX, t.clientY);
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("touchmove", touchMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("touchmove", touchMove);
    };

  }, [stage]);

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

        {/* Wheel */}

        <motion.div
          ref={wheelRef}
          style={{ rotateX, rotateY }}
          animate={
            stage === "activating"
              ? { scale: 1.05 }
              : stage === "revealing"
              ? { scale: 4, opacity: 0, rotate: 360 }
              : { scale: 1, opacity: 1 }
          }
          transition={
            stage === "activating"
              ? { duration: 0.7 }
              : stage === "revealing"
              ? { duration: 1 }
              : { duration: 0.4 }
          }
          className="
            relative
            w-[min(75vw,75vh)]
            h-[min(75vw,75vh)]
            max-w-[620px]
            max-h-[620px]
            md:w-[min(60vw,60vh)]
            md:h-[min(60vw,60vh)]
            cursor-grab active:cursor-grabbing
          "
          onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
          onTouchStart={(e) => {
            const t = e.touches[0];
            startDrag(t.clientX, t.clientY);
          }}
        >

          {/* ROTATING GUIDE RING */}

          {stage === "compass" && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "linear"
                }}
                className="border border-[#d4af37]/40 rounded-full w-[110%] h-[110%]"
              />
            </motion.div>
          )}

          {/* Wheel Image */}

          <motion.img
            src={wheelImg}
            alt="Ship Wheel"
            style={{ rotate: wheelRotation }}
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

        {/* Instruction Text */}

        {stage === "compass" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 text-[#d4af37] font-cinzel tracking-[0.3em] text-sm sm:text-lg text-center"
          >
            DRAG & ROTATE THE WHEEL
          </motion.p>
        )}

      </div>
    </motion.div>
  );
}