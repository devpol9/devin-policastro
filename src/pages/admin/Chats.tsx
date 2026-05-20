import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { format, formatDistanceToNowStrict } from "date-fns";
import ReactMarkdown from "react-markdown";
import { Search, Copy, Check, Tag as TagIcon, X, MessageSquare, User, Bot, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import SectionHeader from "@/components/SectionHeader";
import {
  useChatSessions, useChatSession, useUpdateChatSession, useConvertChatToInquiry,
  type LeadStatus, type ChatSessionWithPreview,
} from "@/hooks/use-chats";

const STATUS_OPTIONS: { key: LeadStatus | "all"; label: string; color: string }[] = [
  { key: "unreviewed", label: "Unreviewed", color: "hsl(30 8% 50%)" },
  { key: "hot", label: "Hot", color: "hsl(0 70% 50%)" },
  { key: "warm", label: "Warm", color: "hsl(24 32% 52%)" },
  { key: "cold", label: "Cold", color: "hsl(210 20% 50%)" },
  { key: "customer", label: "Customer", color: "hsl(140 55% 40%)" },
  { key: "spam", label: "Spam", color: "hsl(30 8% 40%)" },
  { key: "all", label: "All", color: "hsl(30 8% 50%)" },
];

const STATUS_COLOR: Record<string, string> = Object.fromEntries(
  STATUS_OPTIONS.filter((s) => s.key !== "all").map((s) => [s.key, s.color])
);

const RANGES = [
  { key: "24h" as const, label: "24h" },
  { key: "7d" as const, label: "7d" },
  { key: "30d" as const, label: "30d" },
  { key: "all" as const, label: "All" },
];

const SORTS = [
  { key: "recent" as const, label: "Most recent" },
  { key: "messages" as const, label: "Most messages" },
];

const parseUA = (ua: string | null): string => {
  if (!ua) return "Unknown";
  if (/iPhone|iPad/i.test(ua)) return "iOS Safari";
  if (/Android/i.test(ua)) return "Android";
  if (/Edg/i.test(ua)) return "Edge";
  if (/Chrome/i.test(ua)) return "Chrome";
  if (/Firefox/i.test(ua)) return "Firefox";
  if (/Safari/i.test(ua)) return "Safari";
  return "Unknown";
};

const useDebounced = <T,>(value: T, ms = 200): T => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
};

const StatusPill = ({ status, onClick }: { status: LeadStatus | null; onClick?: () => void }) => {
  const key = status ?? "unreviewed";
  const color = STATUS_COLOR[key];
  return (
    <span
      onClick={onClick}
      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-display font-semibold tracking-[0.06em] capitalize"
      style={{ background: `${color} / 0.15`, backgroundColor: `${color.replace(")", " / 0.12)").replace("hsl(", "hsla(")}`, color, border: `1px solid ${color}40` }}
    >
      {key}
    </span>
  );
};

