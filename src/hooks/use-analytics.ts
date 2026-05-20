import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type RangeKey = "24h" | "7d" | "30d" | "90d" | "all";

const RANGE_LABELS: Record<RangeKey, string> = {
  "24h": "Last 24h",
  "7d": "Last 7d",
  "30d": "Last 30d",
  "90d": "Last 90d",
  all: "All time",
};

const STORAGE_KEY = "devhq.analytics.range";

const rangeToHours = (range: RangeKey): number => {
  switch (range) {
    case "24h": return 24;
    case "7d": return 24 * 7;
    case "30d": return 24 * 30;
    case "90d": return 24 * 90;
    case "all": return 24 * 365 * 5; // 5y
  }
};

export const rangeBounds = (range: RangeKey) => {
  const to = new Date();
  const hours = rangeToHours(range);
  const from = new Date(to.getTime() - hours * 3600 * 1000);
  const prevFrom = new Date(from.getTime() - hours * 3600 * 1000);
  const prevTo = from;
  return { from, to, prevFrom, prevTo, hours };
};

export const useAnalyticsRange = () => {
  const [range, setRangeState] = useState<RangeKey>(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY) as RangeKey | null;
      if (v && ["24h", "7d", "30d", "90d", "all"].includes(v)) return v;
    } catch {}
    return "30d";
  });
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, range); } catch {}
  }, [range]);
  return {
    range,
    setRange: setRangeState,
    label: RANGE_LABELS[range],
    bounds: useMemo(() => rangeBounds(range), [range]),
  };
};

const queryDefaults = {
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
  retry: 1,
};

export const useAnalyticsOverview = (range: RangeKey) => {
  return useQuery({
    queryKey: ["analytics", "overview", range],
    ...queryDefaults,
    queryFn: async () => {
      const { from, to, prevFrom, prevTo } = rangeBounds(range);
      const [cur, prev] = await Promise.all([
        supabase.rpc("analytics_overview", { p_from: from.toISOString(), p_to: to.toISOString() }),
        supabase.rpc("analytics_overview", { p_from: prevFrom.toISOString(), p_to: prevTo.toISOString() }),
      ]);
      if (cur.error) throw cur.error;
      if (prev.error) throw prev.error;
      const c = (cur.data?.[0] ?? { page_views: 0, unique_sessions: 0, inquiries: 0, chat_engagements: 0 }) as {
        page_views: number; unique_sessions: number; inquiries: number; chat_engagements: number;
      };
      const p = (prev.data?.[0] ?? { page_views: 0, unique_sessions: 0, inquiries: 0, chat_engagements: 0 }) as {
        page_views: number; unique_sessions: number; inquiries: number; chat_engagements: number;
      };
      return { current: c, previous: p };
    },
  });
};

export const useActivityOverTime = (range: RangeKey) => {
  return useQuery({
    queryKey: ["analytics", "over-time", range],
    ...queryDefaults,
    queryFn: async () => {
      const { from, to } = rangeBounds(range);
      const bucket = range === "24h" ? "hour" : range === "90d" || range === "all" ? "week" : "day";
      const { data, error } = await supabase.rpc("analytics_over_time", {
        p_from: from.toISOString(),
        p_to: to.toISOString(),
        p_bucket: bucket,
      });
      if (error) throw error;
      return (data ?? []) as Array<{ bucket_start: string; event_name: string; count: number }>;
    },
  });
};

export const useTopPaths = (range: RangeKey, limit = 10) => {
  return useQuery({
    queryKey: ["analytics", "top-paths", range, limit],
    ...queryDefaults,
    queryFn: async () => {
      const { from, to } = rangeBounds(range);
      const { data, error } = await supabase.rpc("analytics_top_paths", {
        p_from: from.toISOString(),
        p_to: to.toISOString(),
        p_limit: limit,
      });
      if (error) throw error;
      return (data ?? []) as Array<{ path: string; page_views: number; inquiries: number; last_visited: string }>;
    },
  });
};

export const useTopEvents = (range: RangeKey, limit = 20) => {
  return useQuery({
    queryKey: ["analytics", "top-events", range, limit],
    ...queryDefaults,
    queryFn: async () => {
      const { from, to } = rangeBounds(range);
      const { data, error } = await supabase.rpc("analytics_top_events", {
        p_from: from.toISOString(),
        p_to: to.toISOString(),
        p_limit: limit,
      });
      if (error) throw error;
      return (data ?? []) as Array<{ event_name: string; count: number; latest: string }>;
    },
  });
};

export const useTopSources = (range: RangeKey, limit = 15) => {
  return useQuery({
    queryKey: ["analytics", "top-sources", range, limit],
    ...queryDefaults,
    queryFn: async () => {
      const { from, to } = rangeBounds(range);
      const { data, error } = await supabase.rpc("analytics_top_sources", {
        p_from: from.toISOString(),
        p_to: to.toISOString(),
        p_limit: limit,
      });
      if (error) throw error;
      return (data ?? []) as Array<{ source: string; sessions: number; inquiries: number }>;
    },
  });
};
