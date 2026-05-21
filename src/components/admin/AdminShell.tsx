import { ReactNode, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home, Mail, KanbanSquare, Building2, Calendar, BookOpen,
  TrendingUp, Lightbulb, BarChart3, MessageSquare, Settings,
  LogOut, Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar";
import NoteCaptureDialog from "@/components/admin/NoteCaptureDialog";
import MobileAdminNav from "@/components/admin/MobileAdminNav";
import HqCommandBar from "@/components/admin/HqCommandBar";

type NavItem = {
  label: string;
  icon: typeof Home;
  to: string;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "work",
    items: [
      { label: "Today", icon: Home, to: "/hq/today" },
      { label: "Inquiries", icon: Mail, to: "/hq/inquiries" },
      { label: "Projects", icon: KanbanSquare, to: "/hq/projects" },
      { label: "Ventures", icon: Building2, to: "/hq/ventures" },
      { label: "People", icon: Users, to: "/hq/people" },
    ],
  },
  {
    label: "output",
    items: [
      { label: "Content", icon: Calendar, to: "/hq/content" },
      { label: "KPIs", icon: TrendingUp, to: "/hq/kpis" },
      { label: "Analytics", icon: BarChart3, to: "/hq/analytics" },
      
    ],
  },
  {
    label: "capture",
    items: [
      { label: "Daily Log", icon: BookOpen, to: "/hq/log" },
      { label: "Notes & Ideas", icon: Lightbulb, to: "/hq/notes" },
    ],
  },
];

const pageTitleFor = (pathname: string): string => {
  if (pathname.startsWith("/hq/today")) return "Today";
  if (pathname.startsWith("/hq/inquiries")) return "Inquiries";
  if (pathname.startsWith("/hq/ventures")) return "Ventures";
  if (pathname.startsWith("/hq/people")) return "People";
  if (pathname.startsWith("/hq/projects")) return "Projects";
  if (pathname.startsWith("/hq/content")) return "Content";
  if (pathname.startsWith("/hq/analytics")) return "Analytics";
  if (pathname.startsWith("/hq/kpis")) return "KPIs";
  if (pathname.startsWith("/hq/log")) return "Daily Log";
  if (pathname.startsWith("/hq/notes")) return "Notes & Ideas";
  if (pathname.startsWith("/hq/settings/pillars")) return "Pillars";
  if (pathname.startsWith("/hq/settings")) return "Settings";
  return "DevHQ";
};

const AdminShell = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [newCount, setNewCount] = useState<number>(0);
  const [quickOpen, setQuickOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.shiftKey && (e.key === "N" || e.key === "n")) {
        e.preventDefault();
        setQuickOpen(true);
      }
      if (mod && !e.shiftKey && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setCmdOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    const onCustom = () => setQuickOpen(true);
    window.addEventListener("devhq:open-quick-capture", onCustom as EventListener);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("devhq:open-quick-capture", onCustom as EventListener);
    };
  }, []);

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
        <Sidebar collapsible="icon" className="hidden md:flex">
          <SidebarHeader className="px-4 py-5">
            <div className="font-display font-bold text-xl tracking-tight">
              Dev<span className="accent-headline">HQ.</span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            {navGroups.map((group) => (
              <SidebarGroup key={group.label}>
                <SidebarGroupLabel className="text-[10px] font-medium lowercase tracking-tight text-muted-foreground/60">
                  {group.label}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = location.pathname === item.to ||
                        (item.to !== "/" && location.pathname.startsWith(item.to));
                      return (
                        <SidebarMenuItem key={item.label}>
                          <SidebarMenuButton asChild isActive={active}>
                            <NavLink to={item.to} className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span className="flex-1">{item.label}</span>
                              {item.label === "Inquiries" && newCount > 0 && (
                                <span className="text-[10px] font-medium rounded-md bg-accent text-accent-foreground px-1.5 py-0.5 min-w-[18px] text-center">
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
            ))}

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
                <p className="text-[11px] text-muted-foreground truncate">{email}</p>
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
          <header className="sticky top-0 z-40 h-11 flex items-center gap-3 border-b border-border/40 bg-background/85 backdrop-blur-xl px-3 sm:px-6">
            <div className="hidden md:flex"><SidebarTrigger /></div>
            <h1 className="font-display font-semibold text-sm tracking-tight md:hidden">
              Dev<span className="accent-headline">HQ.</span>
            </h1>
            <h1 className="hidden md:block font-display font-semibold text-sm tracking-tight">
              {pageTitleFor(location.pathname)}
            </h1>
            <button
              onClick={() => setCmdOpen(true)}
              className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border/40 hover:border-border transition-colors"
              title="AI command bar (⌘K)"
            >
              <span>Ask HQ</span>
              <kbd className="hidden sm:inline text-[9px] opacity-60">⌘K</kbd>
            </button>
            <span className="text-[10px] font-medium text-muted-foreground/70 tabular-nums px-1.5 py-0.5 rounded border border-border/40">
              {format(new Date(), "EEE MMM d")}
            </span>
          </header>

          <main className="flex-1 pb-16 md:pb-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
              {children}
            </div>
          </main>
        </div>
      </div>
      <MobileAdminNav />
      <NoteCaptureDialog open={quickOpen} onOpenChange={setQuickOpen} />
      <HqCommandBar open={cmdOpen} onOpenChange={setCmdOpen} />
    </SidebarProvider>
  );
};

export default AdminShell;
