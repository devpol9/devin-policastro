// Transcribes audio via Lovable AI (Gemini) and saves as a quick capture.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const supaUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData } = await supaUser.auth.getUser();
    const user = userData?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const audioB64: string = body?.audio;
    const format: string = body?.format || 'webm';
    const ventureSlug: string | undefined = body?.venture_slug;
    if (!audioB64) {
      return new Response(JSON.stringify({ error: 'audio required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY missing');

    // Use Gemini for audio transcription via OpenAI-compatible input_audio
    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${LOVABLE_API_KEY}` },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a transcription engine. Transcribe the audio verbatim. Then on a new line write "---" and a 3-7 word title. Output only: transcription, ---, title.' },
          { role: 'user', content: [
            { type: 'text', text: 'Transcribe this voice note.' },
            { type: 'input_audio', input_audio: { data: audioB64, format } },
          ] },
        ],
      }),
    });

    if (!aiRes.ok) {
      const t = await aiRes.text();
      console.error('ai err', aiRes.status, t);
      if (aiRes.status === 429) return new Response(JSON.stringify({ error: 'Rate limited' }), { status: 429, headers: { ...corsHeaders, 'Content-Type':'application/json' } });
      if (aiRes.status === 402) return new Response(JSON.stringify({ error: 'AI credits exhausted' }), { status: 402, headers: { ...corsHeaders, 'Content-Type':'application/json' } });
      return new Response(JSON.stringify({ error: 'transcription failed', detail: t.slice(0, 500) }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const ai = await aiRes.json();
    const raw: string = ai?.choices?.[0]?.message?.content?.toString() || '';
    const [transcript, titleLine] = raw.split(/\n\s*---\s*\n/);
    const body_text = (transcript || raw).trim();
    const title = (titleLine || '').trim().slice(0, 80) || null;

    if (!body_text) {
      return new Response(JSON.stringify({ error: 'No transcription' }), {
        status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Resolve venture
    let venture_id: string | null = null;
    if (ventureSlug) {
      const { data: v } = await supaUser.from('ventures').select('id').eq('slug', ventureSlug).maybeSingle();
      venture_id = v?.id ?? null;
    }

    const { data: capture, error } = await supaUser.from('quick_captures').insert({
      user_id: user.id, body: body_text, title, venture_id, kind: 'note',
      meta: { source: 'voice' }, tags: ['voice'],
    }).select().single();
    if (error) throw error;

    return new Response(JSON.stringify({ capture, transcript: body_text, title }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('voice-capture error', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
