import { motion } from "framer-motion"

interface SceneProps {
  image: string
  title: string
  subtitle: string
  buttonText?: string
  onClick?: () => void
}

export default function CinematicScene({
  image,
  title,
  subtitle,
  buttonText,
  onClick
}: SceneProps) {

  return (
    <section className="relative h-screen w-full overflow-hidden">

      {/* Background Image */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1.5 }}
      >
        <img
          src={image}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Fog Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-pirata text-[#d4af37]"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-lg font-cinzel"
        >
          {subtitle}
        </motion.p>

        {buttonText && (
          <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            className="mt-8 px-8 py-4 bg-[#2a1a0a] border border-[#d4af37] text-[#d4af37] font-cinzel tracking-widest"
          >
            {buttonText}
          </motion.button>
        )}

      </div>
    </section>
  )
}