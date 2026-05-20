import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CrossVentureInquiry {
  id: string;
  venture: "impact-zone" | "2thirty" | "valence";
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string | null;
  inquiry_type: string;
  status: string;
  assigned_to_email: string | null;
  created_at: string;
  reason: "assigned" | "keyword";
}

export function useCrossVentureInbox() {
  return useQuery({
    queryKey: ["cross-venture-inbox"],
    queryFn: async (): Promise<CrossVentureInquiry[]> => {
      const { data, error } = await supabase.functions.invoke("cross-venture-inbox");
      if (error) {
        console.error("[cross-venture-inbox] edge fn failed", error);
        return [];
      }
      return (data?.inquiries || []) as CrossVentureInquiry[];
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
