import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLocation } from "wouter";

interface EventModalProps {
    event: any;
    onClose: () => void;
}

export default function EventModal({ event, onClose }: EventModalProps) {
    const [, navigate] = useLocation();

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                    className="relative w-full max-w-4xl bg-[#0a0a0a] rounded-xl overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.15)] border border-[#d4af37]/40 z-10 flex flex-col h-[85vh]"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-[#d4af37] hover:text-black rounded-full text-[#d4af37] transition-colors border border-[#d4af37]/30"
                    >
                        <X size={24} />
                    </button>

                    {/* Banner Image */}
                    <div className="relative w-full h-48 md:h-72 shrink-0 border-b border-[#d4af37]/20">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent" />

                        <div className="absolute bottom-4 left-6 md:left-10 z-10">
                            <h2 className="text-4xl md:text-6xl font-pirata text-[#d4af37] tracking-wider drop-shadow-lg leading-none">
                                {event.title}
                            </h2>
                        </div>
                    </div>

                    {/* Details (Scrollable Area) */}
                    <div className="p-6 md:p-10 overflow-y-auto overscroll-contain touch-pan-y custom-scrollbar flex-1 font-cinzel min-h-0">
                        <div className="flex flex-wrap gap-3 mb-6">
                            <span className="bg-black/50 text-[#d4af37] px-3 py-1 rounded-sm text-sm border border-[#d4af37]/30">
                                Team Size: {event.teamSize}
                            </span>
                            <span className="bg-black/50 text-[#d4af37] px-3 py-1 rounded-sm text-sm border border-[#d4af37]/30">
                                Prize: {event.prize}
                            </span>
                        </div>

                        <p className="text-gray-300 text-lg leading-relaxed mb-8 font-sans">
                            {event.description}
                        </p>

                        <div className="mb-8 font-sans">
                            <h3 className="text-xl font-pirata text-[#d4af37] mb-4 text-2xl tracking-wide border-b border-[#d4af37]/30 pb-2 inline-block">
                                Rules & Guidelines
                            </h3>
                            <ul className="list-disc list-inside text-gray-400 space-y-2">
                                {event.rules?.map((rule: string, idx: number) => (
                                    <li key={idx}>{rule}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-4 pb-2">
                            <button
                                onClick={() => navigate(`/register/${event.slug}`)}
                                className="w-full md:w-auto bg-transparent border border-[#d4af37] hover:bg-[#d4af37] hover:text-black text-[#d4af37] px-10 py-3 rounded-sm text-lg font-bold tracking-widest transition-colors shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                            >
                                JOIN THE CREW
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
