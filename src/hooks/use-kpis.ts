import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { subDays, format } from "date-fns";
import { RANGE_DAYS, type RangeKey } from "@/lib/kpi-utils";

export type Kpi = Tables<"kpis">;
export type KpiEntry = Tables<"kpi_entries">;

const KPIS_KEY = ["kpis"] as const;
const ENTRIES_KEY = ["kpi_entries"] as const;
const SUMMARY_KEY = ["kpi_summary"] as const;

export interface KpiFilters {
  venture_ids?: string[];
  archived?: boolean;
}

const baseOpts = {
  staleTime: 60 * 1000,
  retry: 1,
  refetchOnWindowFocus: false,
};

// ============================================================
// Queries
// ============================================================

export const useKpis = (filters?: KpiFilters) => {
  const q = useQuery({
    queryKey: [...KPIS_KEY, filters ?? {}],
    queryFn: async (): Promise<Kpi[]> => {
      let q = supabase.from("kpis").select("*");
      if (filters?.venture_ids?.length) q = q.in("venture_id", filters.venture_ids);
      if (filters && filters.archived !== undefined) q = q.eq("archived", filters.archived);
      const { data, error } = await q
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    ...baseOpts,
  });
  return { ...q, kpis: q.data ?? [] };
};

export const useKpi = (id: string | null | undefined) =>
  useQuery({
    queryKey: ["kpi", id],
    enabled: !!id,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<Kpi | null> => {
      if (!id) return null;
      const { data, error } = await supabase.from("kpis").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const useKpiEntries = (kpiId: string | null | undefined, rangeDays?: number) =>
  useQuery({
    queryKey: [...ENTRIES_KEY, kpiId, rangeDays ?? "all"],
    enabled: !!kpiId,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<KpiEntry[]> => {
      if (!kpiId) return [];
      let q = supabase.from("kpi_entries").select("*").eq("kpi_id", kpiId);
      if (rangeDays && rangeDays > 0) {
        const since = format(subDays(new Date(), rangeDays), "yyyy-MM-dd");
        q = q.gte("entry_date", since);
      }
      const { data, error } = await q.order("entry_date", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

export interface KpiSummary {
  current_value: number | null;
  prior_value: number | null;
  latest_entry_date: string | null;
  entry_count: number;
}

export const useKpiSummary = (kpiId: string | null | undefined, rangeDays: number) =>
  useQuery({
    queryKey: [...SUMMARY_KEY, kpiId, rangeDays],
    enabled: !!kpiId,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<KpiSummary> => {
      if (!kpiId) return { current_value: null, prior_value: null, latest_entry_date: null, entry_count: 0 };
      const { data, error } = await supabase.rpc("kpi_summary", {
        p_kpi_id: kpiId,
        p_range_days: rangeDays,
      });
      if (error) throw error;
      const row = (data ?? [])[0];
      return {
        current_value: row?.current_value ?? null,
        prior_value: row?.prior_value ?? null,
        latest_entry_date: row?.latest_entry_date ?? null,
        entry_count: Number(row?.entry_count ?? 0),
      };
    },
  });

export const usePinnedKpis = () => {
  const { kpis, ...rest } = useKpis({ archived: false });
  const pinned = useMemo(() => {
    return kpis
      .map((k) => ({ k, pin: Number((k.meta as any)?.pinned_sort ?? 0) }))
      .filter((x) => x.pin > 0 && x.pin <= 4)
      .sort((a, b) => a.pin - b.pin)
      .map((x) => x.k);
  }, [kpis]);
  return { ...rest, pinned };
};

// ============================================================
// Invalidation helpers
// ============================================================

export const invalidateKpis = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: KPIS_KEY });
  qc.invalidateQueries({ queryKey: ["kpi"] });
};

export const invalidateKpiEntries = (qc: ReturnType<typeof useQueryClient>, kpiId?: string) => {
  if (kpiId) {
    qc.invalidateQueries({ queryKey: [...ENTRIES_KEY, kpiId] });
    qc.invalidateQueries({ queryKey: [...SUMMARY_KEY, kpiId] });
  } else {
    qc.invalidateQueries({ queryKey: ENTRIES_KEY });
    qc.invalidateQueries({ queryKey: SUMMARY_KEY });
  }
};

// ============================================================
// Mutations (KPIs)
// ============================================================

export const useCreateKpi = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Omit<TablesInsert<"kpis">, "user_id">): Promise<Kpi> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      const { data, error } = await supabase
        .from("kpis")
        .insert({ ...values, user_id: user.id } as TablesInsert<"kpis">)
        .select()
        .single();
      if (error) {
        if (error.code === "23505") throw new Error("A KPI with this name already exists");
        throw error;
      }
      return data;
    },
    onSuccess: () => invalidateKpis(qc),
  });
};

