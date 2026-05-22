import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle2, AlertCircle, ArrowRight, Edit3 } from "lucide-react";
import AdminGuard from "@/components/admin/AdminGuard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type State = "saving" | "ready" | "saved" | "error";

const ShareInner = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState<State>("saving");
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");

  // Pull what the share sheet gave us
  const sharedTitle = params.get("title") || "";
  const sharedText = params.get("text") || "";
  const sharedUrl = params.get("url") || "";

  // If the URL came mashed into `text` (iOS does this), pull it out
  const urlFromText = (() => {
    if (sharedUrl) return sharedUrl;
    const match = sharedText.match(/https?:\/\/\S+/);
    return match ? match[0] : "";
  })();

  const composedBody = (() => {
    const parts: string[] = [];
    if (sharedText && sharedText !== urlFromText) parts.push(sharedText.trim());
    if (urlFromText) parts.push(urlFromText.trim());
    return parts.join("\n\n").trim();
  })();

  useEffect(() => {
    setTitle(sharedTitle);
    setBody(composedBody);

    // Nothing came in (e.g. user opened the shortcut directly) — let them type
    if (!sharedTitle && !sharedText && !sharedUrl) {
      setState("ready");
      return;
    }

    save(composedBody, sharedTitle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (b: string, t: string) => {
    if (!b.trim()) {
      setState("ready");
      return;
    }
    setState("saving");
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        toast.error("Sign in first.");
        navigate("/hq/login");
        return;
      }
      const { error } = await supabase.from("quick_captures").insert({
        user_id: userData.user.id,
        kind: "note",
        title: t.trim() || null,
        body: b.trim(),
        tags: ["shared"],
        meta: { source: "share-target" },
      });
      if (error) throw error;
      setState("saved");
      toast.success("Captured.");
    } catch (err) {
      console.error(err);
      setState("error");
      toast.error("Couldn't save. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md border border-border/40 rounded-lg p-6 sm:p-8 bg-card/40">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
            {state === "saving" && <Loader2 size={18} className="animate-spin text-accent" />}
            {state === "saved" && <CheckCircle2 size={18} className="text-accent" />}
            {state === "ready" && <Edit3 size={18} className="text-accent" />}
            {state === "error" && <AlertCircle size={18} className="text-destructive" />}
          </div>
          <div>
            <h1 className="text-lg font-display font-bold leading-tight">
              {state === "saving" && "Saving to HQ…"}
              {state === "saved" && "Saved to HQ"}
              {state === "ready" && "Capture to HQ"}
              {state === "error" && "Save failed"}
            </h1>
            <p className="text-xs text-muted-foreground">Quick capture inbox</p>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="w-full bg-background border border-border/60 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-foreground"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What's this about?"
            rows={6}
            className="w-full bg-background border border-border/60 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-foreground resize-none"
          />
        </div>

        <div className="flex gap-2">
          {state !== "saved" ? (
            <button
              onClick={() => save(body, title)}
              disabled={state === "saving" || !body.trim()}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-display font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all disabled:opacity-60"
            >
              {state === "saving" ? "Saving…" : "Save"}
              {state !== "saving" && <ArrowRight size={14} />}
            </button>
          ) : (
            <button
              onClick={() => navigate("/hq/today")}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-display font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all"
            >
              Go to Today
              <ArrowRight size={14} />
            </button>
          )}
          <button
            onClick={() => navigate("/hq/notes")}
            className="px-4 py-2.5 rounded-md text-sm font-display font-semibold border border-border/60 hover:bg-card transition-all"
          >
            Inbox
          </button>
        </div>
      </div>
    </div>
  );
};

const SharePage = () => (
  <AdminGuard>
    <ShareInner />
  </AdminGuard>
);

export default SharePage;
