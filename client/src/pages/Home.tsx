import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence, useTransform, useScroll } from "framer-motion";
import StoryScene from "@/components/3d/StoryScene";
import PirateNavbar from "@/components/layout/Navbar";
import HeroScene from "@/scenes/HeroScene";
import VoyageSection from "@/components/VoyageSection";
import Preloader from "@/components/home/Preloader";
import CompassSection from "@/components/home/CompassSection";
import EventDialog, { DashboardEvent } from "@/components/home/EventDialog";

import aboutImg from "@/assets/images/05.webp";
import eventsImg from "@/assets/images/06.webp";
import timelineImg from "@/assets/images/07.webp";
import sponsorsImg from "@/assets/images/08.webp";
import merchImg from "@/assets/images/09.webp";
import coreImg from "@/assets/images/10.webp";

export type Stage = "loading" | "compass" | "activating" | "revealing" | "main";

const EVENTS = [
  { id: 1, name: "Treasure Hunt", chapter: "Chapter I", description: "Solve riddles to find the hidden chest.", x: "20%", y: "20%" },
  { id: 2, name: "Sea Battle", chapter: "Chapter II", description: "Naval strategy game with miniature ships.", x: "40%", y: "50%" },
  { id: 3, name: "Pirate Ball", chapter: "Chapter III", description: "A night of music and rum-inspired drinks.", x: "70%", y: "30%" },
  { id: 4, name: "The Black Spot", chapter: "Chapter IV", description: "Elite coding competition for the bold.", x: "85%", y: "75%" },
];

export default function Home() {
  const [, navigate] = useLocation();
  const [stage, setStage] = useState<Stage>(() => {
    return sessionStorage.getItem("hasSeenIntro") === "true" ? "main" : "loading";
  });
  const [progress, setProgress] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<DashboardEvent | null>(null);

  const { scrollYProgress } = useScroll();

  useEffect(() => {
    if (stage !== "loading") return;

    const duration = 5000;
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
    setStage("activating");

    setTimeout(() => {
      setStage("revealing");
    }, 700);

    setTimeout(() => {
      setStage("main");
      sessionStorage.setItem("hasSeenIntro", "true");
    }, 1700);
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-black">

      <div className="absolute inset-0 z-50 pointer-events-none bg-noise" />

      <AnimatePresence mode="wait">

        {/* ---------------- PRELOADER ---------------- */}
        {stage === "loading" && <Preloader progress={progress} />}

        {/* ---------------- COMPASS ---------------- */}
        {(stage === "compass" || stage === "activating" || stage === "revealing") && (
          <CompassSection stage={stage} handleEnter={handleEnter} />
        )}

        {/* ---------------- MAIN ---------------- */}
        {stage === "main" && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-20 bg-transparent"
          >

            {/* 3D SCENE BACKGROUND */}
            <StoryScene scrollYProgress={scrollYProgress} />

            {/* NAVBAR ONLY IN MAIN */}
            <PirateNavbar />

            <div className="snap-y snap-mandatory relative z-10 w-full">

              <HeroScene />

              <VoyageSection
                image={aboutImg}
                title="About Vaudeville"
                subtitle="Discover the legend"
                link="/about"
              />

              <VoyageSection
                image={eventsImg}
                title="Events"
                subtitle="Where adventure begins"
                link="/events"
              />

              <VoyageSection
                image={timelineImg}
                title="Timeline"
                subtitle="The chronicles unfold"
                link="/timeline"
              />

              <VoyageSection
                image={sponsorsImg}
                title="Sponsors"
                subtitle="Our allies at sea"
                link="/sponsors"
              />

              <VoyageSection
                image={merchImg}
                title="Merch"
                subtitle="Wear the legend"
                link="/merch"
              />

              <VoyageSection
                image={coreImg}
                title="Core Crew"
                subtitle="Meet the captains"
                link="/core"
              />

            </div>

            {/* DIALOG */}
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
