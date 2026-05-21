import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PublicKpi {
  id: string;
  label: string;
  prefix: string;
  suffix: string;
  unit: string;
  custom_unit_label: string | null;
  currency_code: string | null;
  latest_value: number | null;
  latest_entry_date: string | null;
  sort_order: number;
}

export const usePublicKpis = () =>
  useQuery({
    queryKey: ["public_kpis"],
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<PublicKpi[]> => {
      const { data, error } = await supabase.rpc("public_kpis_with_latest");
      if (error) throw error;
      return (data ?? []) as PublicKpi[];
    },
  });
