import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useState } from "react";

const navItems = [
  { name: "About", path: "/about" },
  { name: "Events", path: "/events" },
  { name: "Timeline", path: "/timeline" },
  { name: "Sponsors", path: "/sponsors" },
  { name: "Merch", path: "/merch" },
  { name: "Crew", path: "/core" },
];

export default function PirateNavbar() {

  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="
        fixed top-0 left-0 w-full z-50
        backdrop-blur-md
        bg-black/40
        border-b border-[#d4af37]/20
      "
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-8 py-4">

        {/* LOGO */}
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="text-2xl font-pirata text-[#d4af37] cursor-pointer"
          >
            Vaudeville
          </motion.div>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">

          {navItems.map((item) => {

            const isActive = location === item.path;

            return (
              <Link key={item.name} href={item.path}>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="relative font-cinzel text-sm tracking-wider cursor-pointer"
                >

                  <span
                    className={`
                    transition-colors duration-300
                    ${isActive ? "text-[#d4af37]" : "text-white/80"}
                  `}
                  >
                    {item.name}
                  </span>

                  {/* Active underline */}
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-0 -bottom-1 h-[2px] bg-[#d4af37]"
                    style={{
                      width: isActive ? "100%" : "0%"
                    }}
                  />

                  {/* Hover glow */}
                  <motion.span
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    className="
                      absolute left-0 -bottom-1
                      h-[2px] bg-[#d4af37]/50
                    "
                  />

                </motion.div>
              </Link>
            );
          })}

        </div>

        {/* MOBILE MENU BUTTON */}
        <div
          className="md:hidden cursor-pointer flex flex-col gap-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >

          <motion.span
            animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="w-6 h-[2px] bg-[#d4af37]"
          />

          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-6 h-[2px] bg-[#d4af37]"
          />

          <motion.span
            animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="w-6 h-[2px] bg-[#d4af37]"
          />

        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>

        {menuOpen && (

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="
              md:hidden
              bg-black/90
              backdrop-blur-xl
              border-t border-[#d4af37]/20
            "
          >

            <div className="flex flex-col items-center gap-6 py-8">

              {navItems.map((item) => {

                const isActive = location === item.path;

                return (
                  <Link key={item.name} href={item.path}>

                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setMenuOpen(false)}
                      className="font-cinzel text-lg tracking-wider cursor-pointer"
                    >

                      <span
                        className={`
                        transition-colors duration-300
                        ${isActive ? "text-[#d4af37]" : "text-white/80"}
                      `}
                      >
                        {item.name}
                      </span>

                    </motion.div>

                  </Link>
                );
              })}

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </motion.nav>
  );
}