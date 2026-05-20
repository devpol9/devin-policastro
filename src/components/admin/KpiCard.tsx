import { useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, Tooltip, YAxis } from "recharts";
import { format, formatDistanceToNow } from "date-fns";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import VenturePill from "@/components/admin/VenturePill";
import { useVentures } from "@/hooks/use-ventures";
import { useKpiSummary, useKpiEntries, type Kpi } from "@/hooks/use-kpis";
import {
  formatKpiValue, formatKpiValueShort,
  computeDelta, computePercentToTarget,
  RANGE_DAYS, type RangeKey,
} from "@/lib/kpi-utils";

interface Props {
  kpi: Kpi;
  rangeKey?: RangeKey;
  compact?: boolean;
  hero?: boolean;
  onClick?: () => void;
}

const KpiCard = ({ kpi, rangeKey = "90d", compact = false, hero = false, onClick }: Props) => {
  const { ventures } = useVentures();
  const venture = kpi.venture_id ? ventures.find((v) => v.id === kpi.venture_id) : undefined;
  const accent = venture?.accent_color ?? "hsl(24 32% 52%)";

  const rangeDays = RANGE_DAYS[rangeKey];
  const { data: summary } = useKpiSummary(kpi.id, rangeDays);
  const { data: entries = [] } = useKpiEntries(kpi.id, rangeDays);

  const sparklineData = useMemo(
    () => entries.map((e) => ({ date: e.entry_date, value: Number(e.value) })),
    [entries],
  );

  const delta = computeDelta(summary?.current_value, summary?.prior_value, kpi.direction);
  const pctToTarget = computePercentToTarget(summary?.current_value, kpi.target_value, kpi.direction);

  const lastLogged = summary?.latest_entry_date
    ? formatDistanceToNow(new Date(summary.latest_entry_date + "T00:00:00"), { addSuffix: true })
    : "never";

  const numberSize = hero ? "text-4xl sm:text-5xl" : compact ? "text-xl" : "text-3xl";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group text-left panel flex flex-col ${
        hero ? "p-5" : compact ? "p-3" : "p-4"
      } transition-all hover:-translate-y-0.5`}
      style={{
        borderLeft: `4px solid ${accent}`,
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          {venture ? (
            <div className="self-start">
              <VenturePill venture={venture} clickable={false} size="sm" />
            </div>
          ) : (
            <span className="text-[10px] font-mono text-muted-foreground tracking-[0.14em]">GLOBAL</span>
          )}
          <p
            className={`font-display font-semibold truncate ${
              hero ? "text-base" : compact ? "text-xs" : "text-sm"
            }`}
            title={kpi.name}
          >
            {kpi.name}
          </p>
          {!compact && kpi.description && (
            <p className="text-[11px] text-muted-foreground line-clamp-1">{kpi.description}</p>
          )}
        </div>
      </div>

      <p className={`font-display font-black tracking-tight ${numberSize} mt-1`} style={{ color: accent }}>
        {formatKpiValue(kpi, summary?.current_value)}
      </p>

      <div className="flex items-center gap-1.5 mt-1">
        {delta.hasPrior ? (
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-mono ${
              delta.isNeutral
                ? "text-muted-foreground"
                : delta.isPositive
                ? "text-[hsl(140_55%_38%)]"
                : "text-destructive"
            }`}
          >
            {delta.isNeutral ? <Minus size={10} /> : delta.pct >= 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
            {delta.label}
          </span>
        ) : (
          <span className="text-[10px] font-mono text-muted-foreground">{delta.label}</span>
        )}
        <span className="text-[10px] font-mono text-muted-foreground">vs prior {rangeKey}</span>
      </div>

      {kpi.target_value !== null && pctToTarget !== null && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-0.5">
            <span>Target {formatKpiValueShort(kpi, kpi.target_value)}</span>
            <span>{Math.round(pctToTarget)}%</span>
          </div>
          <div className="h-1 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${pctToTarget}%`, background: accent }}
            />
          </div>
        </div>
      )}

      {!compact && sparklineData.length > 1 && (
        <div className={`${hero ? "h-20" : "h-12"} mt-3 -mx-1`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
              <defs>
                <linearGradient id={`spark-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis hide domain={["dataMin", "dataMax"]} />
              <Tooltip
                cursor={{ stroke: accent, strokeOpacity: 0.3 }}
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  fontSize: "11px",
                  borderRadius: 6,
                  padding: "4px 8px",
                }}
                labelFormatter={(d) => format(new Date(d + "T00:00:00"), "MMM d")}
                formatter={(value: any) => [formatKpiValue(kpi, Number(value)), ""]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={accent}
                strokeWidth={hero ? 2 : 1.5}
                fill={`url(#spark-${kpi.id})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {!compact && (
        <p className="text-[10px] font-mono text-muted-foreground mt-2">Last logged {lastLogged}</p>
      )}
    </button>
  );
};

export default KpiCard;
