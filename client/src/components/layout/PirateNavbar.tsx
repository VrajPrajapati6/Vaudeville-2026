import React from "react";

export default function PirateNavbar() {
  return (
    <nav className="fixed top-0 left-0 w-full px-4 sm:px-6 py-4 flex justify-between items-center z-50 border-b border-[#d4af37]/20 bg-black/80 backdrop-blur-md">
      <div className="font-pirata text-xl sm:text-3xl text-[#d4af37]">
        VAUDEVILLE
      </div>

      <div className="flex gap-4 sm:gap-8 font-cinzel text-xs sm:text-sm tracking-widest text-white/70">
        <button className="hover:text-[#d4af37] transition-colors">
          VOYAGE
        </button>
        <button className="hover:text-[#d4af37] transition-colors">
          EVENTS
        </button>
      </div>
    </nav>
  );
}