import PiratePageLayout from "@/components/layout/PiratePageLayout"
import { timeline } from "@/data/timelineData"

export default function Timeline() {

return (

<PiratePageLayout title="Event Timeline">

<p className="font-cinzel text-gray-300 text-center max-w-xl mx-auto mb-16">
Plan your journey through Vaudeville. Explore events across three days of adventure.
</p>

<div className="space-y-16">

{timeline.map((day, index) => (

<div key={index}>

<h2 className="font-pirata text-4xl text-[#d4af37] mb-6 text-center">
{day.day} • {day.date}
</h2>

<div className="space-y-6 max-w-3xl mx-auto">

{day.events.map((event, i) => (

<div
key={i}
className="grid grid-cols-[1.3fr_1fr_1fr] items-center border border-[#d4af37]/30 bg-black/40 p-4 rounded-lg"
>

<div className="font-cinzel text-[#d4af37] text-lg">
{event.time}
</div>

<div className="font-pirata text-xl text-white text-center">
{event.event}
</div>

<div className="font-cinzel text-gray-300 text-right">
{event.venue}
</div>

</div>

))}

</div>

</div>

))}

</div>

</PiratePageLayout>

)

}