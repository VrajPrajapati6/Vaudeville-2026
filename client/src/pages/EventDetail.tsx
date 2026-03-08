import PiratePageLayout from "@/components/layout/PiratePageLayout";
import { events } from "@/data/eventsData";
import { useRoute, useLocation } from "wouter";

export default function EventDetail() {

  const [match, params] = useRoute("/events/:slug");
  const [, navigate] = useLocation();

  const event = events.find((e) => e.slug === params?.slug);

  if (!event) {
    return <div className="text-white p-20">Event not found</div>;
  }

  return (
    <PiratePageLayout title={event.title}>

      {/* HERO SECTION */}

      <div className="relative w-full h-[45vh] overflow-hidden rounded-xl border border-[#d4af37]/30">

        <img
          src={event.image}
          className="w-full h-full object-cover opacity-70"
        />

        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">

          <h1 className="font-pirata text-5xl md:text-7xl text-[#d4af37] tracking-wider text-center">
            {event.title}
          </h1>

        </div>

      </div>


      {/* MAIN CONTENT */}

      <div className="max-w-5xl mx-auto mt-14 space-y-12">

        {/* DESCRIPTION */}

        <div>

          <h2 className="font-cinzel text-lg text-[#d4af37] uppercase tracking-widest">
            About the Event
          </h2>

          <p className="mt-4 text-gray-300 font-cinzel leading-relaxed">
            {event.description}
          </p>

        </div>


        {/* EVENT DETAILS */}

        <div className="grid md:grid-cols-2 gap-6 border border-[#d4af37]/20 p-8 rounded-xl bg-black/40">

          <p className="font-cinzel text-gray-300">
            <span className="text-[#d4af37]">Team Size:</span> {event.teamSize}
          </p>

          <p className="font-cinzel text-gray-300">
            <span className="text-[#d4af37]">Event Name:</span> {event.title}
          </p>

        </div>

        {/* RULES */}

        <div>
          <h2 className="font-cinzel text-lg text-[#d4af37] uppercase tracking-widest">
            Rules
          </h2>
          <ul className="mt-4 space-y-2 text-gray-300 font-cinzel">
            {event.rules.map((rule, index) => (
              <li key={index}>• {rule}</li>
            ))}
          </ul>
        </div>


        {/* REGISTER BUTTON */}

        <div className="flex justify-center">

          <button
            onClick={() => navigate(`/register/${event.slug}`)}
            className="
            px-10
            py-4
            bg-[#d4af37]
            text-black
            font-cinzel
            tracking-widest
            text-lg
            hover:bg-yellow-500
            transition
            "
          >
            REGISTER NOW
          </button>

        </div>

      </div>

    </PiratePageLayout>
  );
}