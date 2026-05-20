import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const IZ_ENDPOINT = 'https://qgfgemknktfupcvqdqtr.supabase.co/functions/v1/external-inbox';
const DEVIN_EMAIL = 'devinpolicastro@gmail.com';
const KEYWORD = 'devin';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const token = Deno.env.get('IMPACT_ZONE_INBOX_TOKEN');
  if (!token) {
    return new Response(JSON.stringify({ error: 'IMPACT_ZONE_INBOX_TOKEN not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let all = false;
  try {
    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      all = !!body?.all;
    } else {
      all = new URL(req.url).searchParams.get('all') === 'true';
    }
  } catch { /* ignore */ }

  try {
    const res = await fetch(IZ_ENDPOINT, { headers: { 'x-inbox-token': token } });
    if (!res.ok) {
      const text = await res.text();
      console.error('[cross-venture-inbox] IZ error', res.status, text);
      return new Response(JSON.stringify({ inquiries: [], error: `IZ ${res.status}` }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const body = await res.json();
    const raw = Array.isArray(body?.inquiries) ? body.inquiries : [];

    const filtered = raw
      .filter((r: any) => {
        if (all) return true;
        const assigned = r.assigned_to_email === DEVIN_EMAIL;
        const inSubject = (r.subject || '').toLowerCase().includes(KEYWORD);
        const inMessage = (r.message || '').toLowerCase().includes(KEYWORD);
        return assigned || inSubject || inMessage;
      })
      .map((r: any) => ({
        id: r.id,
        venture: 'impact-zone',
        first_name: r.first_name,
        last_name: r.last_name,
        email: r.email,
        phone: r.phone ?? null,
        subject: r.subject ?? '',
        message: r.message ?? null,
        inquiry_type: r.inquiry_type ?? '',
        status: r.status ?? '',
        assigned_to_email: r.assigned_to_email ?? null,
        created_at: r.created_at,
        reason: r.assigned_to_email === DEVIN_EMAIL ? 'assigned' : 'keyword',
      }));

    return new Response(JSON.stringify({ inquiries: filtered }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('[cross-venture-inbox] fetch failed', e);
    return new Response(JSON.stringify({ inquiries: [], error: String(e) }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
