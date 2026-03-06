import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import parchmentImg from "@/assets/images/parchment.png";

export interface DashboardEvent {
    id: number;
    name: string;
    chapter: string;
    description: string;
    x: string;
    y: string;
}

interface EventDialogProps {
    selectedEvent: DashboardEvent | null;
    onClose: () => void;
}

export default function EventDialog({ selectedEvent, onClose }: EventDialogProps) {
    return (
        <Dialog open={!!selectedEvent} onOpenChange={(open) => {
            if (!open) {
                onClose();
            }
        }}>
            <DialogContent className="w-[95vw] sm:max-w-2xl bg-transparent border-none p-0 overflow-hidden">
                <motion.div
                    className="relative p-6 sm:p-12 min-h-[400px] sm:min-h-[500px] flex flex-col"
                    style={{
                        backgroundImage: `url(${parchmentImg})`,
                        backgroundSize: 'cover'
                    }}
                >
                    <DialogHeader>
                        <DialogTitle className="font-pirata text-3xl sm:text-6xl text-[#2a1a0a]">
                            {selectedEvent?.name}
                        </DialogTitle>
                        <DialogDescription className="text-[#2a1a0a]/80 font-cinzel text-sm sm:text-lg italic mt-4">
                            "{selectedEvent?.description}"
                        </DialogDescription>
                    </DialogHeader>

                    <button className="mt-8 sm:mt-12 w-full py-4 sm:py-5 bg-[#2a1a0a] text-[#d4af37] font-pirata text-xl sm:text-3xl tracking-widest">
                        SEAL THE COMPACT
                    </button>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}
