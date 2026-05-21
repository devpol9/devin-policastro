import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ChevronRight } from "lucide-react";
import { formatDistanceToNow, subDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface StaleInquiry {
  id: string;
  name: string;
  service_type: string;
  status: string;
  created_at: string;
}

const StaleInquiriesCard = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<StaleInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const cutoff = subDays(new Date(), 3).toISOString();
      const { data } = await supabase
        .from("inquiries")
        .select("id, name, service_type, status, created_at")
        .in("status", ["new", "contacted"])
        .lte("created_at", cutoff)
        .is("converted_project_id", null)
        .order("created_at", { ascending: true })
        .limit(5);
      setItems((data || []) as StaleInquiry[]);
      setLoading(false);
    })();
  }, []);

  if (loading || items.length === 0) return null;

  return (
    <div className="panel p-4 mb-8 border-[hsl(24_38%_56%/0.3)]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-accent" />
          <h3 className="text-sm font-display font-semibold">
            Needs follow-up
          </h3>
          <span className="text-[10px] font-mono text-muted-foreground">
            {items.length} stale
          </span>
        </div>
        <button
          onClick={() => navigate("/hq/inquiries")}
          className="text-[11px] text-muted-foreground hover:text-accent flex items-center gap-0.5"
        >
          Inbox <ChevronRight size={11} />
        </button>
      </div>
      <div className="space-y-1.5">
        {items.map((i) => (
          <button
            key={i.id}
            onClick={() => navigate(`/hq/inquiries/${i.id}`)}
            className="w-full text-left flex items-center justify-between gap-3 p-2 rounded-md border border-border/40 hover:bg-secondary/40 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-display font-semibold truncate">{i.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">
                {i.service_type.replace(" Inquiry", "")} · {i.status}
              </p>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">
              {formatDistanceToNow(new Date(i.created_at), { addSuffix: true })}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StaleInquiriesCard;
