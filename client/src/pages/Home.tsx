import { useState, useEffect, useRef } from "react";
import PirateNavbar from "@/components/layout/PirateNavbar";
import HeroScene from "@/scenes/HeroScene";
import invasionBg from "@/assets/images/04.webp";
import { motion, AnimatePresence, useSpring, useTransform, useScroll, useMotionValue } from "framer-motion";
import loadingBg from "@/assets/images/loading-bg.png";
import compassBg from "@/assets/images/compass-bg.png";
import compassImg from "@/assets/images/compass.png";
import mainBg from "@/assets/images/main-bg.png";
import pirateMap from "@/assets/images/pirate-map.png";
import preloaderShip from "@/assets/images/preloader-ship.png";
import parchmentImg from "@/assets/images/parchment.png";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type Stage = "loading" | "compass" | "activating" | "revealing" | "main";

const EVENTS = [
  { id: 1, name: "Treasure Hunt", chapter: "Chapter I", description: "Solve riddles to find the hidden chest.", x: "20%", y: "20%" },
  { id: 2, name: "Sea Battle", chapter: "Chapter II", description: "Naval strategy game with miniature ships.", x: "40%", y: "50%" },
  { id: 3, name: "Pirate Ball", chapter: "Chapter III", description: "A night of music and rum-inspired drinks.", x: "70%", y: "30%" },
  { id: 4, name: "The Black Spot", chapter: "Chapter IV", description: "Elite coding competition for the bold.", x: "85%", y: "75%" },
];

export default function Home() {
  const [stage, setStage] = useState<Stage>("loading");
  const [progress, setProgress] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<typeof EVENTS[0] | null>(null);
  const compassRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const indicatorX = useTransform(scrollYProgress, [0, 1], ["10%", "90%"]);
  const indicatorY = useTransform(scrollYProgress, [0, 1], ["10%", "80%"]);

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const yFog = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const shipScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.2]);

  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const [compassRotation, setCompassRotation] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (stage !== "compass") return;

      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY - window.innerHeight / 2;

      mouseX.set(x);
      mouseY.set(y);

      const angle = Math.atan2(y, x) * (180 / Math.PI);
      setCompassRotation(angle);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [stage]);

  useEffect(() => {
    if (stage !== "loading") return;

    const duration = 3000;
    const interval = 30;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setStage("compass"), 500);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [stage]);

  const handleEnter = () => {
  setStage("activating");

  setTimeout(() => {
    setStage("revealing");
  }, 700);

  setTimeout(() => {
    setStage("main");
  }, 1700);
};

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-black">

      <div className="absolute inset-0 z-50 pointer-events-none bg-noise" />

      <AnimatePresence mode="wait">

        {/* ---------------- PRELOADER ---------------- */}
       {stage === "loading" && (
  <motion.div
    key="loading"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.6 } }}
    className="absolute inset-0 z-40 overflow-hidden bg-[#0e1a22]"
  >
    {/* Cinematic Background Reacting to Progress */}
    <motion.img
      src={invasionBg}
      alt="Invasion"
      initial={false}
      animate={{
        scale: 1.15 - progress * 0.0015,
        filter: `blur(${8 - progress * 0.08}px) brightness(${0.5 + progress * 0.005})`
      }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 w-full h-full object-cover"
    />

    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-black/60" />

    {/* Subtle Noise */}
    <div className="absolute inset-0 opacity-30 bg-noise mix-blend-overlay pointer-events-none" />

    {/* Final Lightning Strike at 100% */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: progress > 95 ? [0, 1, 0] : 0
      }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 bg-white pointer-events-none"
    />

    {/* Dramatic Dark Dip Before Exit */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: progress > 97 ? [0, 0.8, 1] : 0
      }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 bg-black pointer-events-none"
    />

    {/* Content */}
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">

      {/* Title with Breathing Glow */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{
          opacity: 1,
          y: 0,
          textShadow: [
            "0 0 15px rgba(212,175,55,0.4)",
            "0 0 35px rgba(212,175,55,0.8)",
            "0 0 15px rgba(212,175,55,0.4)"
          ]
        }}
        transition={{
          delay: 1.2,
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="font-pirata text-4xl sm:text-6xl md:text-8xl text-[#d4af37]"
      >
        VAUDEVILLE
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1.8 }}
        className="mt-4 font-cinzel text-xs sm:text-lg tracking-widest text-white/80 uppercase"
      >
        The Fog Descends...
      </motion.p>

      {/* Progress */}
      <div className="mt-10 w-44 sm:w-64">
        <span className="font-pirata text-lg text-[#d4af37]">
          {Math.round(progress)}%
        </span>

        <div className="mt-3 h-[2px] bg-white/20 overflow-hidden relative">
          <motion.div
            className="h-full bg-[#d4af37] shadow-[0_0_20px_#d4af37]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

    </div>
  </motion.div>
)}

       {/* ---------------- COMPASS ---------------- */}
{(stage === "compass" ||
  stage === "activating" ||
  stage === "revealing") && (
  <motion.div
    key="compass"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 flex flex-col items-center justify-center z-30"
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
)}

        {/* ---------------- MAIN ---------------- */}
        {stage === "main" && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-20 overflow-y-auto bg-[#0a0a0a]"
          >

            {/* NAV */}
           <PirateNavbar />

           <div className="snap-y snap-mandatory">
                <HeroScene />
           </div>

            {/* DIALOG */}
            <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
              <DialogContent className="w-[95vw] sm:max-w-2xl bg-transparent border-none p-0 overflow-hidden">
                <motion.div
                  className="relative p-6 sm:p-12 min-h-[400px] sm:min-h-[500px] flex flex-col"
                  style={{
                    backgroundImage: `url(${parchmentImg})`,
                    backgroundSize: 'cover'
                  }}
                >
                  <DialogHeader>
                    <DialogTitle className="font-pirata text-3xl sm:text-6xl text-[#2a1a0a]">
                      {selectedEvent?.name}
                    </DialogTitle>
                    <DialogDescription className="text-[#2a1a0a]/80 font-cinzel text-sm sm:text-lg italic mt-4">
                      "{selectedEvent?.description}"
                    </DialogDescription>
                  </DialogHeader>

                  <button className="mt-8 sm:mt-12 w-full py-4 sm:py-5 bg-[#2a1a0a] text-[#d4af37] font-pirata text-xl sm:text-3xl tracking-widest">
                    SEAL THE COMPACT
                  </button>
                </motion.div>
              </DialogContent>
            </Dialog>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}