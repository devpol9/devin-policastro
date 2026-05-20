import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type DailyLog = Tables<"daily_logs">;

const KEY = ["daily_logs"] as const;

export const useDailyLog = (date: string | null) =>
  useQuery({
    queryKey: [...KEY, "by-date", date],
    queryFn: async (): Promise<DailyLog | null> => {
      if (!date) return null;
      const { data } = await supabase
        .from("daily_logs")
        .select("*")
        .eq("log_date", date)
        .maybeSingle();
      return data ?? null;
    },
    enabled: !!date,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

interface FeedFilters {
  search?: string;
  tags?: string[];
  limit?: number;
}

export const useDailyLogFeed = (filters: FeedFilters = {}) =>
  useQuery({
    queryKey: [...KEY, "feed", filters],
    queryFn: async (): Promise<DailyLog[]> => {
      let q = supabase.from("daily_logs").select("*").order("log_date", { ascending: false });
      if (filters.search) {
        const s = `%${filters.search}%`;
        q = q.or(
          `wins.ilike.${s},challenges.ilike.${s},tomorrow_focus.ilike.${s},notes.ilike.${s}`
        );
      }
      if (filters.tags && filters.tags.length) {
        q = q.overlaps("tags", filters.tags);
      }
      q = q.limit(filters.limit ?? 100);
      const { data } = await q;
      return data ?? [];
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

export const useAllLogTags = () =>
  useQuery({
    queryKey: [...KEY, "tags"],
    queryFn: async (): Promise<string[]> => {
      const { data } = await supabase.from("daily_logs").select("tags").limit(500);
      const set = new Set<string>();
      (data ?? []).forEach((r: any) => (r.tags ?? []).forEach((t: string) => set.add(t)));
      return Array.from(set).sort();
    },
    staleTime: 5 * 60 * 1000,
  });

export const useSaveDailyLog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      date,
      partial,
    }: {
      date: string;
      partial: Partial<Omit<DailyLog, "id" | "user_id" | "log_date" | "created_at" | "updated_at">>;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      const { data, error } = await supabase
        .from("daily_logs")
        .upsert(
          { user_id: user.id, log_date: date, ...partial },
          { onConflict: "user_id,log_date" }
        )
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.setQueryData([...KEY, "by-date", data.log_date], data);
    },
  });
};

export const useTodayContext = (date: string | null) =>
  useQuery({
    queryKey: [...KEY, "context", date],
    queryFn: async () => {
      if (!date) return null;
      const start = `${date}T00:00:00.000Z`;
      const end = `${date}T23:59:59.999Z`;
      const [pri, inq, content, projects, kpiE] = await Promise.all([
        supabase.from("priorities_today").select("completed").eq("priority_date", date),
        supabase.from("inquiries").select("id", { count: "exact", head: true }).gte("created_at", start).lte("created_at", end),
        supabase.from("content_items").select("id", { count: "exact", head: true }).gte("posted_at", start).lte("posted_at", end),
        supabase.from("projects").select("id", { count: "exact", head: true }).gte("updated_at", start).lte("updated_at", end),
        supabase.from("kpi_entries").select("id", { count: "exact", head: true }).eq("entry_date", date),
      ]);
      const priList = pri.data ?? [];
      return {
        prioritiesDone: priList.filter((p: any) => p.completed).length,
        prioritiesTotal: priList.length,
        inquiries: inq.count ?? 0,
        contentPosted: content.count ?? 0,
        projectsUpdated: projects.count ?? 0,
        kpisLogged: kpiE.count ?? 0,
      };
    },
    enabled: !!date,
    staleTime: 60 * 1000,
  });
