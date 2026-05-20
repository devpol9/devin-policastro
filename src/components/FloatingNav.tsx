import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowLeft, Shield } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIsAdmin } from "@/hooks/useIsAdmin";



const homeNavItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Links", href: "#links" },
  { label: "Shop", href: "#shop" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

const FloatingNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = homeNavItems.map((n) => n.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 200) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    if (!isHome) {
      const onScroll = () => setScrolled(window.scrollY > 50);
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
    }
  }, [isHome]);

  const handleClick = (href: string) => {
    setMobileOpen(false);
    if (isHome) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/" + href);
    }
  };

  const goHome = () => {
    setMobileOpen(false);
    navigate("/");
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: isHome ? 2 : 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-background/60 backdrop-blur-2xl border-b border-border/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
          {/* Left side */}
          {isHome ? (
            <button onClick={() => handleClick("#home")} className="font-display font-medium text-sm tracking-tight group text-muted-foreground hover:text-foreground transition-colors duration-300">
              hey, i'm <span className="text-primary font-bold">dev.</span>
            </button>
          ) : (
            <button onClick={goHome} className="flex items-center gap-2 font-display font-medium text-sm tracking-tight text-muted-foreground hover:text-foreground transition-colors duration-300 group">
              <ArrowLeft size={16} />
              <span>hey, i'm <span className="text-primary font-bold">dev.</span></span>
            </button>
          )}

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-0.5">
            {isHome ? (
              homeNavItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleClick(item.href)}
                  className={`relative px-3 py-2 text-xs font-display font-medium tracking-wide transition-colors duration-300 rounded-lg ${
                    activeSection === item.href.slice(1)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {activeSection === item.href.slice(1) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0.5 left-3 right-3 h-px bg-primary/60"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))
            ) : (
              <>
                <button
                  onClick={goHome}
                  className="relative px-3 py-2 text-xs font-display font-medium tracking-wide transition-colors duration-300 rounded-lg text-muted-foreground hover:text-foreground"
                >
                  Home
                </button>
                <button
                  onClick={() => { navigate("/"); setTimeout(() => document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" }), 500); }}
                  className="relative px-3 py-2 text-xs font-display font-medium tracking-wide transition-colors duration-300 rounded-lg text-muted-foreground hover:text-foreground"
                >
                  Services
                </button>
                <button
                  onClick={() => { navigate("/"); setTimeout(() => document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth" }), 500); }}
                  className="relative px-3 py-2 text-xs font-display font-medium tracking-wide transition-colors duration-300 rounded-lg text-muted-foreground hover:text-foreground"
                >
                  Shop
                </button>
                <button
                  onClick={() => { navigate("/"); setTimeout(() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }), 500); }}
                  className="relative px-3 py-2 text-xs font-display font-medium tracking-wide transition-colors duration-300 rounded-lg text-muted-foreground hover:text-foreground"
                >
                  Contact
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-foreground relative z-[60]"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[55] bg-background/98 backdrop-blur-2xl flex items-center justify-center md:hidden"
          >
            <div className="flex flex-col items-center gap-1">
              {!isHome && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onClick={goHome}
                  className="text-2xl font-display font-bold py-3 tracking-tight text-primary flex items-center gap-2"
                >
                  <ArrowLeft size={22} />
                  Home
                </motion.button>
              )}
              {(isHome ? homeNavItems : [
                { label: "Services", href: "#services" },
                { label: "Shop", href: "#shop" },
                { label: "Contact", href: "#contact" },
              ]).map((item, i) => (
                <motion.button
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => handleClick(item.href)}
                  className={`text-2xl font-display font-bold py-3 tracking-tight transition-colors duration-300 ${
                    isHome && activeSection === item.href.slice(1) ? "text-primary" : "text-foreground hover:text-primary"
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingNav;
