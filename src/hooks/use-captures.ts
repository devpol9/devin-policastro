import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Capture = Tables<"quick_captures">;
export type CaptureKind = "note" | "idea" | "quote" | "link" | "reference";

const KEY = ["captures"] as const;

export interface CaptureFilters {
  kind?: CaptureKind | "all";
  venture_id?: string | "unscoped" | "all";
  archived?: boolean;
  showPromoted?: boolean;
  search?: string;
  tags?: string[];
  sort?: "recent" | "pinned";
}

export const useCaptures = (filters: CaptureFilters = {}) =>
  useQuery({
    queryKey: [...KEY, "list", filters],
    queryFn: async (): Promise<Capture[]> => {
      let q = supabase.from("quick_captures").select("*");
      q = q.eq("archived", !!filters.archived);
      if (filters.kind && filters.kind !== "all") q = q.eq("kind", filters.kind);
      if (filters.venture_id === "unscoped") q = q.is("venture_id", null);
      else if (filters.venture_id && filters.venture_id !== "all") q = q.eq("venture_id", filters.venture_id);
      if (filters.showPromoted === false) q = q.is("promoted_project_id", null);
      if (filters.search) {
        const s = `%${filters.search}%`;
        q = q.or(`title.ilike.${s},body.ilike.${s}`);
      }
      if (filters.tags && filters.tags.length) q = q.overlaps("tags", filters.tags);
      q = q.order("pinned", { ascending: false }).order("created_at", { ascending: false }).limit(300);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

export const useCapture = (id: string | null) =>
  useQuery({
    queryKey: [...KEY, "by-id", id],
    queryFn: async (): Promise<Capture | null> => {
      if (!id) return null;
      const { data } = await supabase.from("quick_captures").select("*").eq("id", id).maybeSingle();
      return data ?? null;
    },
    enabled: !!id,
    staleTime: 30 * 1000,
  });

export const useRecentCaptures = (limit = 5) =>
  useQuery({
    queryKey: [...KEY, "recent", limit],
    queryFn: async (): Promise<Capture[]> => {
      const { data } = await supabase
        .from("quick_captures")
        .select("*")
        .eq("archived", false)
        .order("created_at", { ascending: false })
        .limit(limit);
      return data ?? [];
    },
    staleTime: 60 * 1000,
  });

export const useAllCaptureTags = () =>
  useQuery({
    queryKey: [...KEY, "tags"],
    queryFn: async (): Promise<string[]> => {
      const { data } = await supabase.from("quick_captures").select("tags").limit(500);
      const set = new Set<string>();
      (data ?? []).forEach((r: any) => (r.tags ?? []).forEach((t: string) => set.add(t)));
      return Array.from(set).sort();
    },
    staleTime: 5 * 60 * 1000,
  });

export const invalidateCaptures = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: KEY });
};

export const useCreateCapture = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Omit<TablesInsert<"quick_captures">, "user_id">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      const { data, error } = await supabase
        .from("quick_captures")
        .insert({ ...input, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => invalidateCaptures(qc),
  });
};

export const useUpdateCapture = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: TablesUpdate<"quick_captures"> }) => {
      const { data, error } = await supabase
        .from("quick_captures")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      invalidateCaptures(qc);
      qc.setQueryData([...KEY, "by-id", data.id], data);
    },
  });
};

export const useDeleteCapture = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("quick_captures").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => invalidateCaptures(qc),
  });
};
