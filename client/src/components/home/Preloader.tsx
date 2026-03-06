import { motion } from "framer-motion";
import introVideo from "@/assets/intro.mp4";

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
      className="fixed inset-0 z-40 overflow-hidden bg-[#0e1a22]"
    >
      {/* Cinematic Video Background */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black">
        <motion.video
          src={introVideo}
          autoPlay
          muted
          loop
          playsInline
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full h-full object-cover md:object-cover sm:aspect-video"
          style={{ objectPosition: "center" }}
        />
      </div>

      {/* Dark Overlay - Softened gradient so video is clear but text remains readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Subtle Noise */}
      <div className="absolute inset-0 opacity-20 bg-noise mix-blend-overlay pointer-events-none" />

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
      <div className="relative z-10 flex flex-col items-center justify-end h-full text-center px-4 pb-20 sm:pb-32">

        {/* Title — each letter drops in progress-driven from 15% to 80% */}
        <div className="flex items-end justify-center font-pirata text-4xl sm:text-6xl md:text-8xl text-[#d4af37]">
          {"VAUDEVILLE".split("").map((letter, i) => {
            // threshold: letter 0 → 15%, letter 9 → 80%
            const threshold = 15 + (i / 9) * 65;
            const visible = progress >= threshold;
            return (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 28 }}
                animate={
                  visible
                    ? { opacity: 1, y: 0, textShadow: "0 0 28px rgba(212,175,55,0.75)" }
                    : { opacity: 0, y: 28 }
                }
                transition={{ duration: 0.45, ease: "easeOut" }}
                style={{ display: "inline-block" }}
              >
                {letter}
              </motion.span>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: progress >= 82 ? 0.8 : 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 font-cinzel text-xs sm:text-lg tracking-widest text-white/80 uppercase"
        >
          The Fog Descends...
        </motion.p>

        {/* Improved Progress Section */}
        <div className="mt-8 mb-4 w-44 sm:w-72">
          <motion.div
            animate={{
              textShadow: [
                "0 0 10px rgba(212,175,55,0.4)",
                "0 0 20px rgba(212,175,55,0.8)",
                "0 0 10px rgba(212,175,55,0.4)"
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="font-pirata text-2xl text-[#d4af37]"
          >
            {Math.round(progress)}%
          </motion.div>

          <div className="mt-4 h-[4px] bg-black/50 border border-[#d4af37]/30 rounded-full overflow-hidden relative backdrop-blur-sm">
            <motion.div
              className="h-full bg-gradient-to-r from-[#d4af37]/50 via-[#d4af37] to-[#ffe58f] shadow-[0_0_15px_#d4af37]"
              style={{ width: `${progress}%` }}
            />

            {/* Shimmer effect on the bar */}
            <motion.div
              className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              animate={{
                x: ['-100%', '400%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
        </div>

      </div>
    </motion.div>
  );
}
