import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";

const navItems = [
  { name: "Events", path: "/events" },
  { name: "Timeline", path: "/timeline" },
  { name: "Sponsors", path: "/sponsors" },
  { name: "Merch", path: "/merch" },
  { name: "Core", path: "/core" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 w-full z-50 transition-all duration-500
        ${
          scrolled
            ? "bg-black/80 backdrop-blur-lg shadow-lg border-b border-yellow-600/30"
            : "bg-black/40 backdrop-blur-md"
        }
      `}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* LOGO */}
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-2xl font-pirata text-yellow-400 cursor-pointer text-glow"
          >
            Vaudeville
          </motion.div>
        </Link>

        {/* NAV LINKS */}
        <ul className="flex items-center gap-8 font-cinzel text-sm tracking-wider">

          {navItems.map((item) => (
            <motion.li
              key={item.name}
              whileHover={{
                scale: 1.1,
                textShadow: "0px 0px 10px rgba(212,175,55,0.8)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
            >
              <Link href={item.path}>
                <span
                  className={`cursor-pointer transition-colors duration-300 ${
                    location === item.path
                      ? "text-yellow-400"
                      : "text-white/80 hover:text-yellow-400"
                  }`}
                >
                  {item.name}
                </span>
              </Link>

              {/* animated underline */}
              <motion.div
                layoutId="navbar-underline"
                className={`absolute left-0 -bottom-2 h-[2px] bg-yellow-400 ${
                  location === item.path ? "w-full" : "w-0"
                }`}
              />
            </motion.li>
          ))}

        </ul>

      </div>
    </motion.nav>
  );
}