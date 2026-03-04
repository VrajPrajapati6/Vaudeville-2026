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
className="bg-black/40 border border-[#d4af37]/40 p-6 rounded-lg hover:scale-105 transition duration-300"
>

<h3 className="font-pirata text-3xl text-[#d4af37] mb-3">
{event.title}
</h3>

<p className="text-gray-300 font-cinzel">
{event.desc}
</p>

<button
onClick={() => navigate(`/events/${event.slug}`)}
className="mt-6 px-4 py-2 border border-[#d4af37] text-[#d4af37] font-cinzel hover:bg-[#d4af37] hover:text-black transition"
>
View Details
</button>

</div>

))}

</div>

</PiratePageLayout>
)
}