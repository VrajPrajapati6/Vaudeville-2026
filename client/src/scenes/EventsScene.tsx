import { motion } from "framer-motion";
import img1 from "@/assets/images/16.webp"; // dramatic ship
import img2 from "@/assets/images/13.webp";
import img3 from "@/assets/images/14.webp";
import img4 from "@/assets/images/15.webp";

const EVENTS = [
  {
    name: "Treasure Hunt",
    desc: "Decode. Discover. Dominate.",
    img: img1,
  },
  {
    name: "Sea Battle",
    desc: "Strategy decides the victor.",
    img: img2,
  },
  {
    name: "Pirate Ball",
    desc: "Where legends gather.",
    img: img3,
  },
  {
    name: "The Black Spot",
    desc: "Only the bold survive.",
    img: img4,
  },
];

export default function EventsScene() {
  return (
    <section className="relative min-h-screen bg-[#0a0f16] py-24 px-6 snap-start">

      {/* Section Header */}
      <div className="text-center mb-16">
        <p className="font-cinzel text-xs uppercase tracking-[0.4em] text-[#d4af37]/70 mb-4">
          Chapter II
        </p>

        <h2 className="font-pirata text-4xl sm:text-6xl text-white">
          The Battles Begin
        </h2>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

        {EVENTS.map((event, index) => (
          <motion.div
            key={event.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.15 }}
            viewport={{ once: true }}
            className="relative h-[350px] rounded-xl overflow-hidden group"
          >
            {/* Background */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${event.img})` }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/70 group-hover:bg-black/60 transition-all duration-500" />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end p-6">
              <h3 className="font-pirata text-3xl text-[#d4af37]">
                {event.name}
              </h3>

              <p className="mt-2 text-sm text-white/70 font-cinzel">
                {event.desc}
              </p>

              <button className="mt-6 px-6 py-3 border border-[#d4af37] text-[#d4af37] font-cinzel text-xs tracking-widest hover:bg-[#d4af37]/10 transition-all duration-300">
                REGISTER
              </button>
            </div>

          </motion.div>
        ))}

      </div>

    </section>
  );
}