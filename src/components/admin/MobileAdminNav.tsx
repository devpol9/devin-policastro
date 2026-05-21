import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Briefcase, BarChart3, BookOpen, type LucideIcon, Home, Mail, KanbanSquare, Building2, Calendar, TrendingUp, Lightbulb, MessageSquare, Users, Inbox } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

type Item = { label: string; icon: LucideIcon; to: string };
type Group = { key: "work" | "output" | "capture"; label: string; icon: LucideIcon; items: Item[] };

const groups: Group[] = [
  {
    key: "work", label: "Work", icon: Briefcase,
    items: [
      { label: "Today", icon: Home, to: "/hq/today" },
      { label: "Inquiries", icon: Mail, to: "/hq/inquiries" },
      { label: "Projects", icon: KanbanSquare, to: "/hq/projects" },
      { label: "Ventures", icon: Building2, to: "/hq/ventures" },
      { label: "People", icon: Users, to: "/hq/people" },
    ],
  },
  {
    key: "output", label: "Output", icon: BarChart3,
    items: [
      { label: "Content", icon: Calendar, to: "/hq/content" },
      { label: "KPIs", icon: TrendingUp, to: "/hq/kpis" },
      { label: "Analytics", icon: BarChart3, to: "/hq/analytics" },
      
    ],
  },
  {
    key: "capture", label: "Capture", icon: BookOpen,
    items: [
      { label: "Daily Log", icon: BookOpen, to: "/hq/log" },
      { label: "Notes & Ideas", icon: Lightbulb, to: "/hq/notes" },
    ],
  },
];

const MobileAdminNav = () => {
  const { pathname } = useLocation();
  const [openKey, setOpenKey] = useState<Group["key"] | null>(null);

  const activeGroup = groups.find((g) => g.items.some((i) => pathname.startsWith(i.to)))?.key;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-14 border-t border-border bg-background/95 backdrop-blur-xl flex">
      {groups.map((g) => {
        const Icon = g.icon;
        const active = activeGroup === g.key;
        return (
          <Sheet key={g.key} open={openKey === g.key} onOpenChange={(o) => setOpenKey(o ? g.key : null)}>
            <SheetTrigger asChild>
              <button
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon size={18} />
                <span className="lowercase">{g.label}</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-xl">
              <SheetHeader>
                <SheetTitle className="text-sm font-medium lowercase text-left">{g.label}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 grid gap-1">
                {g.items.map((it) => {
                  const ItemIcon = it.icon;
                  return (
                    <NavLink
                      key={it.to}
                      to={it.to}
                      onClick={() => setOpenKey(null)}
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
        );
      })}
    </nav>
  );
};

export default MobileAdminNav;
