import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import loadingBg from "@/assets/images/loading-bg.png";
import compassBg from "@/assets/images/compass-bg.png";
import compassImg from "@/assets/images/compass.png";
import mainBg from "@/assets/images/main-bg.png";

type Stage = "loading" | "compass" | "transition" | "main";

export default function Home() {
  const [stage, setStage] = useState<Stage>("loading");
  const [progress, setProgress] = useState(0);
  const compassRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse/Touch tracking for compass rotation
  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });
  
  // Mobile scroll/slide tracking
  const scrollY = useSpring(0, { stiffness: 50, damping: 20 });

  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);
  
  // Arrow rotation logic
  const [arrowRotation, setArrowRotation] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (stage !== "compass") return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const x = clientX - innerWidth / 2;
      const y = clientY - innerHeight / 2;
      
      mouseX.set(x);
      mouseY.set(y);

      // Calculate angle for the arrow to point at the cursor
      const angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
      setArrowRotation(angle);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (stage !== "compass") return;
      const touch = e.touches[0];
      const { clientY } = touch;
      const { innerHeight } = window;
      
      // Map vertical slide to rotation
      const normalizedY = (clientY / innerHeight) * 360;
      setArrowRotation(normalizedY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [stage, mouseX, mouseY]);

  // Fake loading progress
  useEffect(() => {
    if (stage !== "loading") return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setStage("compass"), 800); 
          return 100;
        }
        return Math.min(prev + Math.floor(Math.random() * 15) + 5, 100);
      });
    }, 250);

    return () => clearInterval(interval);
  }, [stage]);

  const handleEnter = () => {
    setStage("transition");
    setTimeout(() => {
      setStage("main");
    }, 2500);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Global Noise Overlay */}
      <div className="absolute inset-0 z-50 pointer-events-none bg-noise" />

      <AnimatePresence mode="wait">
        {/* STAGE 1: LOADING */}
        {stage === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
            className="absolute inset-0 flex flex-col items-center justify-center z-40"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
              style={{ backgroundImage: `url(${loadingBg})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />
            
            <div className="relative z-10 flex flex-col items-center">
              <motion.h1 
                className="font-pirata text-6xl md:text-8xl lg:text-9xl text-glow text-[#d4af37] mb-8"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                VAUDEVILLE
              </motion.h1>
              
              <div className="w-64 md:w-96 h-1 bg-white/10 rounded-full overflow-hidden relative">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-[#d4af37] shadow-[0_0_10px_#d4af37]"
                  style={{ width: `${progress}%` }}
                  layout
                />
              </div>
              <motion.p 
                className="mt-4 font-cinzel text-[#d4af37]/80 text-xl md:text-2xl tracking-widest"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {progress}%
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* STAGE 2 & 3: COMPASS & TRANSITION */}
        {(stage === "compass" || stage === "transition") && (
          <motion.div
            key="compass"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5 } }}
            className="absolute inset-0 flex flex-col items-center justify-center z-30 perspective-1000"
          >
            <motion.div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${compassBg})` }}
              animate={stage === "transition" ? { 
                scale: 1.5,
                filter: "blur(20px) brightness(0.5)",
              } : {
                scale: 1,
                filter: "blur(0px) brightness(1)",
              }}
              transition={{ duration: 2.5, ease: "circIn" }}
            />
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
              <motion.div
                ref={compassRef}
                style={{ 
                  rotateX, 
                  rotateY,
                  perspective: 1000 
                }}
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={
                  stage === "compass" 
                    ? { scale: 1, opacity: 1, y: 0 }
                    : { 
                        scale: 8, 
                        rotateZ: 720, 
                        opacity: 0,
                        filter: "blur(10px)"
                      }
                }
                transition={
                  stage === "compass"
                    ? { duration: 2, ease: "easeOut" }
                    : { duration: 2.2, ease: [0.7, 0, 0.3, 1] }
                }
                className="relative w-[280px] h-[280px] md:w-[500px] md:h-[500px] cursor-none"
              >
                {/* Glowing aura behind compass */}
                <motion.div 
                  className="absolute inset-0 rounded-full bg-[#d4af37]/15 blur-3xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Compass Body */}
                <img 
                  src={compassImg} 
                  alt="Navigational Compass" 
                  className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(212,175,55,0.4)]"
                />

                {/* Animated Compass Needle/Arrow */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  animate={{ rotate: arrowRotation }}
                  transition={{ type: "spring", stiffness: 60, damping: 15 }}
                >
                  <div className="w-1 md:w-2 h-1/2 bg-gradient-to-t from-transparent via-[#d4af37] to-[#d4af37] rounded-full shadow-[0_0_15px_#d4af37] relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 md:w-5 h-3 md:h-5 bg-[#d4af37] rotate-45 border-t-2 border-l-2 border-white/30" />
                  </div>
                </motion.div>
              </motion.div>

              <AnimatePresence>
                {stage === "compass" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center"
                  >
                    <motion.button
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.5, duration: 1 }}
                      onClick={handleEnter}
                      className="mt-12 px-10 py-5 bg-black/40 backdrop-blur-md border border-[#d4af37]/50 text-[#d4af37] font-cinzel font-bold tracking-[0.3em] text-xl relative group overflow-hidden"
                    >
                      <span className="relative z-10 text-glow">ENTER THE VOYAGE</span>
                      <div className="absolute inset-0 bg-[#d4af37]/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                      <div className="absolute inset-0 box-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </motion.button>
                    
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      transition={{ delay: 2.5 }}
                      className="mt-4 text-[#d4af37] text-xs tracking-widest font-cinzel uppercase"
                    >
                      {typeof window !== 'undefined' && 'ontouchstart' in window ? 'Slide to Navigate' : 'Move Cursor to Navigate'}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* STAGE 4: MAIN HOMEPAGE */}
        {stage === "main" && (
          <motion.div
            key="main"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 z-20 overflow-y-auto overflow-x-hidden scroll-smooth"
          >
            <div 
              className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
              style={{ backgroundImage: `url(${mainBg})` }}
            />
            <div className="fixed inset-0 bg-black/60 -z-10 backdrop-blur-[2px]" />
            <div className="fixed inset-0 bg-gradient-to-b from-transparent via-black/40 to-black -z-10" />

            {/* Navigation */}
            <motion.nav 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="w-full p-6 flex justify-between items-center relative z-20 border-b border-[#d4af37]/20 bg-black/30 backdrop-blur-sm"
            >
              <div className="font-pirata text-3xl text-[#d4af37] text-glow">VDV</div>
              <div className="hidden md:flex gap-8 font-cinzel text-sm tracking-widest text-white/70">
                {['EVENTS', 'CREW', 'TICKETS', 'LEGEND'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-[#d4af37] hover:text-glow transition-all duration-300">
                    {item}
                  </a>
                ))}
              </div>
              <button className="md:hidden text-[#d4af37]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12h18M3 6h18M3 18h18"/>
                </svg>
              </button>
            </motion.nav>

            {/* Hero Section */}
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1.5 }}
              >
                <h2 className="font-cinzel-decorative text-xl md:text-3xl text-[#d4af37] mb-4 tracking-[0.3em]">
                  THE CULTURAL FESTIVAL OF
                </h2>
                <h1 className="font-pirata text-7xl md:text-9xl text-white drop-shadow-[0_0_30px_rgba(212,175,55,0.4)] mb-8">
                  VAUDEVILLE
                </h1>
                <p className="font-cinzel text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-12">
                  Where legends are forged and myths come to life. Embark on a voyage of artistry, music, and untamed chaos.
                </p>
                <button className="px-10 py-5 bg-[#d4af37]/10 border border-[#d4af37] text-[#d4af37] font-cinzel font-bold tracking-widest hover:bg-[#d4af37] hover:text-black transition-all duration-500 box-glow">
                  UNFOLD THE MAP
                </button>
              </motion.div>
            </div>

            {/* Sample Content Section */}
            <div className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="space-y-6"
                >
                  <h3 className="font-cinzel-decorative text-4xl text-[#d4af37]">THE CAPTAIN'S CALL</h3>
                  <div className="w-24 h-1 bg-[#d4af37]/50" />
                  <p className="font-cinzel text-white/70 leading-loose text-lg">
                    The winds have shifted, and the tides bring tales of a gathering unlike any other. Vaudeville is not merely a festival; it is a test of mettle, a showcase of the extraordinary, and a haven for the bold.
                  </p>
                  <p className="font-cinzel text-white/70 leading-loose text-lg">
                    Gather your crew, hoist your colors, and prepare for days of relentless competition and nights of thunderous celebration.
                  </p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="relative aspect-square border border-[#d4af37]/30 p-4"
                >
                  <div className="w-full h-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-[#d4af37]/10">
                    <img src={compassImg} alt="Compass" className="w-1/2 opacity-30 animate-[spin_60s_linear_infinite]" />
                  </div>
                  {/* Decorative corners */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#d4af37]" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#d4af37]" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#d4af37]" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#d4af37]" />
                </motion.div>
              </div>
            </div>
            
            {/* Footer space to allow scrolling */}
            <footer className="py-12 border-t border-[#d4af37]/20 text-center font-cinzel text-white/50 text-sm">
              <p>© 2026 VAUDEVILLE. ALL RIGHTS RESERVED TO THE SEA.</p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
