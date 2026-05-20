import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Mail, Phone, Clock, Filter, RefreshCw, Search } from "lucide-react";
import { format, subDays } from "date-fns";
import { toast } from "sonner";
import AdminShell from "@/components/admin/AdminShell";
import SectionHeader from "@/components/SectionHeader";

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

const Inquiries = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showConverted, setShowConverted] = useState(false);

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
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!inq.name.toLowerCase().includes(q) && !inq.email.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const serviceTypes = [...new Set(inquiries.map((i) => i.service_type))];

  return (
    <AdminShell>
      <SectionHeader
        as="h1"
        numeral="00"
        eyebrow="Control Room"
        title={<>Inquiry <span className="italic font-light text-accent">dashboard.</span></>}
        description={`${total} total across every service line. Filter, triage, and update status inline.`}
      />

      <div className="flex flex-wrap gap-3 mb-5">
        {[
          { label: "Total", value: total },
          { label: "New", value: newCount },
          { label: "This week", value: weekCount },
        ].map((m) => (
          <div key={m.label} className="glass-card px-4 py-2 flex items-baseline gap-2">
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
        <div className="grid gap-3">
          {filtered.map((inq, i) => {
            const serviceColor = SERVICE_COLORS[inq.service_type] || "24 32% 52%";
            const statusColor = STATUS_COLORS[inq.status] || "24 32% 52%";
            return (
              <motion.div
                key={inq.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                className="rounded-lg p-4 sm:p-5 cursor-pointer"
                style={{
                  background: `linear-gradient(145deg, hsl(36 30% 99% / 0.95) 0%, hsl(33 20% 95% / 0.8) 100%)`,
                  border: `1px solid hsl(${serviceColor} / 0.2)`,
                }}
                onClick={() => navigate(`/hq/inquiries/${inq.id}`)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-display font-semibold tracking-[0.06em]"
                        style={{
                          background: `hsl(${serviceColor} / 0.15)`,
                          color: `hsl(${serviceColor})`,
                          border: `1px solid hsl(${serviceColor} / 0.25)`,
                        }}
                      >
                        {inq.service_type.replace(" Inquiry", "")}
                      </span>
                      {inq.converted_project_id && (
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/hq/projects/${inq.converted_project_id}`); }}
                          className="px-2 py-0.5 rounded text-[10px] font-display font-semibold tracking-[0.06em] border border-accent/40 text-accent bg-accent/10 hover:bg-accent/20"
                        >
                          → project
                        </button>
                      )}
                      {(inq.form_data as any)?.chat_session_id && (
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-display font-semibold tracking-[0.06em] border border-border bg-secondary text-muted-foreground"
                          title="Converted from chat session"
                        >
                          💬 from chat
                        </span>
                      )}
                      <select
                        value={inq.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateStatus(inq.id, e.target.value)}
                        className="px-2 py-0.5 rounded text-[10px] font-display font-semibold tracking-[0.06em] bg-transparent cursor-pointer"
                        style={{
                          color: `hsl(${statusColor})`,
                          border: `1px solid hsl(${statusColor} / 0.3)`,
                        }}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="in-progress">In Progress</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    <h3 className="font-display font-black text-xl sm:text-2xl leading-[0.95] tracking-[-0.02em] mb-1" style={{ color: `hsl(${serviceColor})` }}>{inq.name}.</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Mail size={12} /> {inq.email}</span>
                      {inq.phone && <span className="flex items-center gap-1"><Phone size={12} /> {inq.phone}</span>}
                      <span className="flex items-center gap-1"><Clock size={12} /> {format(new Date(inq.created_at), "MMM d, yyyy h:mm a")}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
};

export default Inquiries;
