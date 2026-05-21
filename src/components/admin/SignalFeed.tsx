import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNowStrict, format, startOfDay, endOfDay, subDays, subHours } from "date-fns";
import { Mail, Users, Calendar, AlertTriangle, Sparkles, ArrowUpRight, Inbox } from "lucide-react";
import { motion } from "framer-motion";

type SignalKind = "inquiry" | "intro_overdue" | "stale_person" | "content_today" | "capture";

interface Signal {
  id: string;
  kind: SignalKind;
  title: string;
  meta: string;
  when: string; // ISO
  href: string;
  weight: number; // higher = sort first
}

const KIND_META: Record<SignalKind, { icon: any; label: string; tint: string }> = {
  inquiry:        { icon: Mail,           label: "New inquiry",   tint: "text-accent" },
  intro_overdue:  { icon: AlertTriangle,  label: "Intro overdue", tint: "text-amber-400" },
  stale_person:   { icon: Users,          label: "Going cold",    tint: "text-sky-400" },
  content_today:  { icon: Calendar,       label: "Scheduled",     tint: "text-violet-400" },
  capture:        { icon: Sparkles,       label: "Fresh idea",    tint: "text-emerald-400" },
};

const useSignals = () =>
  useQuery({
    queryKey: ["today-signals"],
    queryFn: async (): Promise<Signal[]> => {
      const now = new Date();
      const today = startOfDay(now);
      const dayEnd = endOfDay(now);
      const last48h = subHours(now, 48).toISOString();
      const staleCutoff = subDays(now, 30).toISOString();

      const [inqRes, introRes, staleRes, contentRes, capRes] = await Promise.all([
        supabase.from("inquiries")
          .select("id, name, service_type, created_at, status")
          .eq("status", "new")
          .gte("created_at", last48h)
          .order("created_at", { ascending: false })
          .limit(6),
        supabase.from("intros")
          .select("id, status, follow_up_at, context, to_person_id, from_person_id, updated_at")
          .in("status", ["proposed", "in_progress"])
          .not("follow_up_at", "is", null)
          .lte("follow_up_at", format(now, "yyyy-MM-dd"))
          .order("follow_up_at", { ascending: true })
          .limit(6),
        supabase.from("people")
          .select("id, name, last_contacted_at, relationship_strength")
          .gte("relationship_strength", 4)
          .or(`last_contacted_at.is.null,last_contacted_at.lte.${staleCutoff}`)
          .order("last_contacted_at", { ascending: true, nullsFirst: true })
          .limit(4),
        supabase.from("content_items")
          .select("id, title, platform, scheduled_at, status")
          .gte("scheduled_at", today.toISOString())
          .lte("scheduled_at", dayEnd.toISOString())
          .neq("status", "posted")
          .order("scheduled_at", { ascending: true })
          .limit(6),
        supabase.from("quick_captures")
          .select("id, title, body, kind, created_at")
          .eq("archived", false)
          .is("promoted_project_id", null)
          .in("kind", ["idea", "intro"])
          .gte("created_at", subHours(now, 24).toISOString())
          .order("created_at", { ascending: false })
          .limit(4),
      ]);

      // Resolve person names for stale intros
      const personIds = new Set<string>();
      (introRes.data ?? []).forEach((i: any) => {
        if (i.to_person_id) personIds.add(i.to_person_id);
        if (i.from_person_id) personIds.add(i.from_person_id);
      });
      let peopleMap: Record<string, string> = {};
      if (personIds.size) {
        const { data: people } = await supabase
          .from("people")
          .select("id, name")
          .in("id", Array.from(personIds));
        peopleMap = Object.fromEntries((people ?? []).map((p: any) => [p.id, p.name]));
      }

      const out: Signal[] = [];

      (inqRes.data ?? []).forEach((r: any) => out.push({
        id: `inq-${r.id}`, kind: "inquiry",
        title: r.name,
        meta: r.service_type.replace(" Inquiry", ""),
        when: r.created_at,
        href: `/hq/inquiries/${r.id}`,
        weight: 100,
      }));

      (introRes.data ?? []).forEach((r: any) => {
        const to = r.to_person_id ? peopleMap[r.to_person_id] : null;
        const from = r.from_person_id ? peopleMap[r.from_person_id] : null;
        const pair = [from, to].filter(Boolean).join(" → ") || "Intro";
        out.push({
          id: `intro-${r.id}`, kind: "intro_overdue",
          title: pair,
          meta: r.context ? r.context.slice(0, 60) : `Due ${format(new Date(r.follow_up_at), "MMM d")}`,
          when: r.follow_up_at,
          href: `/hq/people${r.to_person_id ? `?person=${r.to_person_id}` : ""}`,
          weight: 90,
        });
      });

      (contentRes.data ?? []).forEach((r: any) => out.push({
        id: `content-${r.id}`, kind: "content_today",
        title: r.title,
        meta: `${r.platform} · ${r.status}`,
        when: r.scheduled_at,
        href: "/hq/content",
        weight: 70,
      }));

      (capRes.data ?? []).forEach((r: any) => out.push({
        id: `cap-${r.id}`, kind: "capture",
        title: r.title || r.body.split("\n")[0].slice(0, 70),
        meta: r.kind,
        when: r.created_at,
        href: "/hq/notes",
        weight: 50,
      }));

      (staleRes.data ?? []).forEach((r: any) => {
        const last = r.last_contacted_at ? formatDistanceToNowStrict(new Date(r.last_contacted_at)) + " ago" : "never";
        out.push({
          id: `stale-${r.id}`, kind: "stale_person",
          title: r.name,
          meta: `Last touch: ${last}`,
          when: r.last_contacted_at || new Date(0).toISOString(),
          href: `/hq/people?person=${r.id}`,
          weight: 60,
        });
      });

      return out
        .sort((a, b) => b.weight - a.weight || new Date(b.when).getTime() - new Date(a.when).getTime())
        .slice(0, 8);
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

const SignalFeed = () => {
  const navigate = useNavigate();
  const { data: signals = [], isLoading } = useSignals();

  if (!isLoading && signals.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="panel p-4 mb-6"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Inbox size={13} className="text-accent" />
          <h3 className="text-[13px] font-medium">Signal</h3>
          {signals.length > 0 && (
            <span className="font-mono text-[10px] text-muted-foreground">{signals.length}</span>
          )}
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">What needs you</span>
      </div>

      {isLoading ? (
        <div className="space-y-1.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-9 rounded-md bg-secondary/30 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {signals.map((s) => {
            const Meta = KIND_META[s.kind];
            return (
              <button
                key={s.id}
                onClick={() => navigate(s.href)}
                className="w-full text-left flex items-center gap-3 py-2 px-2 -mx-2 rounded-md hover:bg-secondary/40 transition-colors group"
              >
                <Meta.icon size={13} className={`${Meta.tint} shrink-0`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{s.title}</p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    <span className="text-foreground/60">{Meta.label}</span> · {s.meta}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap shrink-0">
                  {formatDistanceToNowStrict(new Date(s.when), { addSuffix: false })}
                </span>
                <ArrowUpRight size={11} className="text-muted-foreground/40 group-hover:text-accent transition-colors shrink-0" />
              </button>
            );
          })}
        </div>
      )}
    </motion.section>
  );
};

export default SignalFeed;
