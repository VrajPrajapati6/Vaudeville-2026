import { motion } from "framer-motion";

const timeline = [
  {
    day: "Day I",
    date: "20 March 2026",
    title: "The Arrival",
    events: "Opening Ceremony • Treasure Hunt Begins",
    venue: "Central Auditorium",
  },
  {
    day: "Day II",
    date: "21 March 2026",
    title: "The Battles",
    events: "Coding Battles • Strategy Games • Competitions",
    venue: "Lab Complex & Academic Blocks",
  },
  {
    day: "Day III",
    date: "22 March 2026",
    title: "The Conquest",
    events: "Final Showdowns • Cultural Night",
    venue: "Open Amphitheatre",
  },
];

export default function TimelineScene() {
  return (
    <section className="relative min-h-screen bg-[#0a0f16] py-28 px-6 snap-start">

      <div className="max-w-4xl mx-auto">

        {/* Section Header */}
        <div className="mb-20">
          <p className="font-cinzel text-xs uppercase tracking-[0.4em] text-[#d4af37]/70 mb-4">
            Chapter IV
          </p>

          <h2 className="font-pirata text-4xl sm:text-6xl text-white">
            The War Unfolds
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative border-l border-[#d4af37]/30 pl-8 space-y-16">

          {timeline.map((item, index) => (
            <motion.div
              key={item.day}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Dot */}
              <div className="absolute -left-[10px] top-2 w-4 h-4 bg-[#d4af37] rounded-full shadow-[0_0_15px_rgba(212,175,55,0.6)]" />

              {/* Day & Date */}
              <p className="font-cinzel text-xs uppercase tracking-widest text-[#d4af37]/70">
                {item.day} — {item.date}
              </p>

              {/* Title */}
              <h3 className="font-pirata text-3xl text-[#d4af37] mt-3">
                {item.title}
              </h3>

              {/* Events */}
              <p className="mt-3 text-sm text-white/75 font-cinzel">
                {item.events}
              </p>

              {/* Venue */}
              <p className="mt-4 text-sm text-white/60 font-cinzel">
                📍 {item.venue}
              </p>
            </motion.div>
          ))}

        </div>

      </div>

    </section>
  );
}