import { motion } from "framer-motion";
import heroBg from "@/assets/images/04.webp"; // Use your best wide fog skyline image

export default function HeroScene() {
  return (
    <section id="hero" className="relative h-screen w-full snap-start overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Cinematic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/90" />

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

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="font-cinzel text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#8ab4d4] mb-4"
        >
          Vaudeville 2026
        </motion.p>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="font-pirata text-5xl sm:text-7xl md:text-8xl text-[#d4af37] drop-shadow-[0_0_35px_rgba(212,175,55,0.6)] leading-tight"
        >
          The Fog Descends
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-6 max-w-lg text-sm sm:text-base text-white/70 font-cinzel leading-relaxed"
        >
          A supernatural fleet rises beyond the horizon.
          <br />
          The campus will never be the same.
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
  className="mt-16 flex flex-col items-center cursor-pointer"
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

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{
            delay: 2,
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute bottom-10 flex flex-col items-center text-[#d4af37]/60"
        >
          <span className="font-cinzel text-[9px] tracking-[0.4em] uppercase">
            Scroll
          </span>
          <div className="w-[1px] h-6 bg-[#d4af37]/60 mt-2" />
        </motion.div>

      </div>
    </section>
  );
}