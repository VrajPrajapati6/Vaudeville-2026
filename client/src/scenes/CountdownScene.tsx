import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CountdownScene() {
  const targetDate = new Date("March 20, 2026 00:00:00").getTime();

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen bg-[#070c14] flex flex-col items-center justify-center px-6 snap-start">

      {/* Title */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.7 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="font-cinzel text-xs uppercase tracking-[0.4em] text-[#d4af37]/70 mb-6 text-center"
      >
        Chapter III
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="font-pirata text-4xl sm:text-6xl md:text-7xl text-white text-center"
      >
        The Invasion Ends In
      </motion.h2>

      {/* Timer */}
      <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">

        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Minutes", value: timeLeft.minutes },
          { label: "Seconds", value: timeLeft.seconds },
        ].map((item) => (
          <div key={item.label}>
            <div className="font-pirata text-5xl sm:text-6xl md:text-7xl text-[#d4af37] drop-shadow-[0_0_25px_rgba(212,175,55,0.6)]">
              {String(item.value).padStart(2, "0")}
            </div>
            <div className="mt-2 font-cinzel text-xs uppercase tracking-widest text-white/60">
              {item.label}
            </div>
          </div>
        ))}

      </div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        viewport={{ once: true }}
        className="mt-16 px-10 py-4 bg-[#d4af37] text-black font-cinzel tracking-widest text-sm hover:bg-[#c49b2e] transition-all duration-300"
      >
        ENLIST NOW
      </motion.button>

    </section>
  );
}