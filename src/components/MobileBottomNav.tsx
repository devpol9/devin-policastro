import { Home, Layers, Briefcase, Mail, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const homeItems = [
  { icon: Home, label: "Home", href: "#home" },
  { icon: Briefcase, label: "Services", href: "#services" },
  { icon: Layers, label: "Ventures", href: "#ventures" },
  { icon: Mail, label: "Contact", href: "#contact" },
];


const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const handleClick = (href: string) => {
    if (href === "#home") {
      if (isHome) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 300);
      }
      return;
    }
    if (isHome) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }), 500);
    }
  };


  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/85 backdrop-blur-2xl border-t border-border/40">
      {/* Top accent line */}
      <span className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-16 bg-accent" />
      <div className="flex items-center justify-around h-16 px-2 pt-1">
        {!isHome && (
          <button
            onClick={() => navigate("/")}
            className="flex flex-col items-center gap-1 text-accent transition-colors"
          >
            <ArrowLeft size={18} strokeWidth={2.25} />
            <span className="text-[9px] font-display font-semibold tracking-[0.12em]">Back</span>
          </button>
        )}
        {isHome ? (
          homeItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleClick(item.href)}
              className="flex flex-col items-center gap-1 text-foreground/60 active:text-accent transition-colors"
            >
              <item.icon size={18} strokeWidth={2.25} />
              <span className="text-[9px] font-display font-semibold tracking-[0.12em]">{item.label}</span>
            </button>
          ))
        ) : (
          <button
            onClick={() => handleClick("#contact")}
            className="flex flex-col items-center gap-1 text-foreground/60 active:text-accent transition-colors"
          >
            <Mail size={18} strokeWidth={2.25} />
            <span className="text-[9px] font-display font-semibold tracking-[0.12em]">Contact</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
