import { ReactNode } from "react";

export interface TabItem<T extends string = string> {
  value: T;
  label: ReactNode;
  count?: number;
}

interface Props<T extends string> {
  items: TabItem<T>[];
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Flat, underline-on-active tab bar. Use everywhere we previously had
 * rounded-pill segmented controls (Analytics range, KPIs filter, Content
 * category, Chats status, Ventures filter, Today tabs).
 */
const TabBar = <T extends string>({ items, value, onChange, size = "md", className = "" }: Props<T>) => {
  const padY = size === "sm" ? "py-1.5" : "py-2";
  const text = size === "sm" ? "text-[12px]" : "text-[13px]";
  return (
    <div className={`flex items-center gap-1 border-b border-border/60 ${className}`}>
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            type="button"
            onClick={() => onChange(it.value)}
            className={`relative px-3 ${padY} ${text} font-medium transition-colors -mb-px border-b-2 ${
              active
                ? "text-foreground border-foreground"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              {it.label}
              {typeof it.count === "number" && (
                <span className={`text-[10px] tabular-nums ${active ? "text-foreground/60" : "text-muted-foreground/60"}`}>
                  {it.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default TabBar;