const ChatsInner = () => {
  const [params, setParams] = useSearchParams();
  const [status, setStatus] = useState<LeadStatus | "all">((params.get("status") as any) || "unreviewed");
  const [range, setRange] = useState<"24h" | "7d" | "30d" | "all">("7d");
  const [sort, setSort] = useState<"recent" | "messages">("recent");
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounced(searchInput, 200);
  const [selectedId, setSelectedId] = useState<string | null>(params.get("session"));

  const list = useChatSessions({ status, range, search, sort });
  const detail = useChatSession(selectedId);
  const update = useUpdateChatSession();
  const convert = useConvertChatToInquiry();

  const [notesDraft, setNotesDraft] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (detail.data?.session) setNotesDraft(detail.data.session.reviewer_notes ?? "");
  }, [detail.data?.session?.id]);

  const sessions = list.data ?? [];

  const select = (id: string) => {
    setSelectedId(id);
    const next = new URLSearchParams(params);
    next.set("session", id);
    setParams(next, { replace: true });
  };

  const copyTranscript = async () => {
    if (!detail.data) return;
    const text = detail.data.messages.map((m) => `[${m.role}] ${m.content}`).join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { toast.error("Couldn't copy"); }
  };

  const setLeadStatus = (s: LeadStatus | null) => {
    if (!selectedId) return;
    update.mutate({ id: selectedId, patch: { lead_status: s } }, {
      onSuccess: () => toast.success(`Marked as ${s ?? "unreviewed"}`),
    });
  };

  const saveNotes = () => {
    if (!selectedId) return;
    if (notesDraft === (detail.data?.session.reviewer_notes ?? "")) return;
    update.mutate({ id: selectedId, patch: { reviewer_notes: notesDraft } });
  };

  const addTag = () => {
    if (!selectedId || !tagInput.trim()) return;
    const existing = detail.data?.session.tags ?? [];
    if (existing.includes(tagInput.trim())) { setTagInput(""); return; }
    update.mutate({ id: selectedId, patch: { tags: [...existing, tagInput.trim()] } });
    setTagInput("");
  };
  const removeTag = (t: string) => {
    if (!selectedId) return;
    const existing = detail.data?.session.tags ?? [];
    update.mutate({ id: selectedId, patch: { tags: existing.filter((x) => x !== t) } });
  };

  const doConvert = () => {
    if (!selectedId) return;
    convert.mutate(selectedId, {
      onSuccess: (inq: any) => {
        toast.success("Converted to inquiry");
        if (inq?.id) window.open(`/hq/inquiries/${inq.id}`, "_blank");
      },
      onError: (e: any) => toast.error(e?.message || "Failed to convert"),
    });
  };

  return (
    <AdminShell>
      <SectionHeader
        as="h1"
        numeral="08"
        eyebrow="Conversations"
        title={<>Every conversation with Dev's <span className="italic font-light text-accent">chat logs.</span></>}
        description="Triage chats from the public site. Mark hot leads. Convert to inquiries."
      />

      {/* Toolbar — single condensed row */}
      <div className="flex flex-wrap items-center gap-2 mb-4 font-body">
        <div className="flex items-center gap-2 bg-secondary/40 border border-border/40 rounded-md px-2.5 py-1.5 min-w-[200px] flex-1 max-w-xs">
          <Search size={13} className="text-muted-foreground" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search messages…"
            className="bg-transparent text-[13px] outline-none flex-1 font-body"
          />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setStatus(s.key)}
              className={`px-2 py-1 rounded text-[11px] font-medium tracking-tight transition-colors ${
                status === s.key ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >{s.label}</button>
          ))}
        </div>
        <div className="h-5 w-px bg-border/60 mx-1" />
        <div className="flex items-center gap-0.5">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                range === r.key ? "bg-accent/15 text-accent" : "text-muted-foreground hover:text-foreground"
              }`}
            >{r.label}</button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {sessions.length} session{sessions.length === 1 ? "" : "s"}
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="bg-transparent border border-border/40 rounded px-1.5 py-1 text-[11px] font-medium font-body cursor-pointer hover:border-border"
          >
            {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Two-pane */}
      <div className="grid lg:grid-cols-[35%_65%] gap-4">
        {/* List */}
        <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
          {list.isLoading ? (
            <p className="text-sm text-muted-foreground p-4">Loading conversations…</p>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground p-4">No conversations match.</p>
          ) : sessions.map((s) => (
            <SessionCard key={s.id} session={s} active={s.id === selectedId} onClick={() => select(s.id)} />
          ))}
        </div>

        {/* Detail */}
        <div className="glass-card p-4 min-h-[400px]">
          {!selectedId ? (
            <div className="h-full flex items-center justify-center text-center py-20">
              <div>
                <MessageSquare size={32} className="text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Pick a conversation to read.</p>
              </div>
            </div>
          ) : detail.isLoading || !detail.data ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <div className="flex flex-col gap-3 h-full">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border/40 pb-3">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] text-muted-foreground tracking-[0.18em] uppercase">
                    Started {formatDistanceToNowStrict(new Date(detail.data.session.started_at), { addSuffix: true })}
                  </p>
                  <p className="font-display font-bold text-sm mt-1">
                    {detail.data.session.path || "/"} · {detail.data.session.message_count} msgs · {parseUA(detail.data.session.user_agent)}
                  </p>
                </div>
                <button
                  onClick={copyTranscript}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] bg-secondary/40 hover:bg-secondary border border-border/40"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              {/* Lead status + tags */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={detail.data.session.lead_status ?? ""}
                  onChange={(e) => setLeadStatus((e.target.value || null) as LeadStatus | null)}
                  className="bg-card border border-border/40 rounded-md px-2 py-1 text-xs font-display capitalize"
                >
                  <option value="">Unreviewed</option>
                  <option value="hot">Hot</option>
                  <option value="warm">Warm</option>
                  <option value="cold">Cold</option>
                  <option value="customer">Customer</option>
                  <option value="spam">Spam</option>
                </select>
                <div className="flex items-center gap-1 flex-wrap">
                  {(detail.data.session.tags ?? []).map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-accent/10 text-accent border border-accent/30">
                      <TagIcon size={10} /> {t}
                      <button onClick={() => removeTag(t)} className="opacity-60 hover:opacity-100"><X size={10} /></button>
                    </span>
                  ))}
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    placeholder="+ tag"
                    className="bg-transparent border border-border/40 rounded-full px-2 py-0.5 text-[10px] w-20 outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Transcript */}
              <div className="flex-1 overflow-y-auto space-y-2 max-h-[400px] pr-1">
                {detail.data.messages.map((m) => (
                  <div key={m.id} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    {m.role === "assistant" && (
                      <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-1">
                        <Bot size={12} className="text-primary" />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      m.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary/60 text-foreground rounded-bl-sm"
                    }`}>
                      {m.role === "assistant" ? (
                        <div className="prose prose-sm max-w-none [&_p]:mb-1 [&_p:last-child]:mb-0">
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        </div>
                      ) : m.content}
                      <p className={`text-[9px] font-mono mt-1 opacity-60`}>
                        {format(new Date(m.created_at), "MMM d, h:mma")}
                      </p>
                    </div>
                    {m.role === "user" && (
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                        <User size={12} className="text-primary" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Notes + actions */}
              <div className="border-t border-border/40 pt-3 space-y-3">
                <div>
                  <p className="font-mono text-[10px] text-muted-foreground tracking-[0.18em] uppercase mb-1">Reviewer notes</p>
                  <textarea
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    onBlur={saveNotes}
                    rows={2}
                    placeholder="Quick triage notes…"
                    className="w-full bg-secondary/40 border border-border/40 rounded-md p-2 text-sm outline-none focus:border-accent resize-none"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setLeadStatus("hot")} className="px-2.5 py-1 rounded-md text-[11px] font-display font-semibold bg-destructive/10 text-destructive border border-destructive/30">
                    Mark hot
                  </button>
                  <button onClick={() => setLeadStatus("customer")} className="px-2.5 py-1 rounded-md text-[11px] font-display font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/30">
                    Mark customer
                  </button>
                  <button onClick={() => setLeadStatus("spam")} className="px-2.5 py-1 rounded-md text-[11px] font-display font-semibold bg-card text-muted-foreground border border-border/40">
                    Mark spam
                  </button>
                  <button onClick={doConvert} disabled={convert.isPending} className="ml-auto px-2.5 py-1 rounded-md text-[11px] font-display font-semibold bg-accent text-accent-foreground flex items-center gap-1 disabled:opacity-50">
                    <ExternalLink size={11} /> Convert to inquiry
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
};

const SessionCard = ({ session, active, onClick }: { session: ChatSessionWithPreview; active: boolean; onClick: () => void }) => {
  const statusKey = session.lead_status ?? "unreviewed";
  const color = STATUS_COLOR[statusKey];
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-md p-3 transition-colors border ${
        active ? "border-accent bg-accent/5" : "border-border/40 bg-card hover:bg-card/80"
      }`}
      style={active ? { borderLeftWidth: 3 } : undefined}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span
          className="px-2 py-0.5 rounded text-[10px] font-display font-semibold capitalize"
          style={{ background: `${color}1f`, color, border: `1px solid ${color}55` }}
        >{statusKey}</span>
        <span className="font-mono text-[10px] text-muted-foreground">
          {formatDistanceToNowStrict(new Date(session.last_message_at), { addSuffix: true })}
        </span>
      </div>
      <p className="text-sm text-foreground line-clamp-2 leading-snug">
        {session.first_user_message || <span className="italic text-muted-foreground">No user message yet</span>}
      </p>
      <div className="flex items-center justify-between gap-2 mt-2">
        <span className="text-[10px] font-mono text-muted-foreground truncate">
          {session.path ?? "/"} · {session.message_count} msgs
        </span>
        {session.reviewer_notes && <MessageSquare size={11} className="text-accent shrink-0" />}
      </div>
      {(session.tags?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {session.tags.map((t) => (
            <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent">{t}</span>
          ))}
        </div>
      )}
    </button>
  );
};

const Chats = () => (
  <AdminGuard>
    <ChatsInner />
  </AdminGuard>
);

export default Chats;
