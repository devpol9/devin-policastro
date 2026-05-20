import { ReactNode, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home, Mail, KanbanSquare, Building2, Calendar, BookOpen,
  TrendingUp, Lightbulb, BarChart3, MessageSquare, Settings,
  LogOut, Search,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar";

type NavItem = {
  label: string;
  icon: typeof Home;
  to?: string;
  soon?: boolean;
};

const mainNav: NavItem[] = [
  { label: "Today", icon: Home, to: "/hq/today" },
  { label: "Inquiries", icon: Mail, to: "/hq/inquiries" },
  { label: "Projects", icon: KanbanSquare, to: "/hq/projects" },
  { label: "Ventures", icon: Building2, to: "/hq/ventures" },
  { label: "Content", icon: Calendar, to: "/hq/content" },
  { label: "Analytics", icon: BarChart3, to: "/hq/analytics" },
  { label: "Chat Logs", icon: MessageSquare, to: "/hq/chats" },
  { label: "KPIs", icon: TrendingUp, to: "/hq/kpis" },
  { label: "Daily Log", icon: BookOpen, to: "/hq/daily-log", soon: true },
  { label: "Notes & Ideas", icon: Lightbulb, to: "/hq/notes", soon: true },
];

const pageTitleFor = (pathname: string): string => {
  if (pathname.startsWith("/hq/today")) return "Today";
  if (pathname.startsWith("/hq/inquiries")) return "Inquiries";
  if (pathname.startsWith("/hq/ventures")) return "Ventures";
  if (pathname.startsWith("/hq/projects")) return "Projects";
  if (pathname.startsWith("/hq/content")) return "Content";
  if (pathname.startsWith("/hq/analytics")) return "Analytics";
  if (pathname.startsWith("/hq/chats")) return "Chat Logs";
  if (pathname.startsWith("/hq/kpis")) return "KPIs";
  if (pathname.startsWith("/hq/settings/pillars")) return "Pillars";
  if (pathname.startsWith("/hq/settings")) return "Settings";
  return "DevHQ";
};

const AdminShell = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [newCount, setNewCount] = useState<number>(0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "");
    });
  }, []);

  useEffect(() => {
    const loadCount = async () => {
      const { count } = await supabase
        .from("inquiries")
        .select("id", { count: "exact", head: true })
        .eq("status", "new");
      setNewCount(count ?? 0);
    };
    loadCount();
    const channel = supabase
      .channel("admin-shell-new-count")
      .on("postgres_changes", { event: "*", schema: "public", table: "inquiries" }, loadCount)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/hq/login", { replace: true });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar collapsible="icon">
          <SidebarHeader className="px-4 py-5">
            <div className="font-display font-bold text-xl tracking-tight">
              Dev<span className="italic font-light text-accent">HQ.</span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainNav.map((item) => {
                    const Icon = item.icon;
                    if (item.soon) {
                      return (
                        <SidebarMenuItem key={item.label}>
                          <SidebarMenuButton disabled className="opacity-50 cursor-not-allowed">
                            <Icon className="h-4 w-4" />
                            <span className="flex-1">{item.label}</span>
                            <span className="text-[9px] font-display font-semibold tracking-[0.12em] text-muted-foreground border border-border/60 rounded px-1.5 py-0.5">
                              Soon
                            </span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    }
                    const active = location.pathname === item.to ||
                      (item.to !== "/" && location.pathname.startsWith(item.to!));
                    return (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton asChild isActive={active}>
                          <NavLink to={item.to!} className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span className="flex-1">{item.label}</span>
                            {item.label === "Inquiries" && newCount > 0 && (
                              <span className="text-[10px] font-display font-semibold rounded-full bg-accent text-accent-foreground px-1.5 py-0.5 min-w-[18px] text-center">
                                {newCount}
                              </span>
                            )}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-auto">
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.startsWith("/hq/settings")}>
                      <NavLink to="/hq/settings/pillars" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span className="flex-1">Settings</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border px-3 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-mono text-muted-foreground truncate">{email}</p>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
                title="Sign out"
              >
                <LogOut size={14} />
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-40 h-14 flex items-center gap-3 border-b border-border/40 bg-background/85 backdrop-blur-xl px-3 sm:px-6">
            <SidebarTrigger />
            <h1 className="font-display font-semibold text-sm tracking-tight">
              {pageTitleFor(location.pathname)}
            </h1>
            <div className="flex-1 max-w-md mx-auto hidden md:flex items-center gap-2 bg-secondary/50 border border-border/40 rounded-lg px-3 py-1.5">
              <Search size={14} className="text-muted-foreground" />
              <input
                disabled
                placeholder="Quick search (coming soon)"
                className="bg-transparent text-xs outline-none flex-1 placeholder:text-muted-foreground/60"
              />
            </div>
            <span className="hidden sm:inline text-xs font-display text-muted-foreground tabular-nums">
              {format(new Date(), "EEE, MMM d")}
            </span>
          </header>

          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminShell;
