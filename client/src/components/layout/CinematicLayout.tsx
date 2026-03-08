import PirateNavbar from "./Navbar";

interface Props {
    title?: string;
    children: React.ReactNode;
}

export default function CinematicLayout({ children }: Props) {
    return (
        <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-[#e50914] selection:text-white">
            <PirateNavbar />
            <main className="pt-[72px]">
                {children}
            </main>
        </div>
    );
}
