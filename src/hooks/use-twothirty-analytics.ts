import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TwoThirtyAnalytics {
  ok: boolean;
  days: number;
  since: string;
  units: number;
  revenue: number;
  orders: number;
  aov: number;
  topProducts: Array<{ title: string; units: number; revenue: number }>;
  daily: Array<{ day: string; revenue: number; units: number; orders: number }>;
}

export function useTwoThirtyAnalytics(days = 30, enabled = true) {
  return useQuery({
    queryKey: ["twothirty-analytics", days],
    enabled,
    queryFn: async (): Promise<TwoThirtyAnalytics | null> => {
      const { data, error } = await supabase.functions.invoke("twothirty-analytics", {
        body: { days },
      });
      if (error) {
        console.error("[twothirty-analytics] edge fn failed", error);
        return null;
      }
      return data as TwoThirtyAnalytics;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
