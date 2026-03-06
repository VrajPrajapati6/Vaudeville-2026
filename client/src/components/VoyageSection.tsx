import { useLocation } from "wouter";

interface Props {
  image: string;
  title: string;
  subtitle: string;
  link: string;
}

export default function VoyageSection({ image, title, subtitle, link }: Props) {

  const [, navigate] = useLocation();

  return (
    <section className="relative h-screen w-full overflow-hidden">

      {/* Background */}
      <img
        src={image}
        className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-overlay"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">

        <h2 className="text-6xl font-pirata text-[#d4af37]">
          {title}
        </h2>

        <p className="mt-4 text-lg font-cinzel text-white">
          {subtitle}
        </p>

        <button
          onClick={() => navigate(link)}
          className="mt-8 px-8 py-4 border border-[#d4af37] text-[#d4af37] bg-black/60"
        >
          Explore
        </button>

      </div>

    </section>
  );
}