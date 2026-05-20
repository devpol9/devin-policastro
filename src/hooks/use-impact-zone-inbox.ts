import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CrossVentureInquiry } from "@/hooks/use-cross-venture-inbox";

export function useImpactZoneInbox(enabled = true) {
  return useQuery({
    queryKey: ["impact-zone-inbox-all"],
    enabled,
    queryFn: async (): Promise<CrossVentureInquiry[]> => {
      const { data, error } = await supabase.functions.invoke("cross-venture-inbox", {
        body: { all: true },
      });
      if (error) {
        console.error("[impact-zone-inbox] edge fn failed", error);
        return [];
      }
      return (data?.inquiries || []) as CrossVentureInquiry[];
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
