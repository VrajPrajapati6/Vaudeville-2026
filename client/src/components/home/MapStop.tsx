import { motion, useTransform } from "framer-motion";

export default function MapStop({ stop, scrollYProgress, navigate }) {

  const opacity = useTransform(
    scrollYProgress,
    [stop.trigger - 0.02, stop.trigger + 0.03],
    [0, 1]
  );

  const y = useTransform(
    scrollYProgress,
    [stop.trigger - 0.02, stop.trigger + 0.03],
    [60, 0]
  );

  return (
    <motion.div className="flex w-full" style={{ opacity, y }}>
      <div className={`w-1/2 flex ${stop.align === "left" ? "justify-end" : "justify-start ml-auto"}`}>
        <div className="bg-black/70 border border-amber-400 rounded-xl p-6 w-[280px] text-center">

          <h2 className="text-amber-300 font-bold mb-2">
            {stop.title}
          </h2>

          <p className="text-gray-300 mb-4">
            {stop.subtitle}
          </p>

          <button
            onClick={() => navigate(stop.link)}
            className="px-4 py-2 border border-amber-400 text-amber-300 rounded hover:bg-amber-400 hover:text-black"
          >
            Explore
          </button>

        </div>
      </div>
    </motion.div>
  );
}