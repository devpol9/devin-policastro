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
      <div className="flex items-center justify-around h-16 px-2">
        {!isHome && (
          <button
            onClick={() => navigate("/")}
            className="flex flex-col items-center gap-1 text-primary transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-[10px] font-medium">Back</span>
          </button>
        )}
        {(isHome ? homeItems : homeItems).map((item) => (
          <button
            key={item.href}
            onClick={() => handleClick(item.href)}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
