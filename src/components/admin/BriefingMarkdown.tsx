import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Plus, FileText, ListChecks, Lightbulb, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";

const stripMarkdown = (s: string) =>
  s.replace(/\*\*(.+?)\*\*/g, "$1").replace(/`(.+?)`/g, "$1").replace(/\[(.+?)\]\(.+?\)/g, "$1").trim();

const extractText = (children: any): string => {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (children?.props?.children) return extractText(children.props.children);
  return "";
};

const ActionPopover = ({ text }: { text: string }) => {
  const [busy, setBusy] = useState(false);
  const clean = stripMarkdown(text).slice(0, 240);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  };

  const addPriority = async () => {
    setBusy(true);
    try {
      const user = await getUser();
      if (!user) throw new Error("Not authenticated");
      const today = new Date().toISOString().slice(0, 10);
      const { data: existing } = await supabase
        .from("priorities_today")
        .select("slot")
        .eq("user_id", user.id)
        .eq("priority_date", today);
      const used = new Set((existing ?? []).map((p) => p.slot));
      const slot = [1, 2, 3].find((s) => !used.has(s));
      if (!slot) { toast.error("All 3 priority slots full today"); return; }
      const { error } = await supabase.from("priorities_today").insert({
        user_id: user.id, priority_date: today, slot, title: clean,
      });
      if (error) throw error;
      toast.success(`Added as today's priority #${slot}`);
    } catch (e: any) { toast.error(e.message ?? "Failed"); }
    finally { setBusy(false); }
  };

  const addNote = async (kind: "note" | "idea" | "intro") => {
    setBusy(true);
    try {
      const user = await getUser();
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("quick_captures").insert({
        user_id: user.id,
        kind,
        body: clean,
        tags: ["from-briefing"],
      });
      if (error) throw error;
      toast.success(`Saved as ${kind}`);
    } catch (e: any) { toast.error(e.message ?? "Failed"); }
    finally { setBusy(false); }
  };

  const addProject = async () => {
    setBusy(true);
    try {
      const user = await getUser();
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("projects").insert({
        user_id: user.id,
        title: clean.slice(0, 100),
        description: clean.length > 100 ? clean : null,
        status: "backlog",
        priority: "medium",
        source_type: "briefing",
      });
      if (error) throw error;
      toast.success("Project created");
    } catch (e: any) { toast.error(e.message ?? "Failed"); }
    finally { setBusy(false); }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center w-5 h-5 rounded border border-border/40 text-muted-foreground hover:text-accent hover:border-accent ml-1 align-middle"
          title="Promote this item"
        >
          <Plus size={11} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="start">
        <button onClick={addPriority} disabled={busy} className="w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded hover:bg-secondary text-left">
          <ListChecks size={12} /> Today's priority
        </button>
        <button onClick={addProject} disabled={busy} className="w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded hover:bg-secondary text-left">
          <FileText size={12} /> New project
        </button>
        <button onClick={() => addNote("note")} disabled={busy} className="w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded hover:bg-secondary text-left">
          <Lightbulb size={12} /> Keep as note
        </button>
        <button onClick={() => addNote("intro")} disabled={busy} className="w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded hover:bg-secondary text-left">
          <Sparkles size={12} /> Intro idea
        </button>
      </PopoverContent>
    </Popover>
  );
};

const BriefingMarkdown = ({ content }: { content: string }) => {
  return (
    <article className="prose prose-sm max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-a:text-accent">
      <ReactMarkdown
        components={{
          li: ({ children, ...props }: any) => {
            const text = extractText(children);
            return (
              <li {...props} className="group">
                <span className="align-middle">{children}</span>
                {text.trim().length > 5 && <ActionPopover text={text} />}
              </li>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
};

export default BriefingMarkdown;
