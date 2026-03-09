import PiratePageLayout from "@/components/layout/PiratePageLayout"
import { coreMembers } from "@/data/coreData"

export default function Core() {

  const totalCards = 30

  const members = Array.from({ length: totalCards }, (_, index) => {
    return coreMembers[index] || {
      name: `Member ${index + 1}`,
      image: "/placeholder.jpg"
    }
  })

  const advisoryMembers = [
    {
      name: "Sahil Bokhani",
      image: "/crew/Sahil Bokhani.jpg",
    },

    {
      name: "Joyal Patel",
      image: "/crew/Joyal Patel.jpg",
    },

    {
      name: "Archit Thakkar",
      image: "/crew/Archit Thakker.jpg",
    },

    {
      name: "Het Dalal",
      image: "/crew/Het Dalal.jpg",
    },

    {
      name: "Aman Chaudhary",
      image: "/crew/Aman.jpg",
    }

  ]

  return (

    <PiratePageLayout title="Core Crew">

      <div className="text-center mb-16">

        <p className="font-cinzel text-gray-300 max-w-xl mx-auto">
          Meet the crew behind Vaudeville.
          A team of passionate students bringing the festival to life.
        </p>

      </div>

      {/* CORE COMMITTEE */}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-20">

        {members.map((member, index) => (

          <div
            key={index}
            className="group bg-black/40 border border-[#d4af37]/40 rounded-xl overflow-hidden hover:scale-105 transition duration-300"
          >

            {/* Image */}

            <div className="aspect-square bg-black flex items-center justify-center overflow-hidden">

              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />

            </div>

            {/* Name */}

            <div className="p-4 text-center">

              <h3 className="font-pirata text-2xl text-[#d4af37]">
                {member.name}
              </h3>

            </div>

          </div>

        ))}

      </div>


      {/* ADVISORY COMMITTEE */}

      <div className="text-center mb-10">

        <h2 className="font-pirata text-4xl text-[#d4af37]">
          Advisory Committee
        </h2>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-center">

        {advisoryMembers.map((member, index) => (

          <div
            key={index}
            className="group bg-black/40 border border-[#d4af37]/40 rounded-xl overflow-hidden hover:scale-105 transition duration-300"
          >

            <div className="aspect-square bg-black flex items-center justify-center overflow-hidden">

              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />

            </div>

            <div className="p-4 text-center">

              <h3 className="font-pirata text-2xl text-[#d4af37]">
                {member.name}
              </h3>

            </div>

          </div>

        ))}

      </div>

    </PiratePageLayout>

  )
}