import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Copy, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { createContent, invalidateContent } from "@/hooks/use-content";
import { useQueryClient } from "@tanstack/react-query";

type Idea = { hook: string; angle: string; platform: string; pillar?: string };

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

const IdeaGeneratorDialog = ({ open, onOpenChange }: Props) => {
  const qc = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [savingIdx, setSavingIdx] = useState<number | null>(null);

  const generate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("content-ideas");
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setIdeas(data?.ideas ?? []);
    } catch (e: any) {
      toast.error(e.message || "Failed to generate ideas");
    } finally {
      setLoading(false);
    }
  };

  const copyIdea = async (i: Idea) => {
    await navigator.clipboard.writeText(`${i.hook}\n\n${i.angle}`);
    toast.success("Copied");
  };

  const saveIdea = async (i: Idea, idx: number) => {
    setSavingIdx(idx);
    const created = await createContent({
      title: i.hook,
      hook: i.hook,
      notes: i.angle,
      platform: i.platform as any,
      content_type: "post",
      status: "idea",
      pillar: i.pillar || null,
      tags: ["ai-generated"],
      hashtags: [],
    });
    setSavingIdx(null);
    if (created) {
      toast.success("Saved as idea");
      invalidateContent(qc);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto" data-lenis-prevent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles size={18} className="text-primary" /> Idea generator
          </DialogTitle>
          <DialogDescription>
            Pulled from your last 20 captures + recent inbound. 5 hooks in your voice.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end">
          <Button onClick={generate} disabled={loading} size="sm">
            {loading ? <Loader2 size={14} className="mr-1 animate-spin" /> : <Sparkles size={14} className="mr-1" />}
            {ideas.length ? "Regenerate" : "Generate ideas"}
          </Button>
        </div>

        {loading && !ideas.length && (
          <div className="py-10 text-center text-sm text-muted-foreground">Thinking…</div>
        )}

        <div className="space-y-3 mt-2">
          {ideas.map((i, idx) => (
            <div key={idx} className="rounded-lg border border-border/60 bg-card/40 p-4">
              <div className="font-semibold text-foreground leading-snug">{i.hook}</div>
              <div className="text-sm text-muted-foreground mt-1.5">{i.angle}</div>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">{i.platform}</span>
                {i.pillar && (
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-primary/15 text-primary">{i.pillar}</span>
                )}
                <div className="ml-auto flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => copyIdea(i)}>
                    <Copy size={12} className="mr-1" /> Copy
                  </Button>
                  <Button size="sm" variant="outline" disabled={savingIdx === idx} onClick={() => saveIdea(i, idx)}>
                    {savingIdx === idx ? <Loader2 size={12} className="mr-1 animate-spin" /> : <Plus size={12} className="mr-1" />}
                    Save as idea
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IdeaGeneratorDialog;
