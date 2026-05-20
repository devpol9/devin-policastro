// KPI helpers: formatting, deltas, % to target, suggested templates.

export type KpiUnit = "currency" | "count" | "percent" | "duration_minutes" | "custom";
export type KpiDirection = "up" | "down";
export type KpiCadence = "manual" | "daily" | "weekly" | "monthly" | "quarterly";

export interface KpiLike {
  unit: string;
  currency_code: string | null;
  custom_unit_label: string | null;
  direction: string;
  target_value: number | null;
}

export const CURRENCY_CODES = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY"];

export const UNIT_OPTIONS: { value: KpiUnit; label: string; icon: string; hint: string }[] = [
  { value: "currency", label: "Currency", icon: "$", hint: "MRR, revenue, AOV" },
  { value: "count", label: "Count", icon: "#", hint: "Members, signups" },
  { value: "percent", label: "Percent", icon: "%", hint: "Churn, conversion" },
  { value: "duration_minutes", label: "Duration", icon: "⏱", hint: "Time in minutes" },
  { value: "custom", label: "Custom", icon: "•", hint: "lbs, subs, anything" },
];

export const CADENCE_OPTIONS: { value: KpiCadence; label: string }[] = [
  { value: "manual", label: "Manual" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
];

export const RANGE_DAYS = { "30d": 30, "90d": 90, "1y": 365, all: 3650 } as const;
export type RangeKey = keyof typeof RANGE_DAYS;

export const formatKpiValue = (kpi: KpiLike | undefined | null, value: number | null | undefined): string => {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  if (!kpi) return String(value);
  const v = Number(value);
  switch (kpi.unit) {
    case "currency": {
      try {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: kpi.currency_code || "USD",
          maximumFractionDigits: Math.abs(v) >= 1000 ? 0 : 2,
        }).format(v);
      } catch {
        return `$${v.toLocaleString()}`;
      }
    }
    case "count":
      return v.toLocaleString("en-US", { maximumFractionDigits: 0 });
    case "percent":
      return `${v.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;
    case "duration_minutes": {
      const h = Math.floor(v / 60);
      const m = Math.round(v % 60);
      return h > 0 ? `${h}h ${m}m` : `${m}m`;
    }
    case "custom":
      return `${v.toLocaleString("en-US", { maximumFractionDigits: 2 })}${kpi.custom_unit_label ? ` ${kpi.custom_unit_label}` : ""}`;
    default:
      return String(v);
  }
};

export const formatKpiValueShort = (kpi: KpiLike | undefined | null, value: number | null | undefined): string => {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  if (!kpi) return String(value);
  const v = Math.abs(Number(value));
  const sign = Number(value) < 0 ? "-" : "";
  const abbr = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000 ? `${(n / 1_000).toFixed(1)}k`
    : `${n.toFixed(0)}`;
  switch (kpi.unit) {
    case "currency":
      return `${sign}${(kpi.currency_code === "EUR" ? "€" : kpi.currency_code === "GBP" ? "£" : "$")}${abbr(v)}`;
    case "count":
      return `${sign}${abbr(v)}`;
    case "percent":
      return `${sign}${v.toFixed(1)}%`;
    default:
      return formatKpiValue(kpi, value);
  }
};

export interface DeltaResult {
  pct: number;        // signed percent change vs prior
  isPositive: boolean; // green or red color
  isNeutral: boolean;  // ~0 change
  label: string;       // formatted "+12%" / "-3.4%" / "—"
  hasPrior: boolean;
}

export const computeDelta = (
  current: number | null | undefined,
  prior: number | null | undefined,
  direction: KpiDirection | string,
): DeltaResult => {
  if (current === null || current === undefined) return { pct: 0, isPositive: false, isNeutral: true, label: "—", hasPrior: false };
  if (prior === null || prior === undefined) return { pct: 0, isPositive: false, isNeutral: true, label: "No prior data", hasPrior: false };
  if (prior === 0) {
    if (current === 0) return { pct: 0, isPositive: false, isNeutral: true, label: "0%", hasPrior: true };
    return { pct: 100, isPositive: direction === "up", isNeutral: false, label: "+∞", hasPrior: true };
  }
  const pct = ((current - prior) / Math.abs(prior)) * 100;
  const isNeutral = Math.abs(pct) < 0.5;
  const isUp = pct >= 0;
  const isPositive = direction === "up" ? isUp : !isUp;
  const sign = pct > 0 ? "+" : "";
  return {
    pct,
    isPositive,
    isNeutral,
    hasPrior: true,
    label: `${sign}${pct.toFixed(1)}%`,
  };
};

export const computePercentToTarget = (
  current: number | null | undefined,
  target: number | null | undefined,
  direction: KpiDirection | string,
): number | null => {
  if (current === null || current === undefined || target === null || target === undefined) return null;
  if (direction === "down") {
    // lower is better — at-or-below target = 100%
    if (target === 0) return current === 0 ? 100 : 0;
    if (current <= target) return 100;
    const pct = (target / current) * 100;
    return Math.max(0, Math.min(100, pct));
  }
  if (target === 0) return current === 0 ? 100 : 100;
  const pct = (current / target) * 100;
  return Math.max(0, Math.min(100, pct));
};

export const cadenceHint = (c: string): string => {
  const map: Record<string, string> = {
    manual: "log when you want",
    daily: "log daily",
    weekly: "log weekly",
    monthly: "log monthly",
    quarterly: "log quarterly",
  };
  return map[c] ?? c;
};

// ============================================================
// Suggested KPI templates per venture pattern
// ============================================================

export interface SuggestedKpi {
  name: string;
  unit: KpiUnit;
  direction: KpiDirection;
  entry_cadence: KpiCadence;
  currency_code?: string;
  custom_unit_label?: string;
  target_value?: number;
  description?: string;
}

interface VentureLike {
  id: string;
  name: string;
  slug: string;
}

const TEMPLATES: { match: (v: VentureLike) => boolean; items: SuggestedKpi[] }[] = [
  {
    match: (v) => /gym|fitness|impact/i.test(`${v.name} ${v.slug}`),
    items: [
      { name: "Active Members", unit: "count", direction: "up", entry_cadence: "monthly", target_value: 2000 },
      { name: "Monthly Revenue", unit: "currency", direction: "up", entry_cadence: "monthly", currency_code: "USD" },
      { name: "Member Churn Rate", unit: "percent", direction: "down", entry_cadence: "monthly" },
      { name: "New Signups", unit: "count", direction: "up", entry_cadence: "weekly" },
    ],
  },
  {
    match: (v) => /2thirty|230|drink/i.test(`${v.name} ${v.slug}`),
    items: [
      { name: "2THIRTY Monthly Revenue", unit: "currency", direction: "up", entry_cadence: "monthly", currency_code: "USD" },
      { name: "2THIRTY Active Subscribers", unit: "count", direction: "up", entry_cadence: "monthly" },
      { name: "2THIRTY AOV", unit: "currency", direction: "up", entry_cadence: "weekly", currency_code: "USD" },
      { name: "2THIRTY Repeat Purchase Rate", unit: "percent", direction: "up", entry_cadence: "monthly" },
    ],
  },
  {
    match: (v) => /valence|saas/i.test(`${v.name} ${v.slug}`),
    items: [
      { name: "Valence MRR", unit: "currency", direction: "up", entry_cadence: "monthly", currency_code: "USD" },
      { name: "Valence Active Gyms", unit: "count", direction: "up", entry_cadence: "monthly" },
      { name: "Valence Churn Rate", unit: "percent", direction: "down", entry_cadence: "monthly" },
    ],
  },
  {
    match: (v) => /onlyshitz|casino|game/i.test(`${v.name} ${v.slug}`),
    items: [
      { name: "OnlyShitz Total Signups", unit: "count", direction: "up", entry_cadence: "weekly" },
      { name: "OnlyShitz DAU", unit: "count", direction: "up", entry_cadence: "daily" },
      { name: "OnlyShitz Virtual Currency in Circulation", unit: "count", direction: "up", entry_cadence: "weekly" },
    ],
  },
  {
    match: (v) => /personal|brand/i.test(`${v.name} ${v.slug}`),
    items: [
      { name: "Instagram Followers", unit: "count", direction: "up", entry_cadence: "weekly" },
      { name: "Newsletter Subscribers", unit: "count", direction: "up", entry_cadence: "weekly" },
      { name: "Inquiries This Month", unit: "count", direction: "up", entry_cadence: "monthly" },
    ],
  },
  {
    match: (v) => /creative|manufactur/i.test(`${v.name} ${v.slug}`),
    items: [
      { name: "Creative Vision Active Projects", unit: "count", direction: "up", entry_cadence: "monthly" },
      { name: "Creative Vision Revenue Pipeline", unit: "currency", direction: "up", entry_cadence: "monthly", currency_code: "USD" },
    ],
  },
];

export interface SuggestionEntry extends SuggestedKpi {
  venture_id: string;
  venture_name: string;
}

export const buildSuggestions = (ventures: VentureLike[]): SuggestionEntry[] => {
  const out: SuggestionEntry[] = [];
  for (const v of ventures) {
    for (const tpl of TEMPLATES) {
      if (tpl.match(v)) {
        for (const k of tpl.items) {
          out.push({ ...k, venture_id: v.id, venture_name: v.name });
        }
        break; // one template per venture
      }
    }
  }
  return out;
};
