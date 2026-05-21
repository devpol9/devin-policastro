import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Plus, Search, Mail, Phone, Building2, Star, Clock, ArrowRight,
  Sparkles, X, Check, Inbox,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { format, formatDistanceToNowStrict } from "date-fns";
import TabBar from "@/components/admin/TabBar";

interface Person {
  id: string; name: string; email: string | null; phone: string | null;
  company: string | null; role: string | null; notes: string | null;
  tags: string[]; last_contacted_at: string | null; created_at: string;
  relationship_strength: number | null; source: string | null; city: string | null;
}

interface Intro {
  id: string;
  from_person_id: string | null;
  to_person_id: string | null;
  status: string;
  context: string | null;
  note: string | null;
  outcome: string | null;
  follow_up_at: string | null;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  proposed: "bg-muted text-muted-foreground",
  sent: "bg-amber-500/15 text-amber-700",
  connected: "bg-emerald-500/15 text-emerald-700",
  closed: "bg-secondary text-secondary-foreground",
};

const StaleFilter = ({ value, onChange }: { value: 0 | 30 | 60 | 90; onChange: (v: 0 | 30 | 60 | 90) => void }) => (
  <div className="flex gap-1">
    {([0, 30, 60, 90] as const).map((d) => (
      <button
        key={d}
        onClick={() => onChange(d)}
        className={`text-[10px] px-2 py-1 rounded border ${value === d ? "border-foreground text-foreground" : "border-border/40 text-muted-foreground hover:text-foreground"}`}
      >
        {d === 0 ? "All" : `${d}d+ stale`}
      </button>
    ))}
  </div>
);

const Stars = ({ value, onChange, size = 14 }: { value: number | null; onChange?: (v: number) => void; size?: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        disabled={!onChange}
        onClick={() => onChange?.(n === value ? 0 : n)}
        className={`${(value ?? 0) >= n ? "text-accent" : "text-muted-foreground/30"} ${onChange ? "hover:scale-110 transition-transform" : ""}`}
      >
        <Star size={size} fill={(value ?? 0) >= n ? "currentColor" : "none"} />
      </button>
    ))}
  </div>
);

