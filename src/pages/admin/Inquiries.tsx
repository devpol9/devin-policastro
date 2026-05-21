import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Mail, Phone, Clock, Filter, RefreshCw, Search, FolderPlus, CheckSquare, Square, X } from "lucide-react";
import { format, subDays } from "date-fns";
import { toast } from "sonner";
import AdminShell from "@/components/admin/AdminShell";
import SectionHeader from "@/components/SectionHeader";
import CrossVentureInbox from "@/components/admin/CrossVentureInbox";
import ProjectDialog from "@/components/admin/ProjectDialog";
import { useVentures } from "@/hooks/use-ventures";
import { getVentureIcon } from "@/components/admin/ventureIcons";

interface Inquiry {
  id: string;
  service_type: string;
  name: string;
  email: string;
  phone: string | null;
  form_data: Record<string, any>;
  status: string;
  created_at: string;
  notes: string | null;
  converted_project_id: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  new: "24 32% 52%",
  contacted: "210 22% 50%",
  "in-progress": "270 16% 48%",
  closed: "140 60% 45%",
};

const SERVICE_COLORS: Record<string, string> = {
  "Manufacturing Inquiry": "270 16% 48%",
  "Content / Collab Inquiry": "350 22% 55%",
  "Automotive Inquiry": "0 75% 55%",
  "Financing Inquiry": "210 22% 50%",
  "Consulting Inquiry": "24 32% 52%",
  "Networking Inquiry": "160 60% 45%",
};

const inferVentureId = (
  inq: Pick<Inquiry, "service_type">,
  ventures: { id: string; name: string; short_name: string | null }[]
): string | null => {
  const st = (inq.service_type || "").toLowerCase();
  const match = ventures.find(
    (v) =>
      st.includes(v.name.toLowerCase()) ||
      (v.short_name && st.includes(v.short_name.toLowerCase()))
  );
  return match?.id ?? null;
};

