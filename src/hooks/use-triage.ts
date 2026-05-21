import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type TriageCategory = "task" | "person" | "kpi" | "idea" | "note";

export interface TriageResult {
  category: TriageCategory;
  suggested_title: string;
  tags: string[];
  confidence: number;
  task?: { title?: string; priority?: "low" | "medium" | "high" };
  person?: { name?: string; email?: string; company?: string; context?: string };
  kpi?: { name?: string; value?: number; unit?: string };
}

export const useTriageCapture = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (capture_id: string): Promise<{ capture: any; triage: TriageResult }> => {
      const { data, error } = await supabase.functions.invoke("triage-capture", {
        body: { capture_id },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      return data as any;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["captures"] }),
  });
};
