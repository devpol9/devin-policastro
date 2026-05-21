import { NavLink, useLocation } from "react-router-dom";
import { Home, Inbox, Building2, Calendar, MoreHorizontal, TrendingUp, Newspaper, Lightbulb, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

const primary = [
  { label: "Today", icon: Home, to: "/hq/today" },
  { label: "Inbox", icon: Inbox, to: "/hq/inquiries" },
  { label: "Ventures", icon: Building2, to: "/hq/ventures" },
  { label: "Content", icon: Calendar, to: "/hq/content" },
];

const more = [
  { label: "KPIs", icon: TrendingUp, to: "/hq/kpis" },
  { label: "Briefings", icon: Newspaper, to: "/hq/briefings" },
  { label: "Notes", icon: Lightbulb, to: "/hq/notes" },
  { label: "Settings", icon: Settings, to: "/hq/settings/pillars" },
];

const MobileAdminNav = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const moreActive = more.some((m) => pathname.startsWith(m.to));

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-14 border-t border-border bg-background/95 backdrop-blur-xl flex">
      {primary.map((item) => {
        const Icon = item.icon;
        const active = pathname.startsWith(item.to);
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] ${
              active ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] ${
              moreActive ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <MoreHorizontal size={18} />
            <span>More</span>
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-xl">
          <SheetHeader>
            <SheetTitle className="text-sm font-medium text-left">More</SheetTitle>
          </SheetHeader>
          <div className="mt-4 grid gap-1">
            {more.map((it) => {
              const ItemIcon = it.icon;
              return (
                <NavLink
                  key={it.to}
                  to={it.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-md text-sm ${
                      isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60"
                    }`
                  }
                >
                  <ItemIcon size={16} />
                  {it.label}
                </NavLink>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MobileAdminNav;
