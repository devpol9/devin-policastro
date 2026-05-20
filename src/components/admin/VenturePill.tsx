import { useNavigate } from "react-router-dom";
import { getVentureIcon } from "./ventureIcons";
import type { Venture } from "@/hooks/use-ventures";
import { useVentures } from "@/hooks/use-ventures";

interface Props {
  venture?: Venture;
  slug?: string;
  clickable?: boolean;
  size?: "sm" | "md";
}

const VenturePill = ({ venture, slug, clickable = true, size = "sm" }: Props) => {
  const navigate = useNavigate();
  const { getVenture } = useVentures();
  const v = venture ?? (slug ? getVenture(slug) : undefined);
  if (!v) return null;

  const Icon = getVentureIcon(v.icon);
  const color = v.accent_color;
  const label = v.short_name || v.name;

  const content = (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border whitespace-nowrap ${
        size === "md" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[11px]"
      } font-medium`}
      style={{
        background: `color-mix(in oklch, ${color} 10%, transparent)`,
        borderColor: `color-mix(in oklch, ${color} 35%, transparent)`,
        color,
      }}
      title={v.name}
    >
      <Icon size={size === "md" ? 14 : 12} />
      {label}
    </span>
  );

  if (!clickable) return content;

  return (
    <button
      type="button"
      onClick={() => navigate(`/hq/ventures/${v.slug}`)}
      className="snap-start shrink-0"
    >
      {content}
    </button>
  );
};

export default VenturePill;
