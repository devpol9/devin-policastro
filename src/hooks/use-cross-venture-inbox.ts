import { useQuery } from "@tanstack/react-query";
import { impactZoneClient } from "@/integrations/impact-zone/client";

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

const DEVIN_EMAIL = "devinpolicastro@gmail.com";
const KEYWORD = "devin";

export function useCrossVentureInbox() {
  return useQuery({
    queryKey: ["cross-venture-inbox"],
    queryFn: async (): Promise<CrossVentureInquiry[]> => {
      // Impact Zone — anything assigned to Devin OR mentioning him by name
      const { data, error } = await impactZoneClient
        .from("contact_inquiries")
        .select(
          "id, first_name, last_name, email, phone, subject, message, inquiry_type, status, assigned_to_email, created_at"
        )
        .or(
          `assigned_to_email.eq.${DEVIN_EMAIL},message.ilike.%${KEYWORD}%,subject.ilike.%${KEYWORD}%`
        )
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("[cross-venture-inbox] IZ fetch failed", error);
        return [];
      }

      return (data || []).map((r) => ({
        ...r,
        venture: "impact-zone" as const,
        reason:
          r.assigned_to_email === DEVIN_EMAIL ? ("assigned" as const) : ("keyword" as const),
      }));
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
