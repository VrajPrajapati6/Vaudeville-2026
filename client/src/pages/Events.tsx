import PiratePageLayout from "@/components/layout/PiratePageLayout"
import { events } from "@/data/eventsData"
import { useLocation } from "wouter"

export default function Events() {

const [, navigate] = useLocation()

return (

<PiratePageLayout title="Events">

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

{events.map((event) => (
<div
  key={event.slug}
  className="
  group
  bg-black/50
  border border-[#d4af37]/40
  p-8
  rounded-xl
  transition-all
  duration-300
  hover:scale-105
  hover:border-[#d4af37]
  hover:shadow-[0_0_25px_rgba(212,175,55,0.3)]
"
>

  <h3 className="font-pirata text-3xl text-[#d4af37] mb-4">
    {event.title}
  </h3>

  <p className="text-gray-300 font-cinzel leading-relaxed">
    {event.desc}
  </p>

  <button
    onClick={() => navigate(`/events/${event.slug}`)}
    className="
    mt-8
    px-5
    py-2
    border
    border-[#d4af37]
    text-[#d4af37]
    font-cinzel
    tracking-wider
    transition-all
    duration-300
    hover:bg-[#d4af37]
    hover:text-black
  "
  >
    View Details
  </button>

</div>

))}

</div>

</PiratePageLayout>
)
}