import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Mail, Phone, Building2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Person {
  id: string; name: string; email: string | null; phone: string | null;
  company: string | null; role: string | null; notes: string | null;
  tags: string[]; last_contacted_at: string | null; created_at: string;
}

const PeoplePage = () => {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Person>>({});

  const { data: people = [], isLoading } = useQuery({
    queryKey: ["people", q],
    queryFn: async () => {
      let query = supabase.from("people").select("*").order("created_at", { ascending: false });
      if (q.trim()) query = query.ilike("name", `%${q.trim()}%`);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as Person[];
    },
  });

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
    setForm({}); setOpen(false);
    qc.invalidateQueries({ queryKey: ["people"] });
  };

  return (
    <AdminGuard>
      <AdminShell>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold">People</h2>
              <p className="text-xs text-muted-foreground mt-1">Your connector network. {people.length} contact{people.length === 1 ? "" : "s"}.</p>
            </div>
            <Button onClick={() => setOpen(true)} size="sm"><Plus size={14} className="mr-1" />Add</Button>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name…" className="pl-9" />
          </div>

          {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> :
           people.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border/40 rounded-lg">
              <p className="text-sm text-muted-foreground">No people yet. Use ⌘K and say "add person…" or click Add.</p>
            </div>
           ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {people.map((p) => (
                <div key={p.id} className="border border-border/40 rounded-lg p-4 hover:border-border transition-colors">
                  <div className="font-medium text-sm">{p.name}</div>
                  {p.role && p.company && <div className="text-xs text-muted-foreground mt-0.5">{p.role} · {p.company}</div>}
                  {p.role && !p.company && <div className="text-xs text-muted-foreground mt-0.5">{p.role}</div>}
                  {!p.role && p.company && <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><Building2 size={11} />{p.company}</div>}
                  <div className="mt-3 space-y-1">
                    {p.email && <a href={`mailto:${p.email}`} className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1.5"><Mail size={10} />{p.email}</a>}
                    {p.phone && <a href={`tel:${p.phone}`} className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1.5"><Phone size={10} />{p.phone}</a>}
                  </div>
                  {p.notes && <p className="text-[11px] text-muted-foreground mt-3 line-clamp-3">{p.notes}</p>}
                </div>
              ))}
            </div>
           )}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
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
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminShell>
    </AdminGuard>
  );
};

export default PeoplePage;
