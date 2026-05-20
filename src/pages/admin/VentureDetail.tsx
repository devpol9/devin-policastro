import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, Pencil, ArrowLeft, Trash2 } from "lucide-react";
import { format, subDays } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import VentureDialog from "@/components/admin/VentureDialog";
import { getVentureIcon } from "@/components/admin/ventureIcons";
import { invalidateVentures, useVenture } from "@/hooks/use-ventures";
import { useProjects } from "@/hooks/use-projects";
import ProjectCard from "@/components/admin/ProjectCard";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

const STATUSES = ["active", "paused", "archived", "idea"];

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="glass-card p-4">
    <p className="font-mono text-[10px] text-muted-foreground tracking-[0.18em] uppercase">{label}</p>
    <p className="font-display font-bold text-2xl mt-1">{value}</p>
  </div>
);

const VentureDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: venture, isLoading } = useVenture(slug);

  const [editOpen, setEditOpen] = useState(false);
  const [inquiryCount, setInquiryCount] = useState(0);
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [notes, setNotes] = useState("");
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const { projects: ventureProjects } = useProjects(
    venture ? { venture_id: venture.id } : undefined
  );
  const activeProjects = ventureProjects.filter((p) => p.status !== "done" && p.status !== "archived");
  const kanbanCols = [
    { key: "backlog", label: "Backlog" },
    { key: "in_progress", label: "In progress" },
    { key: "blocked", label: "Blocked" },
  ];

  const accent = venture?.accent_color ?? "hsl(24 32% 52%)";
  const Icon = getVentureIcon(venture?.icon);

  // Inquiry match: case-insensitive contains on service_type for name or short_name
  useEffect(() => {
    if (!venture) return;
    const since = subDays(new Date(), 30).toISOString();
    const terms = [venture.name, venture.short_name].filter(Boolean) as string[];
    const orFilter = terms.map((t) => `service_type.ilike.%${t}%`).join(",");
    (async () => {
      const base = supabase.from("inquiries").select("*", { count: "exact" }).gte("created_at", since);
      const { data, count } = orFilter ? await base.or(orFilter) : await base.limit(0);
      setInquiryCount(count ?? 0);
      setRecentInquiries((data ?? []).slice(0, 5));
    })();
  }, [venture]);

  useEffect(() => {
    if (venture) {
      const meta = (venture.meta as any) || {};
      setNotes(meta.notes ?? "");
    }
  }, [venture]);

  const updateStatus = async (status: string) => {
    if (!venture) return;
    const { error } = await supabase.from("ventures").update({ status }).eq("id", venture.id);
    if (error) { toast.error(error.message); return; }
    invalidateVentures(qc);
    toast.success(`Status: ${status}`);
  };

  const saveNotes = async () => {
    if (!venture) return;
    const meta = { ...((venture.meta as any) || {}), notes };
    const { error } = await supabase.from("ventures").update({ meta }).eq("id", venture.id);
    if (error) { toast.error(error.message); return; }
    invalidateVentures(qc);
    setLastSaved(format(new Date(), "p"));
  };

  const archive = () => updateStatus("archived");

  const hardDelete = async () => {
    if (!venture || deleteConfirm !== venture.slug) return;
    const { error } = await supabase.from("ventures").delete().eq("id", venture.id);
    if (error) { toast.error(error.message); return; }
    invalidateVentures(qc);
    toast.success("Deleted");
    navigate("/hq/ventures");
  };

  const lastActivity = useMemo(() => {
    if (!venture) return "—";
    return format(new Date(venture.updated_at), "MMM d");
  }, [venture]);

  if (isLoading) {
    return (
      <AdminGuard><AdminShell><p className="text-sm text-muted-foreground">Loading…</p></AdminShell></AdminGuard>
    );
  }

  if (!venture) {
    return (
      <AdminGuard>
        <AdminShell>
          <div className="glass-card p-10 text-center">
            <p className="text-sm text-muted-foreground mb-4">Venture not found.</p>
            <Link to="/hq/ventures" className="text-sm font-display text-accent inline-flex items-center gap-1">
              <ArrowLeft size={14} /> Back to ventures
            </Link>
          </div>
        </AdminShell>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <AdminShell>
        <Link
          to="/hq/ventures"
          className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground mb-6"
        >
          <ArrowLeft size={12} /> all ventures
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-start gap-5 mb-8"
        >
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 border"
            style={{
              background: `color-mix(in oklch, ${accent} 14%, transparent)`,
              borderColor: `color-mix(in oklch, ${accent} 40%, transparent)`,
              color: accent,
            }}
          >
            <Icon size={32} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display font-black text-3xl tracking-tight" style={{ color: accent }}>
                {venture.name}
              </h1>
              {venture.short_name && (
                <span className="font-mono text-xs text-muted-foreground">{venture.short_name}</span>
              )}
            </div>
            {venture.description && (
              <p className="text-sm text-muted-foreground mt-1">{venture.description}</p>
            )}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Select value={venture.status} onValueChange={updateStatus}>
                <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {venture.website_url && (
                <a
                  href={venture.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 px-3 inline-flex items-center gap-1 rounded-md border border-border/60 text-xs font-display"
                >
                  <ExternalLink size={12} /> Visit
                </a>
              )}
              <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                <Pencil size={12} className="mr-1" /> Edit
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <Stat label="Active Projects" value={activeProjects.length} />
          <Stat label="Inquiries (30d)" value={inquiryCount} />
          <Stat label="Content Items" value={0} />
          <Stat label="Last activity" value={lastActivity} />
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-5 mt-5">
            <div className="glass-card p-5">
              <p className="font-mono text-[10px] text-muted-foreground tracking-[0.18em] mb-2">DESCRIPTION</p>
              <p className="text-sm">{venture.description || "No description."}</p>
            </div>
            <div className="glass-card p-5">
              <p className="font-mono text-[10px] text-muted-foreground tracking-[0.18em] mb-3">
                RECENT INQUIRIES (THIS VENTURE)
              </p>
              {recentInquiries.length === 0 ? (
                <p className="text-sm text-muted-foreground">No matching inquiries in the last 30 days.</p>
              ) : (
                <div className="space-y-2">
                  {recentInquiries.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => navigate(`/hq/inquiries/${r.id}`)}
                      className="w-full text-left flex items-center justify-between gap-3 p-2 rounded-md border border-border/40"
                    >
                      <div className="min-w-0">
                        <p className="font-display font-semibold text-sm truncate">{r.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{r.service_type}</p>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {format(new Date(r.created_at), "MMM d")}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-mono text-[10px] text-muted-foreground tracking-[0.18em]">PROJECTS</p>
                <button
                  onClick={() => navigate(`/hq/projects?venture=${venture.id}`)}
                  className="text-xs font-display text-muted-foreground hover:text-accent"
                >
                  View all →
                </button>
              </div>
              {ventureProjects.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No projects yet. Create one from the Projects page.</p>
              ) : (
                <div className="grid md:grid-cols-3 gap-3">
                  {kanbanCols.map((col) => {
                    const items = ventureProjects.filter((p) => p.status === col.key).slice(0, 3);
                    return (
                      <div key={col.key} className="space-y-2">
                        <p className="font-mono text-[10px] text-muted-foreground tracking-[0.14em] uppercase">
                          {col.label} · {ventureProjects.filter((p) => p.status === col.key).length}
                        </p>
                        {items.length === 0 ? (
                          <p className="text-[11px] text-muted-foreground/60 italic">Empty</p>
                        ) : (
                          items.map((p) => <ProjectCard key={p.id} project={p} compact />)
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-5">
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-mono text-[10px] text-muted-foreground tracking-[0.18em]">NOTES</p>
                {lastSaved && (
                  <p className="text-[10px] font-mono text-muted-foreground">Last saved: {lastSaved}</p>
                )}
              </div>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={saveNotes}
                rows={12}
                placeholder="Anything to remember about this venture…"
              />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-5 mt-5">
            <div className="glass-card p-5">
              <p className="font-mono text-[10px] text-muted-foreground tracking-[0.18em] mb-3">EDIT VENTURE</p>
              <Button onClick={() => setEditOpen(true)} variant="outline">
                <Pencil size={12} className="mr-1" /> Open editor
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Edit name, color, icon, website, sort order, and more.
              </p>
            </div>
            <div className="glass-card p-5 border-destructive/40">
              <p className="font-mono text-[10px] text-destructive tracking-[0.18em] mb-3">DANGER ZONE</p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-display font-semibold">Archive venture</p>
                    <p className="text-xs text-muted-foreground">Hide from default view. Reversible.</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={archive} disabled={venture.status === "archived"}>
                    Archive
                  </Button>
                </div>
                <AlertDialog>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-display font-semibold">Delete permanently</p>
                      <p className="text-xs text-muted-foreground">Cannot be undone.</p>
                    </div>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm"><Trash2 size={12} className="mr-1" /> Delete</Button>
                    </AlertDialogTrigger>
                  </div>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this venture?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Type <span className="font-mono font-semibold">{venture.slug}</span> to confirm.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Input
                      value={deleteConfirm}
                      onChange={(e) => setDeleteConfirm(e.target.value)}
                      placeholder={venture.slug}
                    />
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setDeleteConfirm("")}>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={hardDelete}
                        disabled={deleteConfirm !== venture.slug}
                      >
                        Delete forever
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <VentureDialog open={editOpen} onOpenChange={setEditOpen} venture={venture} />
      </AdminShell>
    </AdminGuard>
  );
};

export default VentureDetail;
