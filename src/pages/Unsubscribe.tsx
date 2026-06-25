import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type State = "validating" | "ready" | "already" | "invalid" | "submitting" | "success" | "error";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>("validating");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    document.title = "Unsubscribe · Devin Policastro";
    if (!token) {
      setState("invalid");
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON_KEY } },
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setState("invalid");
          setErrorMsg(data?.error ?? "Invalid or expired link.");
          return;
        }
        if (data?.valid === false && data?.reason === "already_unsubscribed") {
          setState("already");
          return;
        }
        setState("ready");
      } catch {
        setState("invalid");
      }
    })();
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setState("submitting");
    const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", { body: { token } });
    if (error) {
      setState("error");
      setErrorMsg(error.message);
      return;
    }
    if ((data as any)?.success || (data as any)?.reason === "already_unsubscribed") {
      setState("success");
    } else {
      setState("error");
      setErrorMsg("Could not process. Try again.");
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-border rounded-lg p-8 bg-card">
        <p className="text-xs tracking-[0.18em] text-accent uppercase mb-3">Devin HQ</p>
        <h1 className="text-2xl font-bold mb-3">Unsubscribe</h1>

        {state === "validating" && <p className="text-muted-foreground">Checking your link…</p>}

        {state === "ready" && (
          <>
            <p className="text-muted-foreground mb-6">
              Click below and I'll stop emailing this address. You can always come back at{" "}
              <Link to="/" className="text-accent underline">devinpolicastro.com</Link>.
            </p>
            <button
              onClick={confirm}
              className="w-full bg-accent text-accent-foreground font-semibold py-3 rounded-md hover:opacity-90 transition"
            >
              Confirm unsubscribe
            </button>
          </>
        )}

        {state === "submitting" && <p className="text-muted-foreground">Processing…</p>}

        {state === "success" && (
          <>
            <p className="mb-6">You're unsubscribed. No more emails from me to this address.</p>
            <Link to="/" className="text-accent underline">Back to devinpolicastro.com →</Link>
          </>
        )}

        {state === "already" && (
          <>
            <p className="mb-6">This address is already unsubscribed. Nothing more to do.</p>
            <Link to="/" className="text-accent underline">Back to devinpolicastro.com →</Link>
          </>
        )}

        {(state === "invalid" || state === "error") && (
          <>
            <p className="text-muted-foreground mb-6">
              {errorMsg || "This unsubscribe link is invalid or expired."}
            </p>
            <p className="text-sm text-muted-foreground">
              Reply directly to any email from me with "stop" and I'll handle it manually.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
