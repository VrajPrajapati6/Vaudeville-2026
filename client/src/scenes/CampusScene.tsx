import { motion } from "framer-motion";
import campusBg from "@/assets/images/09.webp";

export default function CampusScene() {
  return (
    <section className="relative h-screen w-full snap-start overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${campusBg})` }}
      />

      {/* Cinematic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40 sm:bg-gradient-to-r sm:from-black/85 sm:via-black/60 sm:to-black/20" />

      {/* Subtle Dark Fade Top/Bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full max-w-6xl mx-auto px-6">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="max-w-xl text-center sm:text-left"
          >

            {/* Chapter Label */}
            <p className="font-cinzel text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#d4af37]/70 mb-6">
              Chapter I
            </p>

            {/* Title */}
            <h2 className="font-pirata text-4xl sm:text-6xl md:text-7xl text-[#f5f5f5] drop-shadow-[0_0_25px_rgba(0,0,0,0.6)] leading-tight">
              The Campus Awakens
            </h2>

            {/* Description */}
            <p className="mt-6 text-sm sm:text-base text-white/75 font-cinzel leading-relaxed">
              For three nights, the ordinary fades.
              <br />
              Lanterns burn.
              Corridors whisper.
              <br />
              And legends return to walk these grounds.
            </p>

            {/* Button */}
            <div className="mt-10">
              <button className="px-8 py-4 border border-[#d4af37] text-[#d4af37] font-cinzel tracking-widest text-sm hover:bg-[#d4af37]/10 transition-all duration-300">
                DISCOVER EVENTS
              </button>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}