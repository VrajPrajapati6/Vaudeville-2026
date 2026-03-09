import PiratePageLayout from "@/components/layout/PiratePageLayout";
import { motion } from "framer-motion";
import bg08 from "@/assets/images/08.webp";

export default function About() {
  return (
    <PiratePageLayout title="About Vaudeville" bgImage={bg08}>
      {/* About Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-cinzel text-base md:text-lg leading-relaxed text-gray-300 space-y-6"
      >
        <p>
          Vaudeville is the annual cultural and technical festival of the Institute of Technology at Nirma University. It celebrates creativity, innovation, and talent through a vibrant mix of competitions, workshops, and performances.
        </p>

        <p>
          Inspired by the adventurous spirit of Pirates of the Caribbean, this year's Vaudeville invites participants to embark on a thrilling journey of exploration and discovery. Like a crew sailing toward hidden treasure, students come together to showcase their skills, collaborate, and create unforgettable experiences.
        </p>

        <p>
          For a few electrifying days, Vaudeville transforms the campus into a harbor of ideas, excitement, and adventure.
        </p>
      </motion.div>

    </PiratePageLayout>
  );
}