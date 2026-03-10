import { useState } from "react"
import { MapPin, Clock } from "lucide-react"
import PiratePageLayout from "@/components/layout/PiratePageLayout"
import { timeline } from "@/data/timelineData"
import bg10 from "@/assets/images/10.webp";

export default function Timeline() {
    const [activeTab, setActiveTab] = useState(0)

    // Map "Day 1", "Day 2", "Day 3" from the data to the correct format
    const tabs = timeline.map(t => ({
        label: t.day.toUpperCase(), // "DAY 1"
        date: t.date // "20 March"
    }))

    return (
        <PiratePageLayout title="Event Itinerary" bgImage={bg10}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-20">

                {/* Tabs section */}
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-2 sm:px-0">
                    {tabs.map((tab, idx) => {
                        const isActive = activeTab === idx
                        return (
                            <button
                                key={idx}
                                onClick={() => setActiveTab(idx)}
                                className={`flex flex-col items-center justify-center py-3 sm:py-4 px-2 sm:px-8 rounded-xl transition-all duration-300 w-[calc(50%-6px)] sm:w-auto sm:min-w-[160px]
                  ${isActive
                                        ? "bg-[#d4af37] text-[#2c1d11] shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                                        : "bg-[#3e2723] text-[#d4af37]/80 hover:bg-[#4e342e] border border-[#d4af37]/20"
                                    }`}
                            >
                                <span className={`text-lg font-cinzel font-bold mb-1 ${isActive ? "text-[#2c1d11]" : "text-white"}`}>
                                    {tab.label}
                                </span>
                                <span className={`text-sm tracking-wide ${isActive ? "text-[#5e4021] font-semibold" : "text-gray-400"}`}>
                                    {tab.date}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* Timeline Events for the active tab */}
                <div className="relative pl-6 sm:pl-10">
                    {/* Vertical line connecting events */}
                    <div className="absolute left-0 top-6 bottom-0 w-[1px] bg-[#d4af37]/30"></div>

                    <div className="space-y-12">
                        {timeline[activeTab].events.map((event, i) => (
                            <div key={i} className="relative group">
                                {/* Dot marker */}
                                <div className="absolute -left-[30px] sm:-left-[46px] top-6 w-3 h-3 rounded-full bg-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.8)] z-10 transition-transform group-hover:scale-150"></div>

                                {/* Event Card */}
                                <div className="bg-[#1a120e]/80 border border-[#d4af37]/20 rounded-xl p-6 sm:p-8 hover:border-[#d4af37]/50 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">

                                    {/* Time and Location header */}
                                    <div className="flex flex-wrap items-center gap-6 text-[#d4af37] mb-4 text-sm sm:text-base font-cinzel">
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} />
                                            <span className="tracking-wide">{event.time}</span>
                                        </div>
                                        {event.venue && (
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} />
                                                <span className="tracking-wide">{event.venue}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-2xl sm:text-3xl font-pirata text-white tracking-widest mb-3 uppercase">
                                        {event.event}
                                    </h3>

                                    {/* Optional sub-description (currently not in timelineData but styled just in case) */}
                                    <p className="text-gray-400 font-cinzel text-sm sm:text-base hidden">
                                        {/* Placeholder for future descriptions */}
                                    </p>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PiratePageLayout>
    )
}