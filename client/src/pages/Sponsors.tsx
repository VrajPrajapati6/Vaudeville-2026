import PiratePageLayout from "@/components/layout/PiratePageLayout"
import { sponsors } from "@/data/sponsorsData"
import bg14 from "@/assets/images/14.webp"

function SponsorRow({ title, items }) {

return (

<div className="mb-16">

<h2 className="font-pirata text-4xl text-[#d4af37] text-center mb-10">
{title}
</h2>

<div className="grid md:grid-cols-3 gap-10 items-center">

{items.map((sponsor, index) => (

<div
key={index}
className="bg-black/40 border border-[#d4af37]/40 rounded-lg p-6 flex items-center justify-center"
>

<img
src={sponsor.logo}
alt={sponsor.name}
className="max-h-16 object-contain"
/>

</div>

))}

</div>

</div>

)

}

export default function Sponsors() {

return (

<PiratePageLayout title="Sponsors" bgImage={bg14}>

<p className="font-cinzel text-gray-300 text-center max-w-xl mx-auto mb-16">
Vaudeville is made possible with the support of our amazing partners and sponsors.
</p>

<SponsorRow title="Title Sponsor" items={sponsors.title} />

<SponsorRow title="Gold Sponsors" items={sponsors.gold} />

<SponsorRow title="Silver Sponsors" items={sponsors.silver} />

<SponsorRow title="Community Partners" items={sponsors.community} />

</PiratePageLayout>

)

}