const PeoplePage = () => {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [stale, setStale] = useState<0 | 30 | 60 | 90>(0);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<Partial<Person>>({});
  const [detailId, setDetailId] = useState<string | null>(null);

  const { data: people = [], isLoading } = useQuery({
    queryKey: ["people"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("people")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as Person[];
    },
  });

  const allTags = useMemo(() => {
    const s = new Set<string>();
    people.forEach((p) => (p.tags ?? []).forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [people]);

  const filtered = useMemo(() => {
    const now = Date.now();
    return people.filter((p) => {
      if (q.trim() && !`${p.name} ${p.company ?? ""} ${p.role ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (tagFilter && !(p.tags ?? []).includes(tagFilter)) return false;
      if (stale > 0) {
        const ts = p.last_contacted_at ? new Date(p.last_contacted_at).getTime() : new Date(p.created_at).getTime();
        const days = (now - ts) / (1000 * 60 * 60 * 24);
        if (days < stale) return false;
      }
      return true;
    });
  }, [people, q, tagFilter, stale]);

  const sortedStale = useMemo(() => {
    if (stale === 0) return filtered;
    return [...filtered].sort((a, b) => (b.relationship_strength ?? 0) - (a.relationship_strength ?? 0));
  }, [filtered, stale]);

  const save = async () => {
    if (!form.name?.trim()) { toast.error("Name required"); return; }
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const { error } = await supabase.from("people").insert({
      user_id: userData.user.id,
      name: form.name.trim(),
      email: form.email || null,
      phone: form.phone || null,
      company: form.company || null,
      role: form.role || null,
      notes: form.notes || null,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Person added");
    setForm({}); setAddOpen(false);
    qc.invalidateQueries({ queryKey: ["people"] });
  };

  return (
    <AdminGuard>
      <AdminShell>
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold">People</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Your connector network. {people.length} contact{people.length === 1 ? "" : "s"} ·{" "}
                {people.filter((p) => (p.relationship_strength ?? 0) >= 4).length} key relationships
              </p>
            </div>
            <Button onClick={() => setAddOpen(true)} size="sm"><Plus size={14} className="mr-1" />Add</Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, company, role…" className="pl-9" />
            </div>
            <StaleFilter value={stale} onChange={setStale} />
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground/70 mr-1">Tags:</span>
              {allTags.map((t) => (
                <button
                  key={t}
                  onClick={() => setTagFilter(tagFilter === t ? null : t)}
                  className={`text-[10px] px-2 py-0.5 rounded border ${tagFilter === t ? "border-accent text-accent bg-accent/10" : "border-border/40 text-muted-foreground hover:text-foreground"}`}
                >
                  {t}
                </button>
              ))}
              {tagFilter && (
                <button onClick={() => setTagFilter(null)} className="text-[10px] text-muted-foreground hover:text-foreground">clear</button>
              )}
            </div>
          )}

          {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> :
           sortedStale.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border/40 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {people.length === 0 ? "No people yet. Use ⌘K and say \"add person…\" or click Add." : "No matches for these filters."}
              </p>
            </div>
           ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sortedStale.map((p) => {
                const last = p.last_contacted_at ?? p.created_at;
                const days = Math.floor((Date.now() - new Date(last).getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <button
                    key={p.id}
                    onClick={() => setDetailId(p.id)}
                    className="text-left border border-border/40 rounded-lg p-3 sm:p-4 hover:border-accent/60 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="font-medium text-sm flex-1 truncate">{p.name}</div>
                      <Stars value={p.relationship_strength} size={11} />
                    </div>
                    {(p.role || p.company) && (
                      <div className="text-xs text-muted-foreground truncate">
                        {[p.role, p.company].filter(Boolean).join(" · ")}
                      </div>
                    )}
                    <div className="mt-2 space-y-0.5">
                      {p.email && <span className="text-[11px] text-muted-foreground flex items-center gap-1.5 truncate"><Mail size={10} className="shrink-0" />{p.email}</span>}
                      {p.phone && <span className="text-[11px] text-muted-foreground flex items-center gap-1.5 truncate"><Phone size={10} className="shrink-0" />{p.phone}</span>}
                    </div>
                    {(p.tags ?? []).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {p.tags.slice(0, 3).map((t) => (
                          <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="mt-2 pt-2 border-t border-border/30 flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock size={10} />
                      <span className="truncate">
                        {days === 0 ? "Touched today" : `${days}d since ${p.last_contacted_at ? "contact" : "added"}`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
           )}
        </div>

        {/* Add person dialog */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent className="max-w-md" data-lenis-prevent>
            <DialogHeader><DialogTitle>Add person</DialogTitle></DialogHeader>
            <div className="grid gap-3 py-2">
              <Input placeholder="Name *" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
              <Input placeholder="Email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input placeholder="Phone" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Company" value={form.company || ""} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                <Input placeholder="Role" value={form.role || ""} onChange={(e) => setForm({ ...form, role: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Notes</Label>
                <Textarea rows={3} value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="How you met, what they need…" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button onClick={save}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <PersonDrawer
          personId={detailId}
          people={people}
          onClose={() => setDetailId(null)}
        />
      </AdminShell>
    </AdminGuard>
  );
};

// =============== Person detail drawer ===============

const PersonDrawer = ({ personId, people, onClose }: {
  personId: string | null;
  people: Person[];
  onClose: () => void;
}) => {
  const qc = useQueryClient();
  const person = people.find((p) => p.id === personId) ?? null;
  const [tab, setTab] = useState<"overview" | "intros" | "inquiries">("overview");
  const [introOpen, setIntroOpen] = useState(false);
  const [editingTags, setEditingTags] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const { data: intros = [] } = useQuery({
    queryKey: ["intros", personId],
    enabled: !!personId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("intros")
        .select("*")
        .or(`from_person_id.eq.${personId},to_person_id.eq.${personId}`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as Intro[];
    },
  });

  const { data: linkedInquiries = [] } = useQuery({
    queryKey: ["person-inquiries", personId, person?.email],
    enabled: !!personId && !!person?.email,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inquiries")
        .select("id, name, email, service_type, status, created_at")
        .ilike("email", person!.email!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const update = useMutation({
    mutationFn: async (patch: Partial<Person>) => {
      const { error } = await supabase.from("people").update(patch).eq("id", personId!);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["people"] });
    },
  });

  const markContacted = () => {
    update.mutate({ last_contacted_at: new Date().toISOString() }, {
      onSuccess: () => toast.success("Marked contacted today"),
    });
  };

  const updateIntroStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("intros").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["intros"] });
  };

  if (!person) return null;

  return (
    <Sheet open={!!personId} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto" data-lenis-prevent>
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between gap-3 pr-6">
            <span className="font-display text-xl">{person.name}</span>
            <Stars
              value={person.relationship_strength}
              onChange={(v) => update.mutate({ relationship_strength: v })}
            />
          </SheetTitle>
        </SheetHeader>

        <div className="mt-3">
          <TabBar<"overview" | "intros">
            value={tab}
            onChange={setTab}
            items={[
              { value: "overview", label: "Overview" },
              { value: "intros", label: "Intros", count: intros.length },
            ]}
          />
        </div>

        {tab === "overview" && (
          <div className="mt-5 space-y-5">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={markContacted}>
                <Check size={12} className="mr-1" /> Mark contacted today
              </Button>
              <Button size="sm" onClick={() => setIntroOpen(true)}>
                <Sparkles size={12} className="mr-1" /> Make intro
              </Button>
            </div>

            <div className="space-y-2 text-sm">
              {person.role && person.company && (
                <p className="text-muted-foreground">{person.role} · {person.company}</p>
              )}
              {person.email && (
                <a href={`mailto:${person.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <Mail size={12} />{person.email}
                </a>
              )}
              {person.phone && (
                <a href={`tel:${person.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <Phone size={12} />{person.phone}
                </a>
              )}
              {person.company && !person.role && (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Building2 size={12} />{person.company}
                </p>
              )}
              <p className="flex items-center gap-2 text-muted-foreground text-xs pt-2 border-t border-border/30">
                <Clock size={11} />
                Last contact: {person.last_contacted_at
                  ? formatDistanceToNowStrict(new Date(person.last_contacted_at), { addSuffix: true })
                  : "never recorded"}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs">Tags</Label>
                <button onClick={() => setEditingTags((v) => !v)} className="text-[10px] text-muted-foreground hover:text-foreground">
                  {editingTags ? "Done" : "Edit"}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(person.tags ?? []).map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-secondary text-foreground inline-flex items-center gap-1">
                    {t}
                    {editingTags && (
                      <button onClick={() => update.mutate({ tags: person.tags.filter((x) => x !== t) })} className="hover:text-destructive">
                        <X size={9} />
                      </button>
                    )}
                  </span>
                ))}
                {editingTags && (
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && tagInput.trim()) {
                        const next = Array.from(new Set([...(person.tags ?? []), tagInput.trim()]));
                        update.mutate({ tags: next });
                        setTagInput("");
                      }
                    }}
                    placeholder="add tag…"
                    className="text-[10px] px-2 py-0.5 rounded border border-dashed border-border/60 bg-transparent outline-none focus:border-accent"
                  />
                )}
                {(person.tags ?? []).length === 0 && !editingTags && (
                  <span className="text-[10px] text-muted-foreground italic">No tags</span>
                )}
              </div>
            </div>

            <div>
              <Label className="text-xs">Notes</Label>
              <Textarea
                rows={5}
                defaultValue={person.notes ?? ""}
                onBlur={(e) => {
                  if (e.target.value !== (person.notes ?? "")) {
                    update.mutate({ notes: e.target.value }, { onSuccess: () => toast.success("Saved") });
                  }
                }}
                placeholder="What you remember, what they need, how you can help…"
                className="mt-1"
              />
            </div>
          </div>
        )}

        {tab === "intros" && (
          <div className="mt-5 space-y-3">
            <Button size="sm" onClick={() => setIntroOpen(true)} className="w-full">
              <Sparkles size={12} className="mr-1" /> Make new intro from {person.name.split(" ")[0]}
            </Button>

            {intros.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">No intros tracked yet.</p>
            ) : (
              <div className="space-y-2">
                {intros.map((i) => {
                  const isFrom = i.from_person_id === personId;
                  const otherId = isFrom ? i.to_person_id : i.from_person_id;
                  const other = people.find((p) => p.id === otherId);
                  return (
                    <div key={i.id} className="border border-border/40 rounded-md p-3 text-xs space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-medium">{person.name.split(" ")[0]}</span>
                          <ArrowRight size={10} className="text-muted-foreground" />
                          <span className="font-medium">{other?.name ?? "unknown"}</span>
                        </div>
                        <select
                          value={i.status}
                          onChange={(e) => updateIntroStatus(i.id, e.target.value)}
                          className={`text-[10px] px-1.5 py-0.5 rounded ${STATUS_COLORS[i.status] ?? STATUS_COLORS.proposed} border-0 outline-none`}
                        >
                          <option value="proposed">proposed</option>
                          <option value="sent">sent</option>
                          <option value="connected">connected</option>
                          <option value="closed">closed</option>
                        </select>
                      </div>
                      {i.context && <p className="text-muted-foreground">{i.context}</p>}
                      {i.note && <p className="text-muted-foreground italic">"{i.note}"</p>}
                      <p className="text-[10px] text-muted-foreground/70">
                        {formatDistanceToNowStrict(new Date(i.created_at), { addSuffix: true })}
                        {i.follow_up_at && ` · follow up ${i.follow_up_at}`}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <MakeIntroDialog
          open={introOpen}
          onOpenChange={setIntroOpen}
          fromPerson={person}
          allPeople={people}
          onCreated={() => qc.invalidateQueries({ queryKey: ["intros"] })}
        />
      </SheetContent>
    </Sheet>
  );
};

// =============== Make intro dialog ===============

const MakeIntroDialog = ({
  open, onOpenChange, fromPerson, allPeople, onCreated,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  fromPerson: Person;
  allPeople: Person[];
  onCreated: () => void;
}) => {
  const [toId, setToId] = useState<string>("");
  const [context, setContext] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!toId) { toast.error("Pick someone to introduce them to"); return; }
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { setSaving(false); return; }
    const { error } = await supabase.from("intros").insert({
      user_id: userData.user.id,
      from_person_id: fromPerson.id,
      to_person_id: toId,
      status: "proposed",
      context: context.trim() || null,
      follow_up_at: followUp || null,
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Intro queued");
    setToId(""); setContext(""); setFollowUp("");
    onOpenChange(false);
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-lenis-prevent>
        <DialogHeader>
          <DialogTitle>Make intro from {fromPerson.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div>
            <Label className="text-xs">Introduce to</Label>
            <select
              value={toId}
              onChange={(e) => setToId(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm outline-none focus:border-accent"
            >
              <option value="">Pick a person…</option>
              {allPeople.filter((p) => p.id !== fromPerson.id).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}{p.company ? ` (${p.company})` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-xs">Why / context</Label>
            <Textarea
              rows={3}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="What's the reason for the intro? What do they each get out of it?"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Follow-up date (optional)</Label>
            <Input type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} className="mt-1" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={saving}>{saving ? "Saving…" : "Queue intro"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PeoplePage;
