import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PLAYBOOK_URL = "https://vprroffyczhnalpwwltf.supabase.co/storage/v1/object/public/lead-magnets/nj-entrepreneur-playbook.pdf";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { name, email, source } = await req.json();
    if (!name || !email || !/^\S+@\S+\.\S+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Valid name and email required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find admin user to own the new person record
    const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "admin");
    const adminId = roles?.[0]?.user_id;

    if (adminId) {
      // Upsert by email — append lead-magnet tag if person exists
      const { data: existing } = await supabase
        .from("people")
        .select("id, tags")
        .eq("user_id", adminId)
        .eq("email", email.toLowerCase())
        .maybeSingle();

      if (existing) {
        const tags = Array.from(new Set([...(existing.tags || []), "lead-magnet"]));
        await supabase.from("people").update({ tags, last_contacted_at: new Date().toISOString() }).eq("id", existing.id);
      } else {
        await supabase.from("people").insert({
          user_id: adminId,
          name: name.slice(0, 120),
          email: email.toLowerCase(),
          source: source || "playbook",
          tags: ["lead-magnet"],
          notes: "Downloaded the NJ Entrepreneur Playbook",
        });
      }

      // Log a capture so it lights up the HQ signal feed
      await supabase.from("quick_captures").insert({
        user_id: adminId,
        kind: "lead",
        title: `Playbook download — ${name}`,
        body: `${name} (${email}) downloaded the NJ Entrepreneur Playbook${source ? ` via ${source}` : ""}.`,
        tags: ["lead-magnet", "playbook"],
        meta: { email, name, source: source || "playbook" },
      });
    }

    // Send branded delivery email + admin ping
    await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "lead-magnet-delivery",
        recipientEmail: email,
        idempotencyKey: `playbook-${email.toLowerCase()}`,
        templateData: {
          name,
          downloadUrl: PLAYBOOK_URL,
          title: "The NJ Entrepreneur Playbook",
        },
      },
    });

    await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "notify-admin",
        recipientEmail: "devinpolicastro@gmail.com",
        idempotencyKey: `playbook-admin-${email.toLowerCase()}`,
        templateData: {
          title: "New playbook download",
          preheader: `${name} grabbed the NJ Entrepreneur Playbook`,
          intro: `${name} just downloaded the playbook${source ? ` via ${source}` : ""}.`,
          fields: [
            { label: "Name", value: name },
            { label: "Email", value: email },
            { label: "Source", value: source || "playbook" },
          ],
        },
      },
    });

    return new Response(JSON.stringify({ ok: true, downloadUrl: PLAYBOOK_URL }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("capture-lead-magnet error", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
