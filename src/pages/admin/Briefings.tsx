import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNowStrict } from "date-fns";
import { Mail, Sparkles, Calendar } from "lucide-react";
import BriefingMarkdown from "@/components/admin/BriefingMarkdown";
import { toast } from "sonner";

interface Briefing {
  id: string;
  week_start: string;
  content: string;
  stats: Record<string, any>;
  emailed_at: string | null;
  created_at: string;
}

const BriefingsPage = () => {
  const qc = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const { data: briefings = [], isLoading } = useQuery({
    queryKey: ["briefings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("briefings")
        .select("*")
        .order("week_start", { ascending: false });
      if (error) throw error;
      return (data || []) as Briefing[];
    },
  });

  useEffect(() => {
    if (!selectedId && briefings.length > 0) setSelectedId(briefings[0].id);
  }, [briefings, selectedId]);

  const selected = briefings.find((b) => b.id === selectedId);

  const generateNow = async () => {
    setGenerating(true);
    try {
      const { error } = await supabase.functions.invoke("monday-briefing");
      if (error) throw error;
      toast.success("Briefing generated");
      qc.invalidateQueries({ queryKey: ["briefings"] });
    } catch (e: any) {
      toast.error(e.message ?? "Failed to generate");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AdminGuard>
      <AdminShell>
        <div className="flex items-start justify-between gap-3 mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold">Briefings</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Weekly executive summaries — auto-generated every Monday 7am ET.
            </p>
          </div>
          <Button size="sm" onClick={generateNow} disabled={generating}>
            <Sparkles size={14} className="mr-1" />
            {generating ? "Generating…" : "Generate this week"}
          </Button>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : briefings.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border/40 rounded-lg">
            <Calendar className="mx-auto mb-3 text-muted-foreground" size={32} />
            <p className="text-sm text-muted-foreground mb-4">No briefings yet — generate the first one.</p>
            <Button onClick={generateNow} disabled={generating}>
              <Sparkles size={14} className="mr-1" />
              {generating ? "Generating…" : "Generate now"}
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[260px_1fr] gap-4">
            <aside className="lg:space-y-1.5 flex lg:block gap-2 overflow-x-auto lg:overflow-visible -mx-4 px-4 lg:mx-0 lg:px-0 pb-2 lg:pb-0 scrollbar-thin snap-x snap-mandatory">
              {briefings.map((b) => {
                const active = b.id === selectedId;
                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedId(b.id)}
                    className={`shrink-0 lg:w-full snap-start min-w-[180px] lg:min-w-0 text-left p-3 rounded-lg border transition-colors ${
                      active ? "border-accent bg-accent/5" : "border-border/40 hover:border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-display font-semibold whitespace-nowrap">
                        Week of {format(new Date(b.week_start), "MMM d")}
                      </span>
                      {b.emailed_at ? (
                        <span title={`Emailed ${format(new Date(b.emailed_at), "PPp")}`} className="text-emerald-600">
                          <Mail size={11} />
                        </span>
                      ) : (
                        <span className="text-[9px] text-muted-foreground">draft</span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNowStrict(new Date(b.created_at), { addSuffix: true })}
                    </p>
                  </button>
                );
              })}
            </aside>

            <main className="panel p-4 sm:p-5 lg:p-6 min-h-[60vh]">
              {selected ? (
                <>
                  <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-border/40">
                    <div>
                      <h3 className="font-display font-bold text-lg">
                        Week of {format(new Date(selected.week_start), "MMMM d, yyyy")}
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Generated {format(new Date(selected.created_at), "PPp")}
                        {selected.emailed_at && ` · Emailed ${format(new Date(selected.emailed_at), "PPp")}`}
                      </p>
                    </div>
                  </div>

                  {selected.stats && Object.keys(selected.stats).length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                      {Object.entries(selected.stats).slice(0, 8).map(([k, v]) => (
                        <div key={k} className="border border-border/40 rounded-md p-2">
                          <p className="text-[9px] text-muted-foreground/70 lowercase truncate">{k.replace(/_/g, " ")}</p>
                          <p className="font-display font-bold text-base tabular-nums">{String(v)}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <BriefingMarkdown content={selected.content} />
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Select a briefing.</p>
              )}
            </main>
          </div>
        )}
      </AdminShell>
    </AdminGuard>
  );
};

export default BriefingsPage;
