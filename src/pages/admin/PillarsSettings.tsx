import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useContentPillars, createPillar, updatePillar, deletePillar, invalidatePillars,
} from "@/hooks/use-content";

const PRESET_COLORS = [
  "hsl(24 32% 52%)","hsl(0 65% 50%)","hsl(340 70% 60%)","hsl(210 75% 55%)",
  "hsl(140 55% 45%)","hsl(270 35% 55%)","hsl(40 70% 50%)","hsl(180 50% 45%)",
];

const PillarsSettings = () => {
  const qc = useQueryClient();
  const { pillars, isLoading } = useContentPillars();
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [desc, setDesc] = useState("");

  const add = async () => {
    if (!name.trim()) return;
    const p = await createPillar({
      name: name.trim(), color, description: desc.trim() || null,
      sort_order: (pillars.length + 1) * 10,
    });
    if (p) {
      toast.success("Pillar added");
      setName(""); setDesc("");
      invalidatePillars(qc);
    }
  };

  const rename = async (id: string, next: string) => {
    if (!next.trim()) return;
    await updatePillar(id, { name: next.trim() });
    invalidatePillars(qc);
  };

  const recolor = async (id: string, c: string) => {
    await updatePillar(id, { color: c });
    invalidatePillars(qc);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this pillar?")) return;
    await deletePillar(id);
    invalidatePillars(qc);
    toast.success("Deleted");
  };

  return (
    <AdminGuard>
      <AdminShell>
        <Link to="/hq/content" className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground mb-4">
          <ArrowLeft size={12} /> back to content
        </Link>

        <h1 className="font-display font-black text-3xl tracking-tight mb-1">
          Content <span className="accent-headline">pillars.</span>
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          The themes you create around. Pillars color-code content across the app.
        </p>

        <div className="glass-card p-5 mb-6">
          <p className="text-[11px] text-muted-foreground/70 font-medium mb-3">NEW PILLAR</p>
          <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-2 items-end">
            <div>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name (e.g. Mindset)" />
            </div>
            <div>
              <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description (optional)" />
            </div>
            <Button onClick={add} disabled={!name.trim()}><Plus size={14} className="mr-1" /> Add</Button>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${color === c ? "border-foreground scale-110" : "border-transparent"}`}
                style={{ background: c }}
                aria-label={c}
              />
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <p className="text-[11px] text-muted-foreground/70 font-medium mb-3">
            ALL PILLARS · {pillars.length}
          </p>
          {isLoading ? (
            <p className="text-xs text-muted-foreground">Loading…</p>
          ) : pillars.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No pillars yet. Add one above.</p>
          ) : (
            <div className="space-y-2">
              {pillars.map((p) => (
                <div key={p.id} className="flex items-center gap-2 p-2 rounded border border-border/40">
                  <GripVertical size={12} className="text-muted-foreground/30" />
                  <div className="flex gap-1">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => recolor(p.id, c)}
                        className={`w-4 h-4 rounded-full border ${p.color === c ? "border-foreground" : "border-transparent"}`}
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                  <input
                    defaultValue={p.name}
                    onBlur={(e) => e.target.value !== p.name && rename(p.id, e.target.value)}
                    className="flex-1 bg-transparent text-sm font-display font-semibold outline-none"
                  />
                  <button
                    onClick={() => remove(p.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </AdminShell>
    </AdminGuard>
  );
};

export default PillarsSettings;
