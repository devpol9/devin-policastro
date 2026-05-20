// Auto-archive projects that have been marked "done" for more than 14 days.
// Scheduled via pg_cron (set up separately).
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("projects")
    .update({ status: "archived" })
    .eq("status", "done")
    .lt("completed_at", cutoff)
    .select("id");

  if (error) {
    console.error("auto-archive error", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({ archived: data?.length ?? 0, cutoff }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
