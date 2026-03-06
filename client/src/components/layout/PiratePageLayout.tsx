import PirateNavbar from "./Navbar";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Ship } from "lucide-react";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function PiratePageLayout({ title, children }: Props) {
  const [, navigate] = useLocation();

  const goBackToHero = () => {
    navigate("/");

    setTimeout(() => {
      const hero = document.getElementById("hero");
      hero?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      <PirateNavbar />

      {/* Page Banner */}
      <section className="h-[50vh] flex items-center justify-center text-center">

        <h1 className="font-pirata text-6xl md:text-8xl text-[#d4af37] tracking-wider">
          {title}
        </h1>

      </section>

      {/* Page Content */}
      <section className="max-w-6xl mx-auto px-6 pb-20">

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
            <Ship size={18} />
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

        {children}
      </section>

    </div>
  );
}