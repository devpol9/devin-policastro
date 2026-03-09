import { Home, ShoppingBag, Link2, Mail } from "lucide-react";

const items = [
  { icon: Home, label: "Home", href: "#home" },
  { icon: ShoppingBag, label: "Shop+Codes", href: "#shop" },
  { icon: Link2, label: "Links", href: "#links" },
  { icon: Mail, label: "Contact", href: "#contact" },
];

const MobileBottomNav = () => {
  const handleClick = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/90 backdrop-blur-xl border-t border-border/30">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => (
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
