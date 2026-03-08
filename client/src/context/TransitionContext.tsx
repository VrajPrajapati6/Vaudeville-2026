import { createContext, useContext, useState, ReactNode } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import wheelImage from "@/assets/images/wheel.png";

interface TransitionContextType {
  navigateWithTransition: (url: string) => void;
}

const TransitionContext = createContext<TransitionContextType>({
  navigateWithTransition: () => {},
});

export function useTransition() {
  return useContext(TransitionContext);
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigateWithTransition = (url: string) => {
    // If we're already transitioning, ignore another click
    if (isTransitioning) return;
    
    // Start fade in of transition screen
    setIsTransitioning(true);
    
    // Halfway through the animation, change the route and scroll
    setTimeout(() => {
      setLocation(url);
      window.scrollTo(0, 0);
      
      // Keep the loading screen a bit longer so the new page renders, then fade out
      setTimeout(() => {
        setIsTransitioning(false);
      }, 400);
      
    }, 600);
  };

  return (
    <TransitionContext.Provider value={{ navigateWithTransition }}>
      {children}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="page-transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
          >
            {/* Dark overlay with noise for a pirate feel */}
            <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay pointer-events-none" />
            
            <motion.img
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              src={wheelImage}
              alt="Loading..."
              className="w-32 h-32 md:w-40 md:h-40 opacity-90 drop-shadow-[0_0_20px_rgba(212,175,55,0.7)]"
            />
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mt-8 font-pirata text-3xl md:text-4xl text-[#d4af37] tracking-[0.2em] drop-shadow-md"
            >
              Navigating Captain...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}
