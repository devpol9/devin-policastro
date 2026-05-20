import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type LeadStatus = "unreviewed" | "hot" | "warm" | "cold" | "spam" | "customer";

export interface ChatSession {
  id: string;
  session_token: string;
  message_count: number;
  started_at: string;
  last_message_at: string;
  path: string | null;
  user_agent: string | null;
  lead_status: LeadStatus | null;
  lead_score: number | null;
  reviewer_notes: string | null;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ChatSessionWithPreview extends ChatSession {
  first_user_message: string | null;
}

interface ChatFilters {
  range: "24h" | "7d" | "30d" | "all";
  status: LeadStatus | "all";
  search: string;
  sort: "recent" | "messages";
}

const rangeFrom = (range: ChatFilters["range"]): string | null => {
  if (range === "all") return null;
  const hours = range === "24h" ? 24 : range === "7d" ? 24 * 7 : 24 * 30;
  return new Date(Date.now() - hours * 3600 * 1000).toISOString();
};

export const useChatSessions = (filters: ChatFilters) => {
  return useQuery({
    queryKey: ["chats", "list", filters],
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    queryFn: async (): Promise<ChatSessionWithPreview[]> => {
      const from = rangeFrom(filters.range);

      let sessionIds: string[] | null = null;
      if (filters.search.trim()) {
        const { data, error } = await supabase.rpc("chat_search", {
          p_query: filters.search.trim(),
          p_lead_status: filters.status === "all" ? null : filters.status,
          p_from: from,
        });
        if (error) throw error;
        sessionIds = (data ?? []).map((r: any) => r.session_id);
        if (sessionIds.length === 0) return [];
      }

      let q = supabase.from("chat_sessions").select("*");
      if (from) q = q.gte("last_message_at", from);
      if (filters.status === "unreviewed") q = q.is("lead_status", null);
      else if (filters.status !== "all") q = q.eq("lead_status", filters.status);
      if (sessionIds) q = q.in("id", sessionIds);
      q = q.order(filters.sort === "messages" ? "message_count" : "last_message_at", { ascending: false }).limit(100);

      const { data, error } = await q;
      if (error) throw error;
      const sessions = (data ?? []) as ChatSession[];
      if (sessions.length === 0) return [];

      const ids = sessions.map((s) => s.id);
      const { data: firstMsgs } = await supabase
        .from("chat_messages")
        .select("session_id, content, created_at")
        .in("session_id", ids)
        .eq("role", "user")
        .order("created_at", { ascending: true });

      const previewMap = new Map<string, string>();
      (firstMsgs ?? []).forEach((m: any) => {
        if (!previewMap.has(m.session_id)) previewMap.set(m.session_id, m.content);
      });

      return sessions.map((s) => ({ ...s, first_user_message: previewMap.get(s.id) ?? null }));
    },
  });
};

export const useChatSession = (id: string | null) => {
  return useQuery({
    queryKey: ["chats", "detail", id],
    enabled: !!id,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    queryFn: async () => {
      if (!id) return null;
      const [sessionRes, messagesRes] = await Promise.all([
        supabase.from("chat_sessions").select("*").eq("id", id).maybeSingle(),
        supabase.from("chat_messages").select("*").eq("session_id", id).order("created_at", { ascending: true }),
      ]);
      if (sessionRes.error) throw sessionRes.error;
      if (messagesRes.error) throw messagesRes.error;
      return {
        session: sessionRes.data as ChatSession,
        messages: (messagesRes.data ?? []) as ChatMessage[],
      };
    },
  });
};

export const useUpdateChatSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { id: string; patch: Partial<Pick<ChatSession, "lead_status" | "lead_score" | "reviewer_notes" | "tags">> }) => {
      const { error } = await supabase.from("chat_sessions").update(args.patch as any).eq("id", args.id);
      if (error) throw error;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["chats", "detail", vars.id] });
      qc.invalidateQueries({ queryKey: ["chats", "list"] });
    },
  });
};

export const useConvertChatToInquiry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const { data: session } = await supabase.from("chat_sessions").select("*").eq("id", sessionId).maybeSingle();
      const { data: msgs } = await supabase
        .from("chat_messages").select("role, content, created_at")
        .eq("session_id", sessionId).order("created_at", { ascending: true });
      const transcript = (msgs ?? [])
        .map((m: any) => `**${m.role === "user" ? "Them" : "Dev's AI"}**: ${m.content}`)
        .join("\n\n");
      const path = (session as any)?.path || "";
      const guess = path.includes("manufacturing") ? "Manufacturing Inquiry"
        : path.includes("automotive") ? "Automotive Inquiry"
        : path.includes("financing") ? "Financing Inquiry"
        : path.includes("consulting") ? "Consulting Inquiry"
        : path.includes("networking") ? "Networking Inquiry"
        : path.includes("content") ? "Content / Collab Inquiry"
        : "General Inquiry";
      const { data, error } = await supabase.from("inquiries").insert({
        service_type: guess,
        name: `Chat lead (${path || "site"})`,
        email: "unknown@chat.local",
        notes: `Converted from chat on ${path || "site"}\n\n---\n\n${transcript}`,
        form_data: { chat_session_id: sessionId, path } as any,
        status: "new",
      } as any).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_d, sessionId) => {
      qc.invalidateQueries({ queryKey: ["chats", "list"] });
      qc.invalidateQueries({ queryKey: ["chats", "detail", sessionId] });
    },
  });
};

export const useChatTodayStats = () => {
  return useQuery({
    queryKey: ["chats", "today-stats"],
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
      const [totalRes, unreviewedRes, latestRes] = await Promise.all([
        supabase.from("chat_sessions").select("id", { count: "exact", head: true }).gte("started_at", since),
        supabase.from("chat_sessions").select("id", { count: "exact", head: true }).gte("started_at", since).is("lead_status", null),
        supabase.from("chat_sessions").select("id, path, last_message_at").is("lead_status", null).order("last_message_at", { ascending: false }).limit(1),
      ]);
      const latestSession = latestRes.data?.[0];
      let preview: string | null = null;
      if (latestSession) {
        const { data: firstMsg } = await supabase
          .from("chat_messages").select("content")
          .eq("session_id", latestSession.id).eq("role", "user")
          .order("created_at", { ascending: true }).limit(1).maybeSingle();
        preview = firstMsg?.content ?? null;
      }
      return {
        total24h: totalRes.count ?? 0,
        unreviewed24h: unreviewedRes.count ?? 0,
        latestPreview: preview,
        latestSessionId: latestSession?.id ?? null,
        latestPath: latestSession?.path ?? null,
      };
    },
  });
};
