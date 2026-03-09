import PirateNavbar from "./Navbar";
import { useLocation } from "wouter";

interface Props {
  title: string;
  children: React.ReactNode;
  bgImage?: string;
}

export default function PiratePageLayout({ title, children, bgImage }: Props) {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative flex flex-col">
      {/* Optional Background Image */}
      {bgImage && (
        <>
          <div
            className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-50"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0a] via-black/40 to-[#0a0a0a] z-0 pointer-events-none" />
          <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a0a_100%)] z-0 pointer-events-none opacity-60" />
        </>
      )}

      {/* Content wrapper */}
      <div className="relative z-10 flex-grow flex flex-col">
        <PirateNavbar />

      {/* Page Banner */}
      <section className="h-[50vh] flex items-center justify-center text-center">

        <h1 className="font-pirata text-6xl md:text-8xl text-[#d4af37] tracking-wider">
          {title}
        </h1>

      </section>

      {/* Page Content */}
      <section className="max-w-6xl mx-auto px-6 pb-20">

        {children}


      </section>
      </div>

    </div>
  );
}