import { useLocation } from "wouter";
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


      <p className="font-cinzel text-lg leading-relaxed text-gray-300">
        Vaudeville is the annual cultural and technical festival of the
        Electronics & Instrumentation Department at Nirma University.

        The event brings together creativity, innovation, and competition
        through various events, workshops, and performances.

        Each year Vaudeville transforms the campus into an arena of
        exploration, collaboration, and discovery.
      </p>


      
      {/* Back Button */}
      <button
        onClick={goBackToHero}
        className="mb-8 px-5 py-2 border border-[#d4af37] text-[#d4af37] font-cinzel tracking-wider hover:bg-[#d4af37]/10 transition-all duration-300 rounded-md"
      >
        ← Back 
        to Voyage
      </button>

    </PiratePageLayout>
  );
}