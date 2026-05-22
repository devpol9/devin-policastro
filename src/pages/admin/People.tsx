import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Search, Plus, Star, Calendar, Mail, Phone, Building2, MapPin, X, UserPlus, Tag, Trash2, BellOff, Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type NurtureMeta = { step?: number; last_sent_at?: string; unsubscribed?: boolean };
type Person = {
  id: string; user_id: string;
  name: string; email: string | null; phone: string | null;
  company: string | null; role: string | null; city: string | null;
  tags: string[]; notes: string | null; source: string | null;
  last_contacted_at: string | null;
  relationship_strength: number | null;
  meta: { nurture?: NurtureMeta; [k: string]: any } | null;
};


type Filter = "all" | "stale" | "strong" | "leads";

const StarRow = ({ value, onChange, size = 14 }: { value: number; onChange?: (n: number) => void; size?: number }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map((n) => (
      <button
        key={n} type="button"
        onClick={onChange ? () => onChange(n === value ? 0 : n) : undefined}
        disabled={!onChange}
        className={onChange ? "hover:scale-110 transition-transform" : ""}
      >
        <Star size={size} className={n <= value ? "fill-accent text-accent" : "text-muted-foreground/40"} />
      </button>
    ))}
  </div>
);

const staleDays = (iso: string | null) => iso == null ? 9999 : (Date.now() - new Date(iso).getTime()) / 86400000;

