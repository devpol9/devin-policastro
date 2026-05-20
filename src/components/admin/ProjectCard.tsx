import { useNavigate } from "react-router-dom";
import { format, formatDistanceToNowStrict, isPast, parseISO } from "date-fns";
import { Calendar, CheckSquare } from "lucide-react";
import VenturePill from "./VenturePill";
import { useVentures } from "@/hooks/use-ventures";
import { useSubtasks, type Project } from "@/hooks/use-projects";

const PRIORITY_STYLES: Record<string, string> = {
  urgent: "text-destructive border-destructive/40 bg-destructive/10",
  high: "text-accent border-accent/40 bg-accent/10",
  medium: "text-muted-foreground border-border bg-secondary/40",
  low: "text-muted-foreground/70 border-border/40 bg-transparent",
};

interface Props {
  project: Project;
  compact?: boolean;
  onClick?: () => void;
}

const ProjectCard = ({ project, compact, onClick }: Props) => {
  const navigate = useNavigate();
  const { ventures } = useVentures();
  const venture = ventures.find((v) => v.id === project.venture_id);
  const accent = venture?.accent_color ?? "hsl(30 8% 50%)";

  // Subtask progress (best-effort; tiny query, cached)
  const { data: subtasks = [] } = useSubtasks(project.id);
  const done = subtasks.filter((s) => s.completed).length;
  const total = subtasks.length;

  const handleClick = onClick ?? (() => navigate(`/hq/projects/${project.id}`));

  const due = project.due_date ? parseISO(project.due_date) : null;
  const overdue = due && isPast(due) && project.status !== "done";

  const tags = project.tags ?? [];
  const visibleTags = tags.slice(0, 2);
  const extra = tags.length - visibleTags.length;

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full text-left glass-card p-3 sm:p-4 group transition-all hover:-translate-y-0.5"
      style={{
        borderLeft: `3px solid ${accent}`,
        boxShadow: `0 0 0 1px hsl(var(--border) / 0.4)`,
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        {venture ? (
          <VenturePill venture={venture} clickable={false} />
        ) : (
          <span className="text-[10px] font-mono text-muted-foreground">unassigned</span>
        )}
        <span
          className={`text-[9px] font-display font-semibold tracking-[0.12em] px-1.5 py-0.5 rounded border ${PRIORITY_STYLES[project.priority] ?? PRIORITY_STYLES.medium}`}
        >
          {project.priority}
        </span>
      </div>

      <h4 className={`font-display font-semibold text-foreground leading-snug line-clamp-2 ${compact ? "text-sm" : "text-sm sm:text-base"}`}>
        {project.title}
      </h4>

      {(due || total > 0 || visibleTags.length > 0) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-muted-foreground">
          {due && (
            <span className={`inline-flex items-center gap-1 ${overdue ? "text-destructive" : ""}`}>
              <Calendar size={11} />
              {overdue
                ? `Overdue ${formatDistanceToNowStrict(due)}`
                : `in ${formatDistanceToNowStrict(due)}`}
            </span>
          )}
          {total > 0 && (
            <span className="inline-flex items-center gap-1">
              <CheckSquare size={11} />
              {done}/{total}
            </span>
          )}
          {visibleTags.map((t) => (
            <span key={t} className="px-1.5 py-0.5 rounded bg-secondary/60 text-foreground/70">
              {t}
            </span>
          ))}
          {extra > 0 && <span>+{extra}</span>}
        </div>
      )}

      {project.percent_complete > 0 && (
        <div className="mt-3 h-1 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${project.percent_complete}%`,
              background: accent,
            }}
          />
        </div>
      )}
    </button>
  );
};

export default ProjectCard;
