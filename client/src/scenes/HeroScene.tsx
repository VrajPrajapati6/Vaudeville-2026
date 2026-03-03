import heroImg from "@/assets/images/04.webp";
import { motion } from "framer-motion";

export default function HeroScene() {
  return (
    <section className="relative h-screen w-full snap-start overflow-hidden">

      {/* Background */}
      <img
        src={heroImg}
        alt="Campus Invasion"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-4xl sm:text-6xl md:text-7xl font-pirata text-[#d4af37]"
        >
          The Fog Descends
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 max-w-xl text-sm sm:text-lg text-white/80 font-cinzel"
        >
          A supernatural fleet rises beyond the horizon.
          The campus will never be the same.
        </motion.p>

      </div>
    </section>
  );
}