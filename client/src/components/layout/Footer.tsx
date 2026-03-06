import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#0a0a0a] border-t border-[#d4af37]/20 pt-0 pb-8 px-6 sm:px-12 z-20 overflow-hidden">
      
      {/* Rotating Strip ABOVE Footer */}
      <div className="w-screen relative left-1/2 -translate-x-1/2 overflow-hidden border-b border-[#d4af37]/20 py-6 mb-12 bg-[#d4af37]/5">
        <div className="whitespace-nowrap flex animate-marquee font-pirata text-4xl sm:text-5xl text-[#d4af37] tracking-wider opacity-100 text-glow select-none">
          <span className="px-6">VAUDEVILLE '26 •</span>
          <span className="px-6">VAUDEVILLE '26 •</span>
          <span className="px-6">VAUDEVILLE '26 •</span>
          <span className="px-6">VAUDEVILLE '26 •</span>
          <span className="px-6">VAUDEVILLE '26 •</span>
          <span className="px-6">VAUDEVILLE '26 •</span>
          <span className="px-6">VAUDEVILLE '26 •</span>
          <span className="px-6">VAUDEVILLE '26 •</span>
        </div>
      </div>

      {/* Subtle background texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/old-map.png')]" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-12 md:gap-8">
        
        {/* Left Section - Contact Us */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="font-cinzel text-xl text-[#d4af37] tracking-widest mb-6">Contact Us</h3>
          
          <div className="flex flex-col gap-4 font-cinzel text-sm text-[#e0e0e0]/80">
            <div>
              <p className="text-[#d4af37]/90 font-bold tracking-wider">Aarav Mehta</p>
              <a href="tel:+919876543210" className="hover:text-[#d4af37] transition-colors duration-300 decoration-[#d4af37]/50 underline-offset-4">
                +91 9876543210
              </a>
            </div>
            
            <div>
              <p className="text-[#d4af37]/90 font-bold tracking-wider">Riya Sharma</p>
              <a href="tel:+919123456780" className="hover:text-[#d4af37] transition-colors duration-300 decoration-[#d4af37]/50 underline-offset-4">
                +91 9123456780
              </a>
            </div>
          </div>
        </div>

        {/* Center Section - Social Media */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <h3 className="font-cinzel text-xl text-[#d4af37] tracking-widest mb-6">Follow Us</h3>
          
          <a 
            href="https://instagram.com/vaudeville" 
            target="_blank" 
            rel="noreferrer"
            className="group flex flex-col items-center gap-3 hover:text-[#d4af37] transition-all duration-300"
          >
            <div className="p-3 border border-[#d4af37]/30 rounded-full group-hover:border-[#d4af37] group-hover:bg-[#d4af37]/10 transition-all duration-300">
               <Instagram size={24} className="text-[#d4af37]" />
            </div>
          </a>
        </div>

        {/* Right Section - Developed By */}
        <div className="flex-1 flex flex-col items-center md:items-end text-center md:text-right">
          <h3 className="font-cinzel text-xl text-[#d4af37] tracking-widest mb-6">Developed By</h3>
          <div className="flex flex-col gap-4 font-cinzel text-sm">
            <p className="text-[#d4af37]/90 font-bold tracking-wider">Pal Patel</p>
            <p className="text-[#d4af37]/90 font-bold tracking-wider">Pranshu Rajan</p>
            <p className="text-[#d4af37]/90 font-bold tracking-wider">Vraj</p>
          </div>
        </div>

      </div>

    </footer>
  );
}