import { useState } from "react"
import { useLocation } from "wouter"
import PiratePageLayout from "@/components/layout/PiratePageLayout"
import tshirt from "@/assets/images/merch-tshirt.png"
import sizeChart from "@/assets/images/t-shirt.jpeg"

export default function Merch() {
const [showSizeChart, setShowSizeChart] = useState(false)
const [, setLocation] = useLocation()

return (

<PiratePageLayout title="Official Merch">

{/* ── Size Chart Modal ────────────────────────────────────── */}
{showSizeChart && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    onClick={() => setShowSizeChart(false)}
  >
    <div
      className="relative max-w-3xl w-full border-2 border-[#d4af37] rounded-lg overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.4)]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between bg-black px-5 py-3 border-b border-[#d4af37]/40">
        <span className="font-pirata text-[#d4af37] text-2xl tracking-wide">Size Chart</span>
        <button
          onClick={() => setShowSizeChart(false)}
          className="text-gray-400 hover:text-white text-2xl leading-none transition"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
      <img
        src={sizeChart}
        alt="Size Chart"
        className="w-full object-contain bg-white"
      />
    </div>
  </div>
)}

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
Coming Soon
</p>

</div>

{/* Size Selection */}

<div className="mb-10">

<div className="flex items-center gap-4 mb-3">
<h3 className="font-pirata text-2xl text-[#d4af37]">
Select Size
</h3>
</div>

<p className="font-cinzel text-xl text-white uppercase tracking-wider mb-4">
Coming Soon
</p>

</div>

        {/* Buy Button */}

        <button
          disabled
          className="px-8 py-4 bg-gray-500/50 text-gray-400 font-cinzel font-bold text-lg cursor-not-allowed uppercase tracking-wider border border-gray-500/30"
        >
          Coming Soon
        </button>

      </div>

    </div>

  </PiratePageLayout>

)
}