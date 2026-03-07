import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Links", href: "#links" },
  { label: "Shop", href: "#shop" },
  { label: "Codes", href: "#codes" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

const FloatingNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/30 shadow-lg shadow-background/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <button onClick={() => handleClick("#home")} className="font-display font-bold text-lg tracking-tight">
            <span className="text-foreground">DEVIN</span>
            <span className="glow-text ml-1">P.</span>
          </button>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleClick(item.href)}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg hover:bg-secondary/50"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-20 px-6 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleClick(item.href)}
                  className="text-left text-xl font-display font-semibold py-3 text-foreground hover:text-primary transition-colors border-b border-border/20"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingNav;
