import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, Copy, Check, User, Sparkles, RefreshCw, PenLine, Send } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import ProjectDialog from "@/components/admin/ProjectDialog";
import LinkedPersonCard from "@/components/admin/LinkedPersonCard";
import { useVentures } from "@/hooks/use-ventures";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";


const SERVICE_COLORS: Record<string, string> = {
  "Manufacturing Inquiry": "270 16% 48%",
  "Content / Collab Inquiry": "350 22% 55%",
  "Automotive Inquiry": "0 75% 55%",
  "Financing Inquiry": "210 22% 50%",
  "Consulting Inquiry": "24 32% 52%",
  "Networking Inquiry": "160 60% 45%",
};

const InquiryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeVentures } = useVentures();
  const [inq, setInq] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState<string>("");
  const [convertOpen, setConvertOpen] = useState(false);
  const [briefLoading, setBriefLoading] = useState(false);
  const [draftOpen, setDraftOpen] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftTone, setDraftTone] = useState<"warm" | "balanced" | "direct">("balanced");
  const [draftSubject, setDraftSubject] = useState("");
  const [draftBody, setDraftBody] = useState("");

  const generateBrief = async (force = false) => {
    if (!id) return;
    setBriefLoading(true);
    const { data, error } = await supabase.functions.invoke("inquiry-brief", { body: { inquiry_id: id } });
    setBriefLoading(false);
    if (error || !data?.brief) { if (force) toast.error("Brief failed"); return; }
    setInq((prev: any) => ({
      ...prev,
      form_data: { ...(prev.form_data || {}), ai_brief: data.brief, ai_brief_generated_at: data.generated_at },
    }));
    if (force) toast.success("Brief regenerated");
  };

  const generateDraft = async (tone: "warm" | "balanced" | "direct" = draftTone) => {
    if (!id) return;
    setDraftLoading(true);
    setDraftTone(tone);
    const { data, error } = await supabase.functions.invoke("inquiry-reply-draft", {
      body: { inquiry_id: id, tone },
    });
    setDraftLoading(false);
    if (error || !data?.body) {
      toast.error(data?.error || "Draft failed");
      return;
    }
    setDraftSubject(data.subject || `Re: ${inq?.service_type ?? ""}`);
    setDraftBody(data.body);
  };

  const openDraft = async () => {
    setDraftOpen(true);
    if (!draftBody) await generateDraft();
  };

  const copyDraft = async () => {
    await navigator.clipboard.writeText(`${draftSubject}\n\n${draftBody}`);
    toast.success("Draft copied");
  };

  const openInMail = () => {
    if (!inq?.email) return;
    const url = `mailto:${encodeURIComponent(inq.email)}?subject=${encodeURIComponent(draftSubject)}&body=${encodeURIComponent(draftBody)}`;
    window.location.href = url;
  };



  useEffect(() => {
    if (!id) return;
    supabase
      .from("inquiries")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          toast.error("Inquiry not found");
          navigate("/hq/inquiries", { replace: true });
          return;
        }
        setInq(data);
        setNotes(data.notes ?? "");
        setLoading(false);
        if (!(data.form_data as any)?.ai_brief) generateBrief(false);
      });
  }, [id, navigate]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  void 0;


  const updateField = async (patch: Record<string, any>) => {
    if (!id) return false;
    const { error } = await supabase.from("inquiries").update(patch).eq("id", id);
    if (error) { toast.error("Save failed"); return false; }
    setInq((prev: any) => ({ ...prev, ...patch }));
    return true;
  };

  const saveNotes = async () => {
    if (!inq || notes === (inq.notes ?? "")) return;
    const ok = await updateField({ notes });
    if (ok) toast.success("Notes saved");
  };

  const copy = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    toast.success("Copied");
    setTimeout(() => setCopied(""), 1500);
  };

  if (loading || !inq) {
    return (
      <AdminGuard><AdminShell>
        <div className="flex items-center justify-center py-20">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        </div>
      </AdminShell></AdminGuard>
    );
  }

  const serviceColor = SERVICE_COLORS[inq.service_type] || "24 32% 52%";

  // Best-effort venture match
  const matchVentureId = (() => {
    const st = (inq.service_type || "").toLowerCase();
    const matches = activeVentures.filter(
      (v) =>
        st.includes(v.name.toLowerCase()) ||
        (v.short_name && st.includes(v.short_name.toLowerCase()))
    );
    return matches.length === 1 ? matches[0].id : undefined;
  })();

  const descMarkdown = Object.entries(inq.form_data || {})
    .filter(([, v]) => v)
    .map(([k, v]) => `- **${k}**: ${String(v)}`)
    .join("\n");

  const onProjectCreated = async (project: any) => {
    await updateField({
      converted_project_id: project.id,
      status: ["new", "contacted"].includes(inq.status) ? "in-progress" : inq.status,
    });
    toast.success("Inquiry converted to project");
  };

  return (
    <AdminGuard>
      <AdminShell>
        <Link to="/hq/inquiries" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 font-display">
          <ArrowLeft size={14} /> Back to inquiries
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 space-y-5">
            <div
              className="rounded-lg p-6"
              style={{
                background: `linear-gradient(145deg, hsl(36 30% 99% / 0.95) 0%, hsl(33 20% 95% / 0.8) 100%)`,
                border: `1px solid hsl(${serviceColor} / 0.25)`,
              }}
            >
              <span
                className="inline-block px-2 py-0.5 rounded text-[10px] font-display font-semibold tracking-[0.06em] mb-3"
                style={{
                  background: `hsl(${serviceColor} / 0.15)`,
                  color: `hsl(${serviceColor})`,
                  border: `1px solid hsl(${serviceColor} / 0.25)`,
                }}
              >
                {inq.service_type.replace(" Inquiry", "")}
              </span>
              <h1 className="font-display font-black text-3xl sm:text-4xl leading-[0.95] tracking-[-0.02em] mb-3" style={{ color: `hsl(${serviceColor})` }}>
                {inq.name}.
              </h1>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <label className="text-[10px] font-display tracking-[0.12em] text-muted-foreground">Status</label>
                <select
                  value={inq.status}
                  onChange={(e) => updateField({ status: e.target.value })}
                  className="px-2 py-1 rounded text-xs font-display bg-secondary/40 border border-border/40 cursor-pointer"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="in-progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
                {inq.converted_project_id && (
                  <Link
                    to={`/hq/projects/${inq.converted_project_id}`}
                    className="text-[10px] font-display text-accent border border-accent/40 rounded-md px-2 py-0.5"
                  >
                    → project
                  </Link>
                )}
              </div>
              <div className="space-y-1 text-sm">
                <a href={`mailto:${inq.email}`} className="flex items-center gap-2 text-foreground hover:text-accent">
                  <Mail size={14} /> {inq.email}
                </a>
                {inq.phone && (
                  <a href={`tel:${inq.phone}`} className="flex items-center gap-2 text-foreground hover:text-accent">
                    <Phone size={14} /> {inq.phone}
                  </a>
                )}
                <p className="text-xs text-muted-foreground pt-1">
                  Submitted {format(new Date(inq.created_at), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>

            <div className="panel p-5 relative overflow-hidden" style={{ borderColor: `hsl(${serviceColor} / 0.25)` }}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display font-bold text-lg flex items-center gap-2">
                  <Sparkles size={16} className="text-accent" /> AI brief
                </h2>
                <button
                  onClick={() => generateBrief(true)}
                  disabled={briefLoading}
                  className="text-[10px] font-display tracking-[0.08em] text-muted-foreground hover:text-foreground flex items-center gap-1 disabled:opacity-50"
                >
                  <RefreshCw size={11} className={briefLoading ? "animate-spin" : ""} /> {briefLoading ? "Generating" : "Regenerate"}
                </button>
              </div>
              {(inq.form_data as any)?.ai_brief ? (
                <>
                  <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {(inq.form_data as any).ai_brief}
                  </p>
                  {(inq.form_data as any)?.ai_brief_generated_at && (
                    <p className="text-[10px] text-muted-foreground/60 mt-3 font-display tracking-[0.06em]">
                      Generated {format(new Date((inq.form_data as any).ai_brief_generated_at), "MMM d, h:mm a")}
                    </p>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  {briefLoading ? "Reading inquiry, drafting brief…" : "No brief yet. Click regenerate."}
                </div>
              )}
            </div>

            <div className="panel p-5">
              <h2 className="font-display font-bold text-lg mb-3">Details</h2>
              <dl className="space-y-2">
                {Object.entries(inq.form_data || {}).map(([key, value]) => {
                  if (!value) return null;
                  if (["ai_brief", "ai_brief_generated_at", "person_id"].includes(key)) return null;
                  return (
                    <div key={key} className="grid grid-cols-3 gap-3 text-sm">
                      <dt className="text-[11px] font-display tracking-[0.08em] text-muted-foreground">{key}</dt>
                      <dd className="col-span-2 text-foreground/90 whitespace-pre-wrap">{String(value)}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </div>


          <div className="space-y-5">
            <LinkedPersonCard email={inq.email} personIdHint={inq.form_data?.person_id} />
            <div className="panel p-5">
              <h2 className="font-display font-bold text-base mb-3">Notes</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={saveNotes}
                rows={6}
                placeholder="Internal notes (saved on blur)…"
                className="w-full bg-secondary/40 border border-border/40 rounded-md p-2 text-sm outline-none focus:border-accent resize-none"
              />
            </div>

            <div className="panel p-5 space-y-2">
              <h2 className="font-display font-bold text-base mb-2">Quick actions</h2>
              <button
                onClick={() => updateField({ status: "contacted" }).then((ok) => ok && toast.success("Marked contacted"))}
                className="w-full px-3 py-2 rounded-md bg-secondary text-foreground text-xs font-display font-semibold hover:bg-secondary/70"
              >
                Mark as contacted
              </button>
              <button
                onClick={() => updateField({ status: "closed" }).then((ok) => ok && toast.success("Marked closed"))}
                className="w-full px-3 py-2 rounded-md bg-secondary text-foreground text-xs font-display font-semibold hover:bg-secondary/70"
              >
                Mark as closed
              </button>
              {inq.converted_project_id ? (
                <Link
                  to={`/hq/projects/${inq.converted_project_id}`}
                  className="block text-center w-full px-3 py-2 rounded-md bg-accent text-accent-foreground text-xs font-display font-semibold"
                >
                  View Project
                </Link>
              ) : (
                <button
                  onClick={() => setConvertOpen(true)}
                  className="w-full px-3 py-2 rounded-md bg-foreground text-background text-xs font-display font-semibold"
                >
                  Convert to Project
                </button>
              )}
              {inq.form_data?.person_id && (
                <Link
                  to={`/hq/people?person=${inq.form_data.person_id}`}
                  className="w-full px-3 py-2 rounded-md border border-border/40 text-foreground text-xs font-display font-semibold flex items-center justify-center gap-2 hover:bg-secondary/40"
                >
                  <User size={12} /> View contact
                </Link>
              )}
              <button
                onClick={() => copy(inq.email, "email")}
                className="w-full px-3 py-2 rounded-md border border-border/40 text-foreground text-xs font-display font-semibold flex items-center justify-center gap-2 hover:bg-secondary/40"
              >
                {copied === "email" ? <Check size={12} /> : <Copy size={12} />} Copy email
              </button>
              {inq.phone && (
                <button
                  onClick={() => copy(inq.phone, "phone")}
                  className="w-full px-3 py-2 rounded-md border border-border/40 text-foreground text-xs font-display font-semibold flex items-center justify-center gap-2 hover:bg-secondary/40"
                >
                  {copied === "phone" ? <Check size={12} /> : <Copy size={12} />} Copy phone
                </button>
              )}
            </div>
          </div>
        </motion.div>

        <ProjectDialog
          open={convertOpen}
          onOpenChange={setConvertOpen}
          stayOnCreate
          onCreated={onProjectCreated}
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
      </AdminShell>
    </AdminGuard>
  );
};

export default InquiryDetail;