const PeoplePage = () => {
  const [params, setParams] = useSearchParams();
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selected, setSelected] = useState<Person | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("people")
      .select("*")
      .order("last_contacted_at", { ascending: false, nullsFirst: false });
    if (error) toast.error("Failed to load");
    setPeople((data as Person[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Deep link ?person=<id>
  useEffect(() => {
    const id = params.get("person");
    if (id && people.length > 0) {
      const p = people.find((x) => x.id === id);
      if (p) setSelected(p);
    }
  }, [params, people]);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    people.forEach((p) => p.tags?.forEach((t) => s.add(t)));
    return [...s].sort();
  }, [people]);

  const filtered = useMemo(() => {
    let rows = people;
    if (filter === "stale") rows = rows.filter((p) => (p.relationship_strength ?? 0) >= 3 && staleDays(p.last_contacted_at) > 30);
    if (filter === "strong") rows = rows.filter((p) => (p.relationship_strength ?? 0) >= 4);
    if (filter === "leads") rows = rows.filter((p) => p.tags?.includes("lead"));
    if (activeTag) rows = rows.filter((p) => p.tags?.includes(activeTag));
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter((p) =>
        [p.name, p.email, p.company, p.role, p.city, (p.tags || []).join(" ")]
          .filter(Boolean).join(" ").toLowerCase().includes(q)
      );
    }
    return rows;
  }, [people, query, filter, activeTag]);

  const openPerson = (p: Person) => {
    setSelected(p);
    setParams({ person: p.id }, { replace: true });
  };
  const closePerson = () => {
    setSelected(null);
    params.delete("person"); setParams(params, { replace: true });
  };

  const updatePerson = async (patch: Partial<Person>) => {
    if (!selected) return;
    const { error } = await supabase.from("people").update(patch).eq("id", selected.id);
    if (error) { toast.error("Save failed"); return; }
    const merged = { ...selected, ...patch } as Person;
    setSelected(merged);
    setPeople((arr) => arr.map((p) => p.id === merged.id ? merged : p));
  };

  const markContacted = () => updatePerson({ last_contacted_at: new Date().toISOString() });

  const deletePerson = async () => {
    if (!selected) return;
    if (!confirm(`Delete ${selected.name}? This can't be undone.`)) return;
    const { error } = await supabase.from("people").delete().eq("id", selected.id);
    if (error) { toast.error("Delete failed"); return; }
    setPeople((arr) => arr.filter((p) => p.id !== selected.id));
    toast.success("Deleted");
    closePerson();
  };

  return (
    <AdminGuard>
      <AdminShell>
        <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
          <div>
            <h1 className="font-display font-black text-3xl sm:text-4xl tracking-[-0.02em]">
              <span className="accent-headline">People</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">{people.length} contacts · the connector ledger</p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="h-9 px-3 rounded-md bg-foreground text-background text-xs font-display font-semibold flex items-center gap-1.5"
          >
            <Plus size={14} /> Add person
          </button>
        </div>

        <div className="panel p-3 mb-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, email, company, tag…"
                className="w-full pl-8 pr-3 h-9 rounded-md bg-secondary/40 border border-border/40 text-sm outline-none focus:border-accent"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["all", "stale", "strong", "leads"] as Filter[]).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`text-[11px] font-display px-2.5 py-1 rounded-md border transition-colors ${
                  filter === f ? "bg-foreground text-background border-foreground" : "border-border/40 text-muted-foreground hover:text-foreground"
                }`}>
                {f === "all" ? "Everyone" : f === "stale" ? "Stale (30d+)" : f === "strong" ? "Strong (★4+)" : "Leads"}
              </button>
            ))}
            {allTags.length > 0 && <span className="text-muted-foreground/40 mx-1">·</span>}
            {allTags.slice(0, 12).map((t) => (
              <button key={t} onClick={() => setActiveTag(activeTag === t ? null : t)}
                className={`text-[11px] font-display px-2 py-1 rounded-md border transition-colors flex items-center gap-1 ${
                  activeTag === t ? "bg-accent/15 border-accent/40 text-foreground" : "border-border/30 text-muted-foreground hover:text-foreground"
                }`}>
                <Tag size={9} /> {t}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="panel p-10 text-center">
            <p className="text-sm text-muted-foreground">No matches.</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((p) => {
              const days = staleDays(p.last_contacted_at);
              const isStale = (p.relationship_strength ?? 0) >= 3 && days > 30;
              return (
                <button key={p.id} onClick={() => openPerson(p)}
                  className="panel p-4 text-left hover:border-accent/40 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="min-w-0">
                      <h3 className="font-display font-bold text-base truncate">{p.name}</h3>
                      {(p.role || p.company) && (
                        <p className="text-[11px] text-muted-foreground truncate">
                          {[p.role, p.company].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                    {p.relationship_strength ? <StarRow value={p.relationship_strength} size={11} /> : null}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-2">
                    <span>
                      {p.last_contacted_at ? formatDistanceToNow(new Date(p.last_contacted_at), { addSuffix: true }) : "never contacted"}
                    </span>
                    {isStale && <span className="text-accent font-display">stale</span>}
                  </div>
                  {p.tags?.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {p.tags.slice(0, 4).map((t) => (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-secondary/40 border border-border/30 text-foreground/70">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}

        {/* Detail drawer */}
        <Dialog open={!!selected} onOpenChange={(o) => { if (!o) closePerson(); }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-lenis-prevent>
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">{selected.name}</DialogTitle>
                  <DialogDescription className="text-xs">
                    {[selected.role, selected.company, selected.city].filter(Boolean).join(" · ") || "Contact detail"}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="text-[10px] font-display tracking-[0.1em] text-muted-foreground">STRENGTH</div>
                    <StarRow value={selected.relationship_strength ?? 0} onChange={(n) => updatePerson({ relationship_strength: n })} />
                    <span className="text-[11px] text-muted-foreground ml-auto">
                      <Calendar size={10} className="inline mr-1" />
                      {selected.last_contacted_at ? formatDistanceToNow(new Date(selected.last_contacted_at), { addSuffix: true }) : "never"}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <Field label="Email" icon={Mail} value={selected.email ?? ""} onSave={(v) => updatePerson({ email: v || null })} type="email" />
                    <Field label="Phone" icon={Phone} value={selected.phone ?? ""} onSave={(v) => updatePerson({ phone: v || null })} />
                    <Field label="Company" icon={Building2} value={selected.company ?? ""} onSave={(v) => updatePerson({ company: v || null })} />
                    <Field label="Role" icon={UserPlus} value={selected.role ?? ""} onSave={(v) => updatePerson({ role: v || null })} />
                    <Field label="City" icon={MapPin} value={selected.city ?? ""} onSave={(v) => updatePerson({ city: v || null })} />
                    <Field label="Tags (comma sep)" icon={Tag} value={(selected.tags || []).join(", ")}
                      onSave={(v) => updatePerson({ tags: v.split(",").map(s=>s.trim()).filter(Boolean) })} />
                  </div>

                  <div>
                    <label className="text-[10px] font-display tracking-[0.1em] text-muted-foreground">NOTES</label>
                    <textarea
                      defaultValue={selected.notes ?? ""}
                      onBlur={(e) => { if (e.target.value !== (selected.notes ?? "")) updatePerson({ notes: e.target.value || null }); }}
                      rows={4} placeholder="Context, last conversation, intros owed…"
                      className="mt-1 w-full bg-secondary/40 border border-border/40 rounded-md p-2 text-sm outline-none focus:border-accent resize-none"
                    />
                  </div>

                  {(selected.tags?.includes("lead-magnet") || selected.meta?.nurture) && (
                    <NurtureControl person={selected} onUpdate={updatePerson} />
                  )}


                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/30">
                    <button onClick={markContacted}
                      className="px-3 py-2 rounded-md bg-accent text-accent-foreground text-xs font-display font-semibold">
                      Mark contacted today
                    </button>
                    {selected.email && (
                      <a href={`mailto:${selected.email}`}
                        className="px-3 py-2 rounded-md border border-border/40 text-xs font-display font-semibold hover:bg-secondary/40">
                        Email
                      </a>
                    )}
                    {selected.phone && (
                      <a href={`tel:${selected.phone}`}
                        className="px-3 py-2 rounded-md border border-border/40 text-xs font-display font-semibold hover:bg-secondary/40">
                        Call
                      </a>
                    )}
                    <button onClick={deletePerson}
                      className="ml-auto px-2.5 py-2 rounded-md text-xs font-display text-red-500/80 hover:bg-red-500/10 flex items-center gap-1">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <CreatePersonDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={load} />
      </AdminShell>
    </AdminGuard>
  );
};

const Field = ({ label, icon: Icon, value, onSave, type = "text" }: {
  label: string; icon: any; value: string; onSave: (v: string) => void; type?: string;
}) => {
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value]);
  return (
    <div>
      <label className="text-[10px] font-display tracking-[0.1em] text-muted-foreground flex items-center gap-1">
        <Icon size={9} /> {label}
      </label>
      <input
        type={type} value={v} onChange={(e) => setV(e.target.value)}
        onBlur={() => { if (v !== value) onSave(v); }}
        className="mt-1 w-full bg-secondary/40 border border-border/40 rounded-md px-2 py-1.5 text-sm outline-none focus:border-accent"
      />
    </div>
  );
};

const CreatePersonDialog = ({ open, onOpenChange, onCreated }: {
  open: boolean; onOpenChange: (o: boolean) => void; onCreated: () => void;
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!name.trim()) { toast.error("Name required"); return; }
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) { toast.error("Not signed in"); setSaving(false); return; }
    const { error } = await supabase.from("people").insert({
      user_id: u.user.id, name: name.trim(),
      email: email.trim() || null, company: company.trim() || null,
      tags: tags.split(",").map(s => s.trim()).filter(Boolean),
      source: "manual",
    });
    setSaving(false);
    if (error) { toast.error("Failed"); return; }
    toast.success("Added");
    setName(""); setEmail(""); setCompany(""); setTags("");
    onOpenChange(false); onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-lenis-prevent>
        <DialogHeader>
          <DialogTitle className="font-display">Add person</DialogTitle>
          <DialogDescription className="text-xs">Quick add — open the person card to fill in the rest.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <input placeholder="Name *" value={name} onChange={(e) => setName(e.target.value)} autoFocus
            className="w-full bg-secondary/40 border border-border/40 rounded-md px-3 py-2 text-sm outline-none focus:border-accent" />
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email"
            className="w-full bg-secondary/40 border border-border/40 rounded-md px-3 py-2 text-sm outline-none focus:border-accent" />
          <input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)}
            className="w-full bg-secondary/40 border border-border/40 rounded-md px-3 py-2 text-sm outline-none focus:border-accent" />
          <input placeholder="Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)}
            className="w-full bg-secondary/40 border border-border/40 rounded-md px-3 py-2 text-sm outline-none focus:border-accent" />
          <button onClick={submit} disabled={saving}
            className="w-full px-3 py-2 rounded-md bg-foreground text-background text-xs font-display font-semibold disabled:opacity-50">
            {saving ? "Saving…" : "Add person"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PeoplePage;
