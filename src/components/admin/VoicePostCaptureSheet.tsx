import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Flag, StickyNote, Sparkles, Loader2 } from "lucide-react";
import { format } from "date-fns";

export interface VoiceCaptured {
  id: string;
  title: string | null;
  body: string;
}

const VoicePostCaptureSheet = ({
  capture,
  onClose,
}: {
  capture: VoiceCaptured | null;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);

  if (!capture) return null;

  const promoteToPriority = async () => {
    setBusy(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not signed in");
      const today = format(new Date(), "yyyy-MM-dd");
      const { data: existing } = await supabase
        .from("priorities_today")
        .select("slot, title")
        .eq("user_id", userData.user.id)
        .eq("priority_date", today);
      const taken = new Set((existing ?? []).filter((p: any) => p.title).map((p: any) => p.slot));
      const slot = [1, 2, 3].find((s) => !taken.has(s));
      if (!slot) { toast.error("All 3 priority slots are full"); setBusy(false); return; }
      const title = capture.title || capture.body.split("\n")[0].slice(0, 80);
      const { error } = await supabase
        .from("priorities_today")
        .upsert(
          { user_id: userData.user.id, priority_date: today, slot, title, completed: false },
          { onConflict: "user_id,priority_date,slot" },
        );
      if (error) throw error;
      await supabase
        .from("quick_captures")
        .update({ tags: ["voice", "promoted"], archived: true })
        .eq("id", capture.id);
      qc.invalidateQueries({ queryKey: ["captures"] });
      toast.success(`Added as priority ${slot}`);
      onClose();
    } catch (e: any) {
      toast.error(e.message ?? "Couldn't promote");
    } finally { setBusy(false); }
  };

  const routeToIntro = async () => {
    setBusy(true);
    try {
      await supabase
        .from("quick_captures")
        .update({ kind: "intro", tags: ["voice", "intro"] })
        .eq("id", capture.id);
      qc.invalidateQueries({ queryKey: ["captures"] });
      toast.success("Tagged as intro idea");
      onClose();
      navigate("/hq/people");
    } catch (e: any) {
      toast.error(e.message ?? "Couldn't route");
    } finally { setBusy(false); }
  };

  const keepAsNote = () => {
    toast.success("Kept as note");
    onClose();
  };

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="rounded-t-xl max-h-[90vh] overflow-y-auto" data-lenis-prevent>
        <SheetHeader>
          <SheetTitle className="text-left font-display text-base">
            {capture.title || "Voice captured"}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-3 rounded-md border border-border/40 bg-secondary/30 p-3 max-h-40 overflow-y-auto">
          <p className="text-sm whitespace-pre-wrap text-foreground/90">{capture.body}</p>
        </div>

        <p className="text-[11px] text-muted-foreground mt-3 mb-2">Where does this belong?</p>
        <div className="grid gap-2 sm:grid-cols-3">
          <Button onClick={promoteToPriority} disabled={busy} variant="default" className="justify-start gap-2 h-auto py-3">
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Flag size={14} />}
            <span className="text-left leading-tight">
              <span className="block text-xs font-semibold">Today's priority</span>
              <span className="block text-[10px] opacity-80">Push to next open slot</span>
            </span>
          </Button>
          <Button onClick={keepAsNote} disabled={busy} variant="outline" className="justify-start gap-2 h-auto py-3">
            <StickyNote size={14} />
            <span className="text-left leading-tight">
              <span className="block text-xs font-semibold">Keep as note</span>
              <span className="block text-[10px] opacity-70">Stays in captures</span>
            </span>
          </Button>
          <Button onClick={routeToIntro} disabled={busy} variant="outline" className="justify-start gap-2 h-auto py-3">
            <Sparkles size={14} />
            <span className="text-left leading-tight">
              <span className="block text-xs font-semibold">Intro idea</span>
              <span className="block text-[10px] opacity-70">Tag & open People</span>
            </span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default VoicePostCaptureSheet;
