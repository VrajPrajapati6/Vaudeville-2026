import { useParams } from "react-router-dom";
import { events } from "@/data/events";

export default function EventDetail() {
  const { slug } = useParams();
  const event = events.find((e) => e.slug === slug);

  if (!event) return <div>Event not found</div>;

  return (
    <div className="min-h-screen bg-[#0a0f16] text-white px-6 py-24">

      <h1 className="font-pirata text-5xl text-[#d4af37]">
        {event.title}
      </h1>

      <p className="mt-6 font-cinzel text-white/75">
        {event.description}
      </p>

      <div className="mt-10">
        <h2 className="font-cinzel text-lg text-[#d4af37] uppercase tracking-widest">
          Rules
        </h2>

        <ul className="mt-4 space-y-2 font-cinzel text-white/70">
          {event.rules.map((rule, index) => (
            <li key={index}>• {rule}</li>
          ))}
        </ul>
      </div>

      <div className="mt-10 font-cinzel text-white/75">
        <p>Prize Pool: {event.prize}</p>
        <p>Date: {event.date}</p>
        <p>Venue: {event.venue}</p>
        <p>Coordinator: {event.coordinator}</p>
      </div>

      <button className="mt-10 px-8 py-4 bg-[#d4af37] text-black font-cinzel tracking-widest">
        REGISTER
      </button>

    </div>
  );
}