import { Home, ShoppingBag, Briefcase, Mail, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const homeItems = [
  { icon: Home, label: "Home", href: "#home" },
  { icon: ShoppingBag, label: "Shop", href: "#shop" },
  { icon: Briefcase, label: "Services", href: "#services" },
  { icon: Mail, label: "Contact", href: "#contact" },
];

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const handleClick = (href: string) => {
    if (isHome) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }), 500);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/90 backdrop-blur-xl border-t border-border/30">
      <div className="flex items-center justify-around h-14 px-2">
        {!isHome && (
          <button
            onClick={() => navigate("/")}
            className="flex flex-col items-center gap-0.5 text-primary transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-[9px] font-medium">Back</span>
          </button>
        )}
        {isHome ? (
          homeItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleClick(item.href)}
              className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-primary transition-colors"
            >
              <item.icon size={18} />
              <span className="text-[9px] font-medium">{item.label}</span>
            </button>
          ))
        ) : (
          // Sub-pages: only show Back + Contact (2 items, no crowding)
          <button
            onClick={() => handleClick("#contact")}
            className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail size={18} />
            <span className="text-[9px] font-medium">Contact</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
