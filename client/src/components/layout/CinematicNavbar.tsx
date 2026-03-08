import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export const navItems = [
    { name: "Home", path: "/" },
    { name: "Event", path: "/events" },
    { name: "Merch", path: "/merch" },
];

export default function CinematicNavbar() {
    const [location] = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${scrolled ? "bg-black/95 backdrop-blur-md border-b border-white/5" : "bg-gradient-to-b from-black/80 to-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-8 py-4">
                <Link href="/">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="text-2xl font-black text-[#e50914] cursor-pointer tracking-widest uppercase font-sans"
                    >
                        Vaudeville
                    </motion.div>
                </Link>

                {/* DESKTOP NAV */}
                <div className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => {
                        const isActive = location === item.path || (location.startsWith('/events') && item.path === '/events');
                        return (
                            <Link key={item.name} href={item.path}>
                                <div className="relative text-sm font-semibold tracking-wider cursor-pointer uppercase font-sans">
                                    <span className={`transition-colors duration-300 ${isActive ? "text-white font-bold" : "text-gray-400 hover:text-white"}`}>
                                        {item.name}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* MOBILE MENU BUTTON */}
                <div className="md:hidden cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X className="text-white" /> : <Menu className="text-white" />}
                </div>
            </div>

            {/* MOBILE MENU */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "100vh" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute top-full left-0 w-full bg-black md:hidden flex flex-col items-center pt-20 gap-8 border-t border-white/10"
                    >
                        {navItems.map((item) => {
                            const isActive = location === item.path || (location.startsWith('/events') && item.path === '/events');
                            return (
                                <Link key={item.name} href={item.path}>
                                    <div
                                        onClick={() => setMenuOpen(false)}
                                        className={`text-2xl font-bold uppercase tracking-wider ${isActive ? "text-[#e50914]" : "text-white"}`}
                                    >
                                        {item.name}
                                    </div>
                                </Link>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
