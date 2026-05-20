import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Venture = Tables<"ventures">;

const VENTURES_KEY = ["ventures"] as const;

const fetchVentures = async (): Promise<Venture[]> => {
  const { data, error } = await supabase
    .from("ventures")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const useVentures = () => {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: VENTURES_KEY,
    queryFn: fetchVentures,
    staleTime: 5 * 60 * 1000,
  });

  // Re-fetch on auth changes (e.g. after login)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      qc.invalidateQueries({ queryKey: VENTURES_KEY });
    });
    return () => subscription.unsubscribe();
  }, [qc]);

  const ventures = query.data ?? [];
  const activeVentures = ventures.filter((v) => v.status === "active");
  const getVenture = (slug: string) => ventures.find((v) => v.slug === slug);

  return {
    ...query,
    ventures,
    activeVentures,
    getVenture,
  };
};

export const useVenture = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["venture", slug],
    queryFn: async (): Promise<Venture | null> => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("ventures")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

export const invalidateVentures = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: VENTURES_KEY });
  qc.invalidateQueries({ queryKey: ["venture"] });
};
