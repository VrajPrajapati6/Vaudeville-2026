import PiratePageLayout from "@/components/layout/PiratePageLayout";
import { motion } from "framer-motion";

export default function About() {
  return (
    <PiratePageLayout title="About Vaudeville">

      {/* About Content */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-cinzel text-lg leading-relaxed text-gray-300"
      >

        Vaudeville is the annual cultural and technical festival of the
        Electronics & Instrumentation Department at Nirma University.

        <br /><br />

        The event brings together creativity, innovation, and competition
        through various events, workshops, and performances.

        <br /><br />

        Each year Vaudeville transforms the campus into an arena of
        exploration, collaboration, and discovery.

      </motion.p>

    </PiratePageLayout>
  );
}