const Inquiries = () => {
  const navigate = useNavigate();
  const { activeVentures } = useVentures();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ventureFilter, setVentureFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [showConverted, setShowConverted] = useState(false);
  const [convertTarget, setConvertTarget] = useState<Inquiry | null>(null);


  useEffect(() => { fetchInquiries(); }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      toast.error("Failed to load inquiries");
    } else {
      setInquiries((data as any[]) || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("inquiries").update({ status: newStatus }).eq("id", id);
    if (error) {
      toast.error("Failed to update status");
    } else {
      setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)));
      toast.success(`Status updated`);
    }
  };

  const weekAgo = subDays(new Date(), 7);
  const total = inquiries.length;
  const newCount = inquiries.filter((i) => i.status === "new").length;
  const weekCount = inquiries.filter((i) => new Date(i.created_at) >= weekAgo).length;

  const filtered = inquiries.filter((inq) => {
    if (!showConverted && inq.converted_project_id) return false;
    if (filter !== "all" && inq.service_type !== filter) return false;
    if (statusFilter !== "all" && inq.status !== statusFilter) return false;
    if (ventureFilter !== "all") {
      const vId = inferVentureId(inq, activeVentures);
      if (ventureFilter === "none" ? !!vId : vId !== ventureFilter) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!inq.name.toLowerCase().includes(q) && !inq.email.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const ventureCounts = (() => {
    const counts: Record<string, number> = { all: 0, none: 0 };
    activeVentures.forEach((v) => (counts[v.id] = 0));
    inquiries.forEach((inq) => {
      if (!showConverted && inq.converted_project_id) return;
      counts.all++;
      const vId = inferVentureId(inq, activeVentures);
      if (vId) counts[vId] = (counts[vId] || 0) + 1;
      else counts.none++;
    });
    return counts;
  })();


  const serviceTypes = [...new Set(inquiries.map((i) => i.service_type))];

  return (
    <AdminShell>
      <SectionHeader
        as="h1"
        numeral="00"
        eyebrow="Control Room"
        title={<>Inquiry <span className="accent-headline">dashboard.</span></>}
        description={`${total} total across every service line. Filter, triage, and update status inline.`}
      />

      <CrossVentureInbox />



      <div className="flex flex-wrap gap-3 mb-5">
        {[
          { label: "Total", value: total },
          { label: "New", value: newCount },
          { label: "This week", value: weekCount },
        ].map((m) => (
          <div key={m.label} className="panel px-4 py-2 flex items-baseline gap-2">
            <span className="font-display font-black text-lg tabular-nums">{m.value}</span>
            <span className="text-[10px] font-display tracking-[0.12em] text-muted-foreground">{m.label}</span>
          </div>
        ))}
        <button
          onClick={fetchInquiries}
          className="ml-auto p-2 rounded-md hover:bg-secondary transition-colors"
          title="Refresh"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="flex items-center gap-2 bg-secondary/40 border border-border/40 rounded-md px-3 py-2 mb-4">
        <Search size={14} className="text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email"
          className="bg-transparent text-sm outline-none flex-1"
        />
      </div>

      {/* Venture pill row — primary axis */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={() => setVentureFilter("all")}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-display border transition-colors ${
            ventureFilter === "all"
              ? "bg-foreground text-background border-foreground"
              : "bg-card text-muted-foreground border-border/60 hover:text-foreground"
          }`}
        >
          All ventures
          <span className="font-mono opacity-70">{ventureCounts.all}</span>
        </button>
        {activeVentures.map((v) => {
          const Icon = getVentureIcon(v.icon);
          const active = ventureFilter === v.id;
          const count = ventureCounts[v.id] || 0;
          return (
            <button
              key={v.id}
              onClick={() => setVentureFilter(active ? "all" : v.id)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-display border transition-colors"
              style={{
                background: active
                  ? `color-mix(in oklch, ${v.accent_color} 18%, transparent)`
                  : "transparent",
                borderColor: active
                  ? v.accent_color
                  : `color-mix(in oklch, ${v.accent_color} 30%, transparent)`,
                color: active ? v.accent_color : `color-mix(in oklch, ${v.accent_color} 80%, hsl(var(--muted-foreground)))`,
              }}
            >
              <Icon size={12} />
              {v.short_name || v.name}
              <span className="font-mono opacity-70">{count}</span>
            </button>
          );
        })}
        {ventureCounts.none > 0 && (
          <button
            onClick={() => setVentureFilter(ventureFilter === "none" ? "all" : "none")}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-display border transition-colors ${
              ventureFilter === "none"
                ? "bg-secondary text-foreground border-border"
                : "bg-card text-muted-foreground border-border/60 hover:text-foreground"
            }`}
          >
            Unmatched
            <span className="font-mono opacity-70">{ventureCounts.none}</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">

        <div className="flex items-center gap-2 mr-2">
          <Filter size={14} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-display tracking-[0.06em]">Service:</span>
        </div>
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-md text-xs font-display transition-colors ${
            filter === "all" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"
          }`}
        >All</button>
        {serviceTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1.5 rounded-md text-xs font-display transition-colors ${
              filter === type ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {type.replace(" Inquiry", "")}
          </button>
        ))}
        <div className="flex items-center gap-2 ml-4 mr-2">
          <span className="text-xs text-muted-foreground font-display tracking-[0.06em]">Status:</span>
        </div>
        {["all", "new", "contacted", "in-progress", "closed"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-md text-xs font-display transition-colors ${
              statusFilter === s ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <label className="ml-4 inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showConverted}
            onChange={(e) => setShowConverted(e.target.checked)}
            className="accent-accent"
          />
          Show converted
        </label>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Loading inquiries…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No inquiries match the current filters.</div>
      ) : (
        <div className="panel divide-y divide-border/60 overflow-hidden">
          {filtered.map((inq) => {
            const serviceColor = SERVICE_COLORS[inq.service_type] || "24 32% 52%";
            const statusColor = STATUS_COLORS[inq.status] || "24 32% 52%";
            return (
              <div
                key={inq.id}
                onClick={() => navigate(`/hq/inquiries/${inq.id}`)}
                className="group flex items-center gap-3 px-3 sm:px-4 h-11 cursor-pointer hover:bg-secondary/40 transition-colors min-w-0"
              >
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ background: `hsl(${serviceColor})` }}
                  title={inq.service_type.replace(" Inquiry", "")}
                />
                <span className="font-display font-semibold text-sm truncate min-w-0 flex-1 sm:flex-none sm:w-44">
                  {inq.name}
                </span>
                <span className="hidden sm:inline text-xs text-muted-foreground truncate flex-1 min-w-0">
                  {inq.email}
                </span>
                <span className="hidden md:inline text-[11px] text-muted-foreground shrink-0">
                  {inq.service_type.replace(" Inquiry", "")}
                </span>
                {inq.converted_project_id ? (
                  <span className="hidden md:inline text-[10px] text-accent shrink-0">→ project</span>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); setConvertTarget(inq); }}
                    title="Convert to project"
                    className="hidden md:inline-flex items-center justify-center h-6 w-6 rounded-md border border-border/40 text-muted-foreground hover:text-accent hover:border-accent/40 shrink-0"
                  >
                    <FolderPlus size={12} />
                  </button>
                )}
                <select
                  value={inq.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => updateStatus(inq.id, e.target.value)}
                  className="text-[11px] bg-transparent cursor-pointer rounded-md border px-1.5 py-0.5 shrink-0"
                  style={{ color: `hsl(${statusColor})`, borderColor: `hsl(${statusColor} / 0.3)` }}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="in-progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
                <span className="text-[11px] tabular-nums text-muted-foreground shrink-0 hidden sm:inline">
                  {format(new Date(inq.created_at), "MMM d")}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {convertTarget && (() => {
        const inq = convertTarget;
        const st = (inq.service_type || "").toLowerCase();
        const matches = activeVentures.filter(
          (v) =>
            st.includes(v.name.toLowerCase()) ||
            (v.short_name && st.includes(v.short_name.toLowerCase()))
        );
        const matchVentureId = matches.length === 1 ? matches[0].id : undefined;
        const descMarkdown = Object.entries(inq.form_data || {})
          .filter(([, v]) => v)
          .map(([k, v]) => `- **${k}**: ${String(v)}`)
          .join("\n");
        return (
          <ProjectDialog
            open={!!convertTarget}
            onOpenChange={(o) => !o && setConvertTarget(null)}
            stayOnCreate
            onCreated={async (project) => {
              await supabase
                .from("inquiries")
                .update({
                  converted_project_id: project.id,
                  status: ["new", "contacted"].includes(inq.status) ? "in-progress" : inq.status,
                })
                .eq("id", inq.id);
              setInquiries((prev) =>
                prev.map((i) =>
                  i.id === inq.id
                    ? { ...i, converted_project_id: project.id, status: ["new", "contacted"].includes(i.status) ? "in-progress" : i.status }
                    : i
                )
              );
              setConvertTarget(null);
              toast.success("Inquiry converted to project");
            }}
            defaults={{
              title: `${inq.name} — ${inq.service_type}`,
              description: descMarkdown,
              venture_id: matchVentureId,
              status: "planning",
              priority: "medium",
              source_type: "inquiry",
              source_id: inq.id,
            }}
          />
        );
      })()}
    </AdminShell>
  );
};

export default Inquiries;
