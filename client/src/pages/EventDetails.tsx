import { useRoute, Link } from "wouter"
import PiratePageLayout from "@/components/layout/PiratePageLayout"
import { events } from "@/data/eventsData"

export default function EventDetails() {

const [match, params] = useRoute("/events/:slug")

const event = events.find(e => e.slug === params?.slug)

if (!event) {
return <div className="text-white p-20">Event not found</div>
}

return (

<PiratePageLayout title={event.title}>

<p className="font-cinzel text-lg text-gray-300 mb-10">
{event.description}
</p>

<div className="bg-black/40 border border-[#d4af37]/40 p-8 rounded-lg">

<h3 className="font-pirata text-3xl text-[#d4af37] mb-4">
Rules
</h3>

<ul className="space-y-2 text-gray-300 font-cinzel">

{event.rules.map((rule, index) => (
<li key={index}>• {rule}</li>
))}

</ul>

<div className="mt-8 grid md:grid-cols-2 gap-6">

<div>

<h4 className="font-pirata text-xl text-[#d4af37]">
Team Size
</h4>

<p className="font-cinzel text-gray-300">
{event.teamSize}
</p>

</div>

<div>

<h4 className="font-pirata text-xl text-[#d4af37]">
Prize Pool
</h4>

<p className="font-cinzel text-gray-300">
{event.prize}
</p>

</div>

</div>

<Link
href={`/register/${event.slug}`}
className="inline-block mt-10 px-6 py-3 border border-[#d4af37] text-[#d4af37] font-cinzel hover:bg-[#d4af37] hover:text-black transition"
>

Register Now

</Link>

</div>

</PiratePageLayout>
)
}