export const useCreateKpisBatch = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (rows: Omit<TablesInsert<"kpis">, "user_id">[]): Promise<Kpi[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      const payload = rows.map((r) => ({ ...r, user_id: user.id })) as TablesInsert<"kpis">[];
      const { data, error } = await supabase.from("kpis").insert(payload).select();
      if (error) throw error;
      return data ?? [];
    },
    onSuccess: () => invalidateKpis(qc),
  });
};

export const useUpdateKpi = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: TablesUpdate<"kpis"> }): Promise<Kpi> => {
      const { data, error } = await supabase.from("kpis").update(patch).eq("id", id).select().single();
      if (error) {
        if (error.code === "23505") throw new Error("A KPI with this name already exists");
        throw error;
      }
      return data;
    },
    onSuccess: (_d, vars) => {
      invalidateKpis(qc);
      qc.invalidateQueries({ queryKey: ["kpi", vars.id] });
    },
  });
};

export const useDeleteKpi = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase.from("kpis").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => invalidateKpis(qc),
  });
};

export const useArchiveKpi = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, archived }: { id: string; archived: boolean }) => {
      const { error } = await supabase.from("kpis").update({ archived }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => invalidateKpis(qc),
  });
};

export const usePinKpi = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, sort_order, currentMeta }: { id: string; sort_order: number | null; currentMeta: any }) => {
      const meta = { ...(currentMeta || {}) };
      if (sort_order === null) delete meta.pinned_sort;
      else meta.pinned_sort = sort_order;
      const { error } = await supabase.from("kpis").update({ meta }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => invalidateKpis(qc),
  });
};

// ============================================================
// Mutations (entries)
// ============================================================

export const useLogKpiEntry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      kpi_id, value, entry_date, note,
    }: { kpi_id: string; value: number; entry_date: string; note?: string | null }): Promise<KpiEntry> => {
      // upsert by (kpi_id, entry_date)
      const { data, error } = await supabase
        .from("kpi_entries")
        .upsert(
          { kpi_id, value, entry_date, note: note ?? null } as TablesInsert<"kpi_entries">,
          { onConflict: "kpi_id,entry_date" }
        )
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, vars) => invalidateKpiEntries(qc, vars.kpi_id),
  });
};

export const useUpdateKpiEntry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id, kpi_id, patch,
    }: { id: string; kpi_id: string; patch: TablesUpdate<"kpi_entries"> }) => {
      const { error } = await supabase.from("kpi_entries").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_d, vars) => invalidateKpiEntries(qc, vars.kpi_id),
  });
};

export const useDeleteKpiEntry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, kpi_id }: { id: string; kpi_id: string }) => {
      const { error } = await supabase.from("kpi_entries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_d, vars) => invalidateKpiEntries(qc, vars.kpi_id),
  });
};

// ============================================================
// Toast wrappers — convenience for components
// ============================================================

export const toastError = (msg: string) => toast.error(msg);
export const toastSuccess = (msg: string) => toast.success(msg);
