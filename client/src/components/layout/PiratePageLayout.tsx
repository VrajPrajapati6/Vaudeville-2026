import PirateNavbar from "./Navbar";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function PiratePageLayout({ title, children }: Props) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

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
  );
}