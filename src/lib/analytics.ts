import { supabase } from "@/integrations/supabase/client";

export const trackEvent = async (
  eventName: string,
  properties: Record<string, unknown> = {},
) => {
  try {
    await supabase.from("analytics_events").insert({
      event_name: eventName,
      properties: properties as never,
      path: typeof window !== "undefined" ? window.location.pathname : null,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    });
  } catch (err) {
    console.warn("[analytics] failed to track", eventName, err);
  }
};
