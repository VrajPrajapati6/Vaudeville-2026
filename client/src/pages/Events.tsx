import { useState, useEffect } from "react";
import PiratePageLayout from "@/components/layout/PiratePageLayout";
import { events } from "@/data/eventsData";
import EventModal from "@/components/events/EventModal";

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PiratePageLayout title="Events">
      {/* Events Grid */}
      <section className="w-full py-4">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {events.map((event) => (
            <div
              key={event.slug}
              className="group cursor-pointer bg-black/50 rounded-xl overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-[#d4af37]/20 hover:border-[#d4af37] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] flex flex-col"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="aspect-square w-full overflow-hidden relative border-b border-[#d4af37]/20">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" />

                {/* Removed Category Tags per user request */}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 transition-opacity duration-500" />
              </div>

              <div className="p-6 relative z-10 flex-1 flex flex-col">
                <h3 className="text-3xl font-pirata text-[#d4af37] mb-3 tracking-wider">{event.title}</h3>
                <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed font-cinzel flex-1">{event.desc}</p>

                <p className="mt-4 text-[#d4af37]/70 font-cinzel text-xs uppercase tracking-widest group-hover:text-[#d4af37] transition-colors">
                  View Details &rarr;
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </PiratePageLayout>
  );
}