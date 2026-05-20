import { format } from "date-fns";
import { ExternalLink, Inbox } from "lucide-react";
import { useCrossVentureInbox } from "@/hooks/use-cross-venture-inbox";
import { IZ_ADMIN_URL } from "@/integrations/impact-zone/client";

const VENTURE_META: Record<string, { label: string; color: string }> = {
  "impact-zone": { label: "IZ", color: "0 65% 50%" },
  "2thirty": { label: "230", color: "340 70% 60%" },
  valence: { label: "VLC", color: "210 75% 55%" },
};

export default function CrossVentureInbox({ compact = false }: { compact?: boolean }) {
  const { data, isLoading } = useCrossVentureInbox();
  const items = data || [];

  if (!isLoading && items.length === 0) return null;

  return (
    <div className="panel p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Inbox size={14} className="text-accent" />
          <h3 className="font-display font-black text-sm tracking-tight">
            Cross-venture inbox
          </h3>
          <span className="text-[10px] font-display tracking-[0.12em] text-muted-foreground uppercase">
            {items.length} need{items.length === 1 ? "s" : ""} you
          </span>
        </div>
        <a
          href={IZ_ADMIN_URL}
          target="_blank"
          rel="noreferrer"
          className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          IZ admin <ExternalLink size={11} />
        </a>
      </div>

      {isLoading ? (
        <div className="text-xs text-muted-foreground py-4">Loading…</div>
      ) : (
        <div className="divide-y divide-border/60">
          {(compact ? items.slice(0, 5) : items).map((i) => {
            const v = VENTURE_META[i.venture];
            return (
              <a
                key={i.id}
                href={IZ_ADMIN_URL}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 py-2 hover:bg-secondary/40 -mx-2 px-2 rounded transition-colors min-w-0"
              >
                <span
                  className="text-[9px] font-display font-black tracking-wider px-1.5 py-0.5 rounded shrink-0"
                  style={{
                    background: `hsl(${v.color} / 0.15)`,
                    color: `hsl(${v.color})`,
                  }}
                >
                  {v.label}
                </span>
                <span className="font-display font-semibold text-sm truncate min-w-0 sm:w-40">
                  {i.first_name} {i.last_name}
                </span>
                <span className="hidden sm:inline text-xs text-muted-foreground truncate flex-1 min-w-0">
                  {i.subject || i.inquiry_type}
                </span>
                <span
                  className="text-[10px] font-display tracking-wider shrink-0"
                  style={{
                    color:
                      i.reason === "assigned"
                        ? "hsl(24 32% 52%)"
                        : "hsl(var(--muted-foreground))",
                  }}
                  title={i.reason === "assigned" ? "Assigned to you" : "Mentions Devin"}
                >
                  {i.reason === "assigned" ? "Assigned" : "Mention"}
                </span>
                <span className="text-[11px] tabular-nums text-muted-foreground shrink-0 hidden sm:inline">
                  {format(new Date(i.created_at), "MMM d")}
                </span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
