import PiratePageLayout from "@/components/layout/PiratePageLayout"
import { coreMembers } from "@/data/coreData"

export default function Core() {

return (

<PiratePageLayout title="Core Crew">

<div className="text-center mb-16">

<p className="font-cinzel text-gray-300 max-w-xl mx-auto">
Meet the crew behind Vaudeville.  
A team of passionate students bringing the festival to life.
</p>

</div>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

{coreMembers.map((member, index) => (

<div
key={index}
className="group bg-black/40 border border-[#d4af37]/40 rounded-xl overflow-hidden hover:scale-105 transition duration-300"
>

{/* Image */}

<div className="h-72 bg-black flex items-center justify-center overflow-hidden">

<img
src={member.image}
alt={member.name}
className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
/>

</div>

{/* Info */}

<div className="p-6 text-center">

<h3 className="font-pirata text-3xl text-[#d4af37]">
{member.name}
</h3>

<p className="font-cinzel text-gray-300 mt-2">
{member.role}
</p>

<a
href={member.linkedin}
target="_blank"
className="inline-block mt-4 text-sm border border-[#d4af37] px-4 py-1 text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition"
>
LinkedIn
</a>

</div>

</div>

))}

</div>

</PiratePageLayout>

)
}