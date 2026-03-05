import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Ship } from "lucide-react";

import PiratePageLayout from "@/components/layout/PiratePageLayout";

export default function About() {

  const [, navigate] = useLocation();

  const goBackToHero = () => {
    navigate("/");

    setTimeout(() => {
      const hero = document.getElementById("hero");
      hero?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <PiratePageLayout title="About Vaudeville">

      {/* Back to Voyage Button */}
      <motion.button
        onClick={goBackToHero}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="
        group
        mb-10
        flex items-center gap-3
        px-6 py-3
        border border-[#d4af37]
        text-[#d4af37]
        font-cinzel
        tracking-wider
        rounded-md
        relative
        overflow-hidden
        hover:bg-[#d4af37]/10
        transition-all duration-300
        shadow-[0_0_10px_rgba(212,175,55,0.3)]
      "
      >

        {/* Sailing Ship Icon */}
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Ship size={18}/>
        </motion.div>

        <span>Return to the Voyage</span>

        {/* Glow line animation */}
        <span
          className="
          absolute bottom-0 left-0 h-[2px] w-0
          bg-[#d4af37]
          group-hover:w-full
          transition-all duration-500
        "
        />

      </motion.button>

      {/* About Content */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-cinzel text-lg leading-relaxed text-gray-300"
      >

        Vaudeville is the annual cultural and technical festival of the
        Electronics & Instrumentation Department at Nirma University.

        <br /><br />

        The event brings together creativity, innovation, and competition
        through various events, workshops, and performances.

        <br /><br />

        Each year Vaudeville transforms the campus into an arena of
        exploration, collaboration, and discovery.

      </motion.p>

    </PiratePageLayout>
  );
}