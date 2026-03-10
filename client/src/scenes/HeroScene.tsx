import { motion } from "framer-motion";
import heroBg from "@/assets/images/04.webp"; // Use your best wide fog skyline image

export default function HeroScene() {
  return (
    <section id="hero" className="relative h-screen w-full snap-start overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center will-change-transform opacity-20 mix-blend-overlay"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Cinematic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

      {/* Subtle Fog Overlay (Lightweight CSS effect) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.06),transparent_60%)]" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">

        {/* Top Line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-32 sm:w-52 h-px mb-6"
          style={{ background: "linear-gradient(90deg, transparent, #d4af37, transparent)" }}
        />

        {/* Logo Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mb-4"
        >
          <img 
            src="/Logo.png" 
            alt="Vaudeville Logo" 
            className="h-32 sm:h-40 md:h-52 w-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          />
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="font-pirata text-4xl sm:text-5xl md:text-6xl text-[#d4af37] drop-shadow-[0_0_35px_rgba(212,175,55,0.6)] leading-tight"
        >
          The Fog Descends
        </motion.h1>

        {/* Event Dates */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-20 font-pirata text-xl sm:text-2xl text-[#d4af37] drop-shadow-[0_0_10px_rgba(212,175,55,0.3)] uppercase flex justify-center items-center gap-6"
        >
          <span className="tracking-[0.1em]">20 - 21 - 22</span>
          <span className="text-[#d4af37] tracking-[0.4em]">March</span>
        </motion.p>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{
            delay: 1.5,
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth"
            });
          }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer"
        >

          <span className="font-cinzel text-[10px] tracking-[0.4em] uppercase text-[#d4af37]">
            Scroll
          </span>

          <div className="mt-3 w-[2px] h-10 bg-[#d4af37]/60 relative overflow-hidden">

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute w-full h-3 bg-[#d4af37]"
            />

          </div>

        </motion.div>

      </div>
    </section>
  );
}