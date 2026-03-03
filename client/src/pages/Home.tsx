import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform, useScroll, useMotionValue } from "framer-motion";
import loadingBg from "@/assets/images/loading-bg.png";
import compassBg from "@/assets/images/compass-bg.png";
import compassImg from "@/assets/images/compass.png";
import mainBg from "@/assets/images/main-bg.png";
import pirateMap from "@/assets/images/pirate-map.png";
import preloaderShip from "@/assets/images/preloader-ship.png";
import parchmentImg from "@/assets/images/parchment.png";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type Stage = "loading" | "compass" | "transition" | "main";

const EVENTS = [
  { id: 1, name: "Treasure Hunt", chapter: "Chapter I", description: "Solve riddles to find the hidden chest.", x: "20%", y: "20%" },
  { id: 2, name: "Sea Battle", chapter: "Chapter II", description: "Naval strategy game with miniature ships.", x: "40%", y: "50%" },
  { id: 3, name: "Pirate Ball", chapter: "Chapter III", description: "A night of music and rum-inspired drinks.", x: "70%", y: "30%" },
  { id: 4, name: "The Black Spot", chapter: "Chapter IV", description: "Elite coding competition for the bold.", x: "85%", y: "75%" },
];

export default function Home() {
  const [stage, setStage] = useState<Stage>("loading");
  const [progress, setProgress] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<typeof EVENTS[0] | null>(null);
  const compassRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  const indicatorX = useTransform(scrollYProgress, [0, 1], ["10%", "90%"]);
  const indicatorY = useTransform(scrollYProgress, [0, 1], ["10%", "80%"]);
  
  // Parallax layers
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const yFog = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const shipScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.2]);

  // Mouse/Touch tracking for compass rotation
  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });
  
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);
  
  const [compassRotation, setCompassRotation] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (stage !== "compass") return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const x = clientX - innerWidth / 2;
      const y = clientY - innerHeight / 2;
      
      mouseX.set(x);
      mouseY.set(y);

      const angle = Math.atan2(y, x) * (180 / Math.PI);
      setCompassRotation(angle);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [stage]);

  // Premium Preloader Logic
  useEffect(() => {
    if (stage !== "loading") return;

    const duration = 3000;
    const interval = 30;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setStage("compass"), 500);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
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
        {/* STAGE 1: CINEMATIC PRELOADER */}
        {stage === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
            className="absolute inset-0 flex flex-col items-center justify-center z-40 bg-[#0b0f1a]"
          >
            {/* Fog Layers */}
            <div className="absolute inset-0 opacity-40 bg-noise mix-blend-overlay pointer-events-none" />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0f1a]/50 to-[#0b0f1a]"
              animate={{ opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            {/* Approaching Ship */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, z: -500 }}
              animate={{ 
                scale: 0.5 + (progress / 100) * 0.5, 
                opacity: progress > 10 ? 1 : 0,
                z: 0 
              }}
              className="relative mb-12"
            >
              <img src={preloaderShip} alt="Ship" className="w-[300px] md:w-[500px] drop-shadow-[0_0_50px_rgba(0,0,0,0.8)]" />
            </motion.div>
            
            <div className="relative z-10 flex flex-col items-center">
              <motion.h1 
                className="font-pirata text-6xl md:text-8xl text-glow text-[#d4af37]"
                animate={{ letterSpacing: ["0.1em", "0.2em", "0.1em"] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                VAUDEVILLE
              </motion.h1>
              <p className="font-cinzel text-[#d4af37]/60 text-xs tracking-[0.5em] mt-2 uppercase">Preparing the Voyage...</p>
              
              <div className="mt-8 flex flex-col items-center">
                <span className="font-pirata text-2xl text-[#d4af37] mb-2">{Math.round(progress)}%</span>
                <div className="w-48 h-[2px] bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-[#d4af37] shadow-[0_0_15px_#d4af37]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
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
                className="relative w-[320px] h-[320px] md:w-[650px] md:h-[650px] cursor-none"
              >
                {/* Glowing aura behind compass */}
                <motion.div 
                  className="absolute inset-0 rounded-full bg-[#d4af37]/15 blur-3xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Compass Body */}
                <motion.img 
                  src={compassImg} 
                  alt="Navigational Compass" 
                  style={{ rotate: compassRotation }}
                  className="w-full h-full object-contain drop-shadow-[0_0_60px_rgba(212,175,55,0.5)]"
                />
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
                      className="mt-12 group relative"
                    >
                      {/* Rope Border Animation Effect */}
                      <div className="absolute -inset-4 border-2 border-[#d4af37]/20 rounded-full border-dashed animate-[spin_10s_linear_infinite]" />
                      
                      <div className="px-10 py-5 bg-black/60 backdrop-blur-xl border border-[#d4af37]/50 text-[#d4af37] font-cinzel font-bold tracking-[0.3em] text-xl relative overflow-hidden rounded-full shadow-2xl hover:scale-110 transition-transform duration-500">
                        <span className="relative z-10 text-glow">ENTER THE VOYAGE</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <div className="absolute inset-0 box-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
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

        {/* STAGE 4: MAIN HOMEPAGE WITH MAP */}
        {stage === "main" && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 overflow-y-auto bg-[#0a0a0a]"
          >
            {/* Navigation */}
            <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 border-b border-[#d4af37]/20 bg-black/80 backdrop-blur-md">
              <div className="font-pirata text-3xl text-[#d4af37] text-glow">VAUDEVILLE</div>
              <div className="flex gap-8 font-cinzel text-sm tracking-widest text-white/70">
                <button className="hover:text-[#d4af37] transition-colors">VOYAGE</button>
                <button className="hover:text-[#d4af37] transition-colors">EVENTS</button>
              </div>
            </nav>

            <div className="h-[400vh] relative w-full pt-24">
              {/* Depth Layering System */}
              <motion.div style={{ y: yBg }} className="fixed inset-0 -z-10 bg-gradient-to-b from-[#0b0f1a] to-black" />
              <motion.div style={{ y: yFog }} className="fixed inset-0 -z-10 opacity-30 bg-noise pointer-events-none" />
              
              <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                {/* Parallax Hero Element (Ship) */}
                <motion.div 
                  style={{ scale: shipScale }}
                  className="absolute bottom-20 opacity-20 pointer-events-none"
                >
                   <img src={preloaderShip} alt="Background Ship" className="w-[800px] grayscale blur-sm" />
                </motion.div>

                <motion.div 
                  className="relative w-[95%] h-[85%] border-[12px] border-[#2a1a0a] shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-sm overflow-hidden"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.5 }}
                >
                  <img src={pirateMap} alt="Pirate Map" className="w-full h-full object-cover opacity-90 scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  
                  {/* The Path Indicator */}
                  <motion.div 
                    style={{ left: indicatorX, top: indicatorY }}
                    className="absolute w-12 h-12 -ml-6 -mt-6 z-40"
                  >
                    <div className="w-full h-full bg-[#d4af37] rounded-full shadow-[0_0_30px_#d4af37] animate-pulse" />
                    <div className="absolute inset-0 border-4 border-white/50 rounded-full animate-ping" />
                  </motion.div>

                  {/* Events on Map with Premium Cards */}
                  {EVENTS.map((event, idx) => (
                    <motion.div
                      key={event.id}
                      className="absolute z-30 flex flex-col items-center"
                      style={{ left: event.x, top: event.y }}
                      initial={{ opacity: 0.3, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1.2 }}
                      viewport={{ margin: "-100px" }}
                    >
                      <button 
                        onClick={() => setSelectedEvent(event)}
                        className="group relative"
                      >
                        <p className="absolute -top-10 left-1/2 -translate-x-1/2 font-pirata text-[#d4af37] text-xs tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                          {event.chapter}
                        </p>
                        <div className="w-16 h-16 bg-[#1a120a] border-4 border-[#d4af37] rotate-45 flex items-center justify-center hover:bg-[#d4af37] hover:scale-110 transition-all duration-500 shadow-2xl">
                          <span className="font-pirata text-[#d4af37] group-hover:text-black -rotate-45 text-2xl">{idx + 1}</span>
                        </div>
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap font-cinzel text-white text-sm font-bold tracking-widest group-hover:text-[#d4af37] transition-colors">
                          {event.name}
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Event Registration Dialog - Parchment Style */}
            <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
              <DialogContent className="max-w-2xl bg-transparent border-none p-0 overflow-hidden">
                <motion.div 
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  className="relative p-12 min-h-[500px] flex flex-col"
                  style={{ 
                    backgroundImage: `url(${parchmentImg})`,
                    backgroundSize: 'cover',
                    boxShadow: '0 0 50px rgba(0,0,0,0.5)'
                  }}
                >
                  <DialogHeader>
                    <p className="font-cinzel text-xs text-black/50 tracking-[0.3em] uppercase mb-2">{selectedEvent?.chapter}</p>
                    <DialogTitle className="font-pirata text-6xl text-[#2a1a0a] border-b-2 border-black/10 pb-4">
                      {selectedEvent?.name}
                    </DialogTitle>
                    <DialogDescription className="text-[#2a1a0a]/80 font-cinzel text-lg italic mt-4 leading-relaxed">
                      "{selectedEvent?.description}"
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="mt-8 space-y-6 flex-grow">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-black/60">Signature of the Bold</label>
                      <input className="w-full bg-transparent border-b-2 border-black/20 p-2 text-[#2a1a0a] font-cinzel italic focus:border-black outline-none placeholder:text-black/20" placeholder="Your name here..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-black/60">Origin of the Vessel</label>
                      <input className="w-full bg-transparent border-b-2 border-black/20 p-2 text-[#2a1a0a] font-cinzel italic focus:border-black outline-none placeholder:text-black/20" placeholder="Your college or crew..." />
                    </div>
                  </div>

                  <button className="mt-12 w-full py-5 bg-[#2a1a0a] text-[#d4af37] font-pirata text-3xl tracking-widest hover:bg-black transition-all shadow-xl">
                    SEAL THE COMPACT
                  </button>
                </motion.div>
              </DialogContent>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
