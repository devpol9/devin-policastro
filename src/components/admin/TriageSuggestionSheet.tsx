import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ListChecks, Users, LineChart, StickyNote, Lightbulb, Sparkles } from "lucide-react";
import { useTriageCapture, type TriageResult, type TriageCategory } from "@/hooks/use-triage";

interface Props {
  captureId: string | null;
  body?: string;
  onClose: () => void;
}

const CATEGORY_META: Record<TriageCategory, { label: string; icon: any; color: string }> = {
  task: { label: "Task", icon: ListChecks, color: "text-emerald-400" },
  person: { label: "Person", icon: Users, color: "text-sky-400" },
  kpi: { label: "KPI", icon: LineChart, color: "text-amber-400" },
  idea: { label: "Idea", icon: Lightbulb, color: "text-violet-400" },
  note: { label: "Note", icon: StickyNote, color: "text-muted-foreground" },
};

const TriageSuggestionSheet = ({ captureId, body, onClose }: Props) => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const triage = useTriageCapture();
  const [result, setResult] = useState<TriageResult | null>(null);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    if (!captureId) return;
    setResult(null);
    triage.mutateAsync(captureId).then((r) => setResult(r.triage)).catch((e) => {
      toast.error(e.message ?? "Couldn't triage");
      onClose();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captureId]);

  if (!captureId) return null;

  const cat = result?.category ?? "note";
  const Meta = CATEGORY_META[cat];

  const markPromoted = async (extra: Record<string, unknown> = {}) => {
    await supabase
      .from("quick_captures")
      .update({ archived: true, promoted_at: new Date().toISOString(), ...extra })
      .eq("id", captureId);
    qc.invalidateQueries({ queryKey: ["captures"] });
  };

  const promoteToProject = async () => {
    if (!result) return;
    setActing(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const title = result.task?.title || result.suggested_title || (body ?? "").split("\n")[0].slice(0, 80);
      const { data: project, error } = await supabase
        .from("projects")
        .insert({
          user_id: u.user.id,
          title,
          description: body ?? null,
          priority: result.task?.priority ?? "medium",
          status: "active",
          source_type: "capture",
          source_id: captureId,
          tags: result.tags ?? [],
        })
        .select()
        .single();
      if (error) throw error;
      await markPromoted({ promoted_project_id: project.id });
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created");
      onClose();
      navigate(`/hq/projects?project=${project.id}`);
    } catch (e: any) {
      toast.error(e.message ?? "Couldn't promote");
    } finally { setActing(false); }
  };

  const addPerson = async () => {
    if (!result?.person) return;
    setActing(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const { data: person, error } = await supabase
        .from("people")
        .insert({
          user_id: u.user.id,
          name: result.person.name || result.suggested_title,
          email: result.person.email ?? null,
          company: result.person.company ?? null,
          notes: result.person.context ?? body ?? null,
          source: "capture",
          tags: result.tags ?? [],
        })
        .select()
        .single();
      if (error) throw error;
      await markPromoted();
      qc.invalidateQueries({ queryKey: ["people"] });
      toast.success("Added to people");
      onClose();
      navigate(`/hq/people?person=${person.id}`);
    } catch (e: any) {
      toast.error(e.message ?? "Couldn't add person");
    } finally { setActing(false); }
  };

  const goLogKpi = async () => {
    setActing(true);
    try {
      await markPromoted();
      toast.success("Open KPIs to log entry");
      onClose();
      navigate("/hq/kpis");
    } finally { setActing(false); }
  };

  const keepAsNote = () => { toast.success("Kept as note"); onClose(); };

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="rounded-t-xl max-h-[90vh] overflow-y-auto" data-lenis-prevent>
        <SheetHeader>
          <SheetTitle className="text-left font-display text-base flex items-center gap-2">
            <Sparkles size={14} className="text-accent" /> Where does this belong?
          </SheetTitle>
        </SheetHeader>

        {!result ? (
          <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground justify-center">
            <Loader2 size={14} className="animate-spin" /> Reading the room…
          </div>
        ) : (
          <>
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <Meta.icon size={12} className={Meta.color} /> {Meta.label}
              </Badge>
              {result.tags?.slice(0, 4).map((t) => (
                <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
              ))}
            </div>
            <p className="text-sm text-foreground/90 mt-2 font-medium">{result.suggested_title}</p>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {cat === "task" && (
                <Button onClick={promoteToProject} disabled={acting} className="justify-start gap-2 h-auto py-3">
                  <ListChecks size={14} />
                  <span className="text-left leading-tight">
                    <span className="block text-xs font-semibold">Create project</span>
                    <span className="block text-[10px] opacity-80">Routes to /hq/projects</span>
                  </span>
                </Button>
              )}
              {cat === "person" && (
                <Button onClick={addPerson} disabled={acting} className="justify-start gap-2 h-auto py-3">
                  <Users size={14} />
                  <span className="text-left leading-tight">
                    <span className="block text-xs font-semibold">Add to People</span>
                    <span className="block text-[10px] opacity-80">{result.person?.name ?? "New contact"}</span>
                  </span>
                </Button>
              )}
              {cat === "kpi" && (
                <Button onClick={goLogKpi} disabled={acting} className="justify-start gap-2 h-auto py-3">
                  <LineChart size={14} />
                  <span className="text-left leading-tight">
                    <span className="block text-xs font-semibold">Log KPI entry</span>
                    <span className="block text-[10px] opacity-80">{result.kpi?.name ?? "Pick a metric"}</span>
                  </span>
                </Button>
              )}
              {cat === "idea" && (
                <Button onClick={promoteToProject} disabled={acting} variant="outline" className="justify-start gap-2 h-auto py-3">
                  <ListChecks size={14} />
                  <span className="text-left leading-tight">
                    <span className="block text-xs font-semibold">Make it a project</span>
                    <span className="block text-[10px] opacity-70">Don't let this rot</span>
                  </span>
                </Button>
              )}
              <Button onClick={keepAsNote} disabled={acting} variant="outline" className="justify-start gap-2 h-auto py-3">
                <StickyNote size={14} />
                <span className="text-left leading-tight">
                  <span className="block text-xs font-semibold">Keep as {cat === "idea" ? "idea" : "note"}</span>
                  <span className="block text-[10px] opacity-70">Stays in captures</span>
                </span>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default TriageSuggestionSheet;
