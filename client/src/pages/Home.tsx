import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform, useScroll } from "framer-motion";
import loadingBg from "@/assets/images/loading-bg.png";
import compassBg from "@/assets/images/compass-bg.png";
import compassImg from "@/assets/images/compass.png";
import mainBg from "@/assets/images/main-bg.png";
import pirateMap from "@/assets/images/pirate-map.png";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type Stage = "loading" | "compass" | "transition" | "main";

const EVENTS = [
  { id: 1, name: "Treasure Hunt", description: "Solve riddles to find the hidden chest.", x: "20%", y: "20%" },
  { id: 2, name: "Sea Battle", description: "Naval strategy game with miniature ships.", x: "40%", y: "50%" },
  { id: 3, name: "Pirate Ball", description: "A night of music and rum-inspired drinks.", x: "70%", y: "30%" },
  { id: 4, name: "The Black Spot", description: "Elite coding competition for the bold.", x: "85%", y: "75%" },
];

export default function Home() {
  const [stage, setStage] = useState<Stage>("loading");
  const [progress, setProgress] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<typeof EVENTS[0] | null>(null);
  const compassRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  const indicatorX = useTransform(scrollYProgress, [0, 1], ["10%", "90%"]);
  const indicatorY = useTransform(scrollYProgress, [0, 1], ["10%", "80%"]);

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

    const handleTouchMove = (e: TouchEvent) => {
      if (stage !== "compass") return;
      const touch = e.touches[0];
      const { clientY, clientX } = touch;
      const { innerHeight, innerWidth } = window;
      
      const x = clientX - innerWidth / 2;
      const y = clientY - innerHeight / 2;
      const angle = Math.atan2(y, x) * (180 / Math.PI);
      setCompassRotation(angle);
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
              <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                <motion.div 
                  className="relative w-[95%] h-[85%] border-8 border-[#2a1a0a] shadow-2xl rounded-sm overflow-hidden"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.5 }}
                >
                  <img src={pirateMap} alt="Pirate Map" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-black/20" />
                  
                  {/* The Path Indicator */}
                  <motion.div 
                    style={{ left: indicatorX, top: indicatorY }}
                    className="absolute w-8 h-8 -ml-4 -mt-4 z-40"
                  >
                    <div className="w-full h-full bg-[#d4af37] rounded-full shadow-[0_0_20px_#d4af37] animate-pulse" />
                    <div className="absolute inset-0 border-2 border-white rounded-full animate-ping" />
                  </motion.div>

                  {/* Events on Map */}
                  {EVENTS.map((event, idx) => {
                    const threshold = idx / (EVENTS.length - 1);
                    return (
                      <motion.div
                        key={event.id}
                        className="absolute z-30 flex flex-col items-center"
                        style={{ left: event.x, top: event.y }}
                        initial={{ opacity: 0.3, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1.2 }}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <button className="group relative">
                          <div className="w-12 h-12 bg-[#2a1a0a] border-2 border-[#d4af37] rotate-45 flex items-center justify-center hover:bg-[#d4af37] transition-colors duration-300">
                            <span className="font-pirata text-[#d4af37] group-hover:text-black -rotate-45 text-xl">{idx + 1}</span>
                          </div>
                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap font-cinzel text-[#d4af37] text-sm font-bold tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                            {event.name}
                          </div>
                        </button>
                      </motion.div>
                    );
                  })}

                  {/* Connecting Line (simplified path) */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                    <path 
                      d="M 10,10 Q 30,20 40,50 T 70,30 T 85,75" 
                      fill="none" 
                      stroke="#d4af37" 
                      strokeWidth="4" 
                      strokeDasharray="10,10"
                      className="path-draw"
                      style={{ pathLength: scrollYProgress }}
                    />
                  </svg>
                </motion.div>
              </div>

              {/* Scroll cues */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#d4af37] font-cinzel animate-bounce tracking-widest text-xs">
                SCROLL TO NAVIGATE THE SEAS
              </div>
            </div>

            {/* Event Registration Dialog */}
            <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
              <DialogContent className="bg-[#1a120a] border-[#d4af37] text-[#d4af37] font-cinzel">
                <DialogHeader>
                  <DialogTitle className="font-pirata text-4xl">{selectedEvent?.name}</DialogTitle>
                  <DialogDescription className="text-white/70 italic">
                    {selectedEvent?.description}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest">Sailor Name</label>
                    <input className="w-full bg-black/50 border border-[#d4af37]/30 p-3 text-white focus:border-[#d4af37] outline-none" placeholder="Enter name..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest">Vessel (College)</label>
                    <input className="w-full bg-black/50 border border-[#d4af37]/30 p-3 text-white focus:border-[#d4af37] outline-none" placeholder="Enter college..." />
                  </div>
                  <button className="w-full py-4 bg-[#d4af37] text-black font-bold tracking-widest hover:brightness-125 transition-all">
                    JOIN THE CREW
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
