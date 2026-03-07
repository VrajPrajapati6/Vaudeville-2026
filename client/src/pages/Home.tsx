import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

import PirateNavbar from "@/components/layout/Navbar";
import HeroScene from "@/scenes/HeroScene";
import Preloader from "@/components/home/Preloader";
import CompassSection from "@/components/home/CompassSection";
import EventDialog, { DashboardEvent } from "@/components/home/EventDialog";
import Footer from "@/components/layout/Footer";

import mapImg from "@/assets/images/parchment.png";

export type Stage = "loading" | "compass" | "activating" | "revealing" | "main";

const STOPS = [
  { title: "About Vaudeville", subtitle: "Discover the legend", link: "/about", align: "left", trigger: 0.12 },
  { title: "Events", subtitle: "Where adventure begins", link: "/events", align: "right", trigger: 0.28 },
  { title: "Timeline", subtitle: "The chronicles unfold", link: "/timeline", align: "left", trigger: 0.45 },
  { title: "Sponsors", subtitle: "Our allies at sea", link: "/sponsors", align: "right", trigger: 0.58 },
  { title: "Merch", subtitle: "Wear the legend", link: "/merch", align: "left", trigger: 0.70 },
  { title: "Core Crew", subtitle: "Meet the captains", link: "/core", align: "right", trigger: 0.82 },
];

export default function Home() {
  const [, navigate] = useLocation();

  const [stage, setStage] = useState<Stage>(() => {
    if (sessionStorage.getItem("is_reloading") === "true") {
      sessionStorage.removeItem("is_reloading");
      sessionStorage.removeItem("visited");
    }

    if (sessionStorage.getItem("visited") === "true") return "main";

    return "loading";
  });

  const [progress, setProgress] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<DashboardEvent | null>(null);

  const { scrollYProgress } = useScroll();
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem("is_reloading", "true");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    if (stage !== "loading") return;

    const duration = 5000;
    const interval = 30;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);

          setTimeout(() => {
            setStage("compass");
            sessionStorage.setItem("visited", "true");
          }, 500);

          return 100;
        }

        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [stage]);

  const handleEnter = () => {
    setStage("activating");

    setTimeout(() => {
      setStage("revealing");
    }, 600);

    setTimeout(() => {
      window.scrollTo(0, 0);
      setStage("main");
    }, 1600);
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-black">

      <div className="absolute inset-0 z-50 pointer-events-none bg-noise" />

      <AnimatePresence mode="wait">

        {stage === "loading" && (
          <motion.div key="loading" exit={{ opacity: 0, transition: { duration: 0.5 } }}>
            <Preloader progress={progress} />
          </motion.div>
        )}

        {(stage === "compass" || stage === "activating" || stage === "revealing") && (
          <motion.div key="compass" exit={{ opacity: 0, transition: { duration: 0.5 } }}>
            <CompassSection stage={stage} handleEnter={handleEnter} />
          </motion.div>
        )}

        {stage === "main" && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-20"
          >

            <PirateNavbar />

            <HeroScene />

            <section className="relative w-full py-[300px]">

              <img
                src={mapImg}
                className="absolute inset-0 w-full h-full object-cover opacity-90"
                alt="map"
              />

              <svg
                viewBox="0 0 1000 2000"
                className="absolute left-0 top-0 w-full h-full pointer-events-none"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="
                  M500 50
                  Q200 300 500 500
                  Q800 700 500 900
                  Q200 1100 500 1300
                  Q800 1500 500 1700
                  Q200 1850 500 1950
                  "
                  stroke="#5b3a1a"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="15 15"
                  style={{ pathLength }}
                />
              </svg>

              <div className="relative z-10 flex flex-col gap-40 sm:gap-64 max-w-6xl mx-auto">

                {STOPS.map((stop, i) => {

                  const opacity = useTransform(
                    scrollYProgress,
                    [stop.trigger - 0.02, stop.trigger + 0.03],
                    [0, 1]
                  );

                  const y = useTransform(
                    scrollYProgress,
                    [stop.trigger - 0.02, stop.trigger + 0.03],
                    [60, 0]
                  );

                  return (
                    <motion.div
                      key={i}
                      className={`flex w-full`}
                      style={{ opacity, y }}
                    >
                      <div className={`w-1/2 flex ${stop.align === "left" ? "justify-end pr-4 sm:pr-8 md:pr-12 lg:pr-16" : "justify-start pl-4 sm:pl-8 md:pl-12 lg:pl-16 ml-auto"}`}>
                        <div className="bg-black/70 backdrop-blur-md border border-amber-400 shadow-xl rounded-xl p-3 sm:p-4 md:p-6 w-[140px] sm:w-[200px] md:w-[280px] text-center shrink-0">
                          
                          <h2 className="text-base sm:text-xl md:text-2xl text-amber-300 font-bold mb-1 md:mb-2 leading-tight">
                            {stop.title}
                          </h2>

                          <p className="text-gray-300 text-[10px] sm:text-xs md:text-sm mb-2 md:mb-4 leading-snug">
                            {stop.subtitle}
                          </p>

                          <button
                            onClick={() => navigate(stop.link)}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2 border border-amber-400 text-amber-300 rounded hover:bg-amber-400 hover:text-black transition text-xs sm:text-sm md:text-base cursor-pointer"
                          >
                            Explore
                          </button>

                        </div>
                      </div>
                    </motion.div>
                  );
                })}

              </div>

            </section>

            <Footer />

            <EventDialog
              selectedEvent={selectedEvent}
              onClose={() => setSelectedEvent(null)}
            />

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}