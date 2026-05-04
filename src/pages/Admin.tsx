import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { LogOut, Mail, Phone, Clock, Filter, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

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

const Admin = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filter, setFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin-login");
        return;
      }

      // Check admin role
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin");

      if (!roles || roles.length === 0) {
        toast.error("Access denied. You are not an admin.");
        await supabase.auth.signOut();
        navigate("/admin-login");
        return;
      }

      setIsAdmin(true);
      fetchInquiries();
    };

    checkAuth();
  }, [navigate]);

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
    const { error } = await supabase
      .from("inquiries")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
      );
      toast.success(`Status updated to ${newStatus}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  const filteredInquiries = inquiries.filter((inq) => {
    if (filter !== "all" && inq.service_type !== filter) return false;
    if (statusFilter !== "all" && inq.status !== statusFilter) return false;
    return true;
  });

  const serviceTypes = [...new Set(inquiries.map((i) => i.service_type))];

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Checking access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display font-extrabold text-xl">Inquiry Dashboard</h1>
            <p className="text-muted-foreground text-xs">{inquiries.length} total inquiries</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchInquiries}
              className="p-2 rounded-lg hover:bg-card transition-colors"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-card/80 text-sm font-display transition-colors"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex items-center gap-2 mr-4">
            <Filter size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-display  tracking-wider">Service:</span>
          </div>
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-display transition-colors ${
              filter === "all" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
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
            <span className="text-xs text-muted-foreground font-display  tracking-wider">Status:</span>
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
        </div>

        {/* Inquiries grid */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading inquiries...</div>
        ) : filteredInquiries.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No inquiries found{filter !== "all" || statusFilter !== "all" ? " with current filters" : ""}.
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredInquiries.map((inq, i) => {
              const serviceColor = SERVICE_COLORS[inq.service_type] || "24 32% 52%";
              const statusColor = STATUS_COLORS[inq.status] || "24 32% 52%";

              return (
                <motion.div
                  key={inq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-lg p-4 sm:p-5 transition-all duration-300"
                  style={{
                    background: `linear-gradient(145deg, hsl(36 30% 99% / 0.95) 0%, hsl(33 20% 95% / 0.8) 100%)`,
                    border: `1px solid hsl(${serviceColor} / 0.2)`,
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                    {/* Left: Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-display font-semibold  tracking-wider"
                          style={{
                            background: `hsl(${serviceColor} / 0.15)`,
                            color: `hsl(${serviceColor})`,
                            border: `1px solid hsl(${serviceColor} / 0.25)`,
                          }}
                        >
                          {inq.service_type.replace(" Inquiry", "")}
                        </span>
                        <select
                          value={inq.status}
                          onChange={(e) => updateStatus(inq.id, e.target.value)}
                          className="px-2 py-0.5 rounded text-[10px] font-display font-semibold  tracking-wider bg-transparent cursor-pointer"
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

                      <h3 className="font-display font-bold text-sm mb-1">{inq.name}</h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                        <a href={`mailto:${inq.email}`} className="flex items-center gap-1 hover:text-foreground transition-colors">
                          <Mail size={12} /> {inq.email}
                        </a>
                        {inq.phone && (
                          <a href={`tel:${inq.phone}`} className="flex items-center gap-1 hover:text-foreground transition-colors">
                            <Phone size={12} /> {inq.phone}
                          </a>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {format(new Date(inq.created_at), "MMM d, yyyy h:mm a")}
                        </span>
                      </div>

                      {/* Form data */}
                      <div className="space-y-1.5">
                        {Object.entries(inq.form_data).map(([key, value]) => {
                          if (!value) return null;
                          return (
                            <div key={key} className="text-xs">
                              <span className="text-muted-foreground font-display  tracking-wider text-[10px]">
                                {key}:
                              </span>{" "}
                              <span className="text-foreground/80">{value}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
