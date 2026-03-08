import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use Lovable AI to format a nice confirmation and log the contact
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    // For now, we'll log the contact and return success
    // In production, you'd integrate with an email service
    console.log("Contact form submission:", { name, email, subject, message });

    // Send notification via AI to format a nice response
    if (LOVABLE_API_KEY) {
      try {
        await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-lite",
            messages: [
              { role: "system", content: "Log this contact form submission for Devin Policastro. Just acknowledge receipt." },
              { role: "user", content: `New contact: ${name} (${email}) - Subject: ${subject} - Message: ${message}` },
            ],
          }),
        });
      } catch (aiError) {
        console.error("AI logging error:", aiError);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Message received! Devin will get back to you soon." 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Contact form error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
