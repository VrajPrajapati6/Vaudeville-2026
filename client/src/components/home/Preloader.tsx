import { motion } from "framer-motion";
import invasionBg from "@/assets/images/04.webp";

interface PreloaderProps {
  progress: number;
}

export default function Preloader({ progress }: PreloaderProps) {
  return (
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
  );
}
