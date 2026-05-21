import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Star, Calendar, Tag, ArrowUpRight, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface Props {
  email: string;
  personIdHint?: string | null;
}

type Person = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  role: string | null;
  city: string | null;
  tags: string[];
  notes: string | null;
  last_contacted_at: string | null;
  relationship_strength: number | null;
};

const LinkedPersonCard = ({ email, personIdHint }: Props) => {
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [introCount, setIntroCount] = useState(0);
  const [inquiryCount, setInquiryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      let p: Person | null = null;
      if (personIdHint) {
        const { data } = await supabase.from("people").select("*").eq("id", personIdHint).maybeSingle();
        p = (data as Person) ?? null;
      }
      if (!p && email) {
        const { data } = await supabase
          .from("people")
          .select("*")
          .ilike("email", email)
          .maybeSingle();
        p = (data as Person) ?? null;
      }
      if (cancelled) return;
      setPerson(p);

      if (p) {
        const [{ count: ic }, { count: qc }] = await Promise.all([
          supabase.from("intros").select("id", { count: "exact", head: true })
            .or(`from_person_id.eq.${p.id},to_person_id.eq.${p.id}`),
          supabase.from("inquiries").select("id", { count: "exact", head: true }).ilike("email", email),
        ]);
        if (!cancelled) { setIntroCount(ic ?? 0); setInquiryCount(qc ?? 0); }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [email, personIdHint]);

  const markContacted = async () => {
    if (!person) return;
    const now = new Date().toISOString();
    const { error } = await supabase.from("people").update({ last_contacted_at: now }).eq("id", person.id);
    if (error) { toast.error("Failed"); return; }
    setPerson({ ...person, last_contacted_at: now });
    toast.success("Marked contacted");
  };

  if (loading) {
    return (
      <div className="panel p-5">
        <div className="h-3 w-32 rounded bg-secondary/40 animate-pulse mb-3" />
        <div className="h-2 w-full rounded bg-secondary/40 animate-pulse" />
      </div>
    );
  }

  if (!person) {
    return (
      <div className="panel p-5">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} className="text-muted-foreground" />
          <h2 className="font-display font-bold text-base">No CRM match</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          No contact in your CRM matches this email. It'll auto-create on the next submission, or add manually from People.
        </p>
      </div>
    );
  }

  const strength = person.relationship_strength ?? 0;
  const lastContact = person.last_contacted_at
    ? formatDistanceToNow(new Date(person.last_contacted_at), { addSuffix: true })
    : "never";

  return (
    <div className="panel p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-display tracking-[0.12em] text-muted-foreground mb-1">
            <User size={11} /> LINKED CONTACT
          </div>
          <h2 className="font-display font-bold text-lg leading-tight truncate">{person.name}</h2>
          {(person.role || person.company) && (
            <p className="text-xs text-muted-foreground truncate">
              {[person.role, person.company].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        <Link
          to={`/hq/people?person=${person.id}`}
          className="shrink-0 inline-flex items-center gap-1 text-[10px] text-accent border border-accent/30 rounded px-1.5 py-0.5 hover:bg-accent/10"
        >
          Open <ArrowUpRight size={10} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md bg-secondary/30 border border-border/30 px-2.5 py-2">
          <div className="text-[10px] font-display tracking-[0.1em] text-muted-foreground flex items-center gap-1">
            <Star size={9} /> STRENGTH
          </div>
          <div className="mt-0.5 flex gap-0.5">
            {[1,2,3,4,5].map((n) => (
              <Star
                key={n} size={11}
                className={n <= strength ? "fill-accent text-accent" : "text-muted-foreground/40"}
              />
            ))}
          </div>
        </div>
        <div className="rounded-md bg-secondary/30 border border-border/30 px-2.5 py-2">
          <div className="text-[10px] font-display tracking-[0.1em] text-muted-foreground flex items-center gap-1">
            <Calendar size={9} /> LAST TOUCH
          </div>
          <div className="text-xs font-display font-medium mt-0.5 truncate">{lastContact}</div>
        </div>
      </div>

      {person.tags?.length > 0 && (
        <div className="flex items-start gap-1.5 flex-wrap">
          <Tag size={10} className="text-muted-foreground mt-1" />
          {person.tags.slice(0, 6).map((t) => (
            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/40 border border-border/30 text-foreground/80">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/30">
        <span>{inquiryCount} {inquiryCount === 1 ? "inquiry" : "inquiries"}</span>
        <span>{introCount} {introCount === 1 ? "intro" : "intros"}</span>
      </div>

      {person.notes && (
        <p className="text-xs text-muted-foreground line-clamp-3 italic border-l-2 border-border/40 pl-2">
          {person.notes}
        </p>
      )}

      <button
        onClick={markContacted}
        className="w-full px-3 py-2 rounded-md bg-secondary text-foreground text-xs font-display font-semibold hover:bg-secondary/70"
      >
        Mark contacted today
      </button>
    </div>
  );
};

export default LinkedPersonCard;
