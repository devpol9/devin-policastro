import { useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type State = "loading" | "authorized" | "unauthorized";

const CACHE_PREFIX = "devhq.admin_role.";
const CACHE_TTL_MS = 5 * 60 * 1000;

const readCache = (userId: string): boolean => {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + userId);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { verified: boolean; expiresAt: number };
    return parsed.verified && parsed.expiresAt > Date.now();
  } catch {
    return false;
  }
};

const writeCache = (userId: string) => {
  try {
    sessionStorage.setItem(
      CACHE_PREFIX + userId,
      JSON.stringify({ verified: true, expiresAt: Date.now() + CACHE_TTL_MS })
    );
  } catch {}
};

const clearCache = () => {
  try {
    for (const k of Object.keys(sessionStorage)) {
      if (k.startsWith(CACHE_PREFIX)) sessionStorage.removeItem(k);
    }
  } catch {}
};

const AdminGuard = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [state, setState] = useState<State>("loading");

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          try {
            sessionStorage.setItem(
              "devhq.return_to",
              window.location.pathname + window.location.search
            );
          } catch {}
          if (!cancelled) setState("unauthorized");
          return;
        }

        if (readCache(session.user.id)) {
          if (!cancelled) setState("authorized");
          return;
        }

        const { data: roles, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin");

        if (error) throw error;

        if (!roles || roles.length === 0) {
          toast.error("Access denied. Admins only.");
          await supabase.auth.signOut();
          if (!cancelled) setState("unauthorized");
          return;
        }

        writeCache(session.user.id);
        if (!cancelled) setState("authorized");
      } catch (err) {
        console.error("[AdminGuard] verification failed", err);
        if (!cancelled) setState("unauthorized");
      }
    };

    verify();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        clearCache();
        setState("unauthorized");
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (state === "unauthorized") {
      navigate("/hq/login", { replace: true });
    }
  }, [state, navigate]);

  if (state !== "authorized") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="font-display text-xs text-muted-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="tracking-[0.18em] lowercase">devhq</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
