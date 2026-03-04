import PiratePageLayout from "@/components/layout/PiratePageLayout"
import tshirt from "@/assets/images/merch-tshirt.png"

export default function Merch() {

return (

<PiratePageLayout title="Official Merch">

<div className="grid lg:grid-cols-2 gap-16 items-center">

{/* Merch Image */}

<div className="flex justify-center">

<img
src={tshirt}
alt="Vaudeville T-Shirt"
className="max-h-[500px] object-contain"
/>

</div>

{/* Merch Details */}

<div>

<h2 className="font-pirata text-5xl text-[#d4af37] mb-6">
Vaudeville Limited Edition T-Shirt
</h2>

<p className="font-cinzel text-gray-300 mb-8 leading-relaxed">
Own a piece of the Vaudeville legend.  
This limited edition festival t-shirt is designed exclusively for
Vaudeville 2026 participants. Only a limited number of pieces will
be available during the event.
</p>

<div className="mb-6">

<h3 className="font-pirata text-2xl text-[#d4af37] mb-2">
Price
</h3>

<p className="font-cinzel text-xl text-white">
₹599
</p>

</div>

{/* Size Selection */}

<div className="mb-10">

<h3 className="font-pirata text-2xl text-[#d4af37] mb-3">
Select Size
</h3>

<div className="flex gap-4">

<button className="px-4 py-2 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition">
S
</button>

<button className="px-4 py-2 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition">
M
</button>

<button className="px-4 py-2 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition">
L
</button>

<button className="px-4 py-2 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition">
XL
</button>

</div>

</div>

{/* Buy Button */}

<button className="px-8 py-4 border border-[#d4af37] text-[#d4af37] font-cinzel text-lg hover:bg-[#d4af37] hover:text-black transition">
Buy Now
</button>

</div>

</div>

</PiratePageLayout>

)
}