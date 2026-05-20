
CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TABLE public.chat_sessions
  ADD COLUMN IF NOT EXISTS lead_score INTEGER,
  ADD COLUMN IF NOT EXISTS lead_status TEXT,
  ADD COLUMN IF NOT EXISTS reviewer_notes TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}';

ALTER TABLE public.chat_sessions
  DROP CONSTRAINT IF EXISTS chat_sessions_lead_status_check;
ALTER TABLE public.chat_sessions
  ADD CONSTRAINT chat_sessions_lead_status_check
  CHECK (lead_status IS NULL OR lead_status IN ('unreviewed','hot','warm','cold','spam','customer'));

CREATE INDEX IF NOT EXISTS idx_chat_sessions_lead_status_last_msg
  ON public.chat_sessions (lead_status, last_message_at DESC)
  WHERE lead_status IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_chat_sessions_last_message_at
  ON public.chat_sessions (last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id
  ON public.chat_messages (session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_content_trgm
  ON public.chat_messages USING gin (content gin_trgm_ops);

DROP POLICY IF EXISTS "Admins update chat session metadata" ON public.chat_sessions;
CREATE POLICY "Admins update chat session metadata"
ON public.chat_sessions
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at
  ON public.analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name_created
  ON public.analytics_events (event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_path
  ON public.analytics_events (path);

CREATE OR REPLACE FUNCTION public.analytics_overview(p_from TIMESTAMPTZ, p_to TIMESTAMPTZ)
RETURNS TABLE (page_views BIGINT, unique_sessions BIGINT, inquiries BIGINT, chat_engagements BIGINT)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN RAISE EXCEPTION 'Not authorized'; END IF;
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM analytics_events WHERE event_name = 'page_view' AND created_at >= p_from AND created_at < p_to),
    (SELECT COUNT(DISTINCT user_agent) FROM analytics_events WHERE created_at >= p_from AND created_at < p_to AND user_agent IS NOT NULL),
    (SELECT COUNT(*) FROM analytics_events WHERE event_name = 'inquiry_submitted' AND created_at >= p_from AND created_at < p_to),
    (SELECT COUNT(*) FROM analytics_events WHERE event_name = 'chatbot_engaged' AND created_at >= p_from AND created_at < p_to);
END; $$;

CREATE OR REPLACE FUNCTION public.analytics_over_time(p_from TIMESTAMPTZ, p_to TIMESTAMPTZ, p_bucket TEXT DEFAULT 'day')
RETURNS TABLE (bucket_start TIMESTAMPTZ, event_name TEXT, count BIGINT)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN RAISE EXCEPTION 'Not authorized'; END IF;
  IF p_bucket NOT IN ('hour','day','week') THEN p_bucket := 'day'; END IF;
  RETURN QUERY
  SELECT date_trunc(p_bucket, ae.created_at), ae.event_name, COUNT(*)::BIGINT
  FROM analytics_events ae
  WHERE ae.created_at >= p_from AND ae.created_at < p_to
    AND ae.event_name IN ('page_view','inquiry_submitted','chatbot_engaged','link_clicked')
  GROUP BY 1, 2 ORDER BY 1;
END; $$;

CREATE OR REPLACE FUNCTION public.analytics_top_paths(p_from TIMESTAMPTZ, p_to TIMESTAMPTZ, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (path TEXT, page_views BIGINT, inquiries BIGINT, last_visited TIMESTAMPTZ)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN RAISE EXCEPTION 'Not authorized'; END IF;
  RETURN QUERY
  SELECT ae.path,
    COUNT(*) FILTER (WHERE ae.event_name = 'page_view')::BIGINT,
    COUNT(*) FILTER (WHERE ae.event_name = 'inquiry_submitted')::BIGINT,
    MAX(ae.created_at) FILTER (WHERE ae.event_name = 'page_view')
  FROM analytics_events ae
  WHERE ae.created_at >= p_from AND ae.created_at < p_to AND ae.path IS NOT NULL
  GROUP BY ae.path
  HAVING COUNT(*) FILTER (WHERE ae.event_name = 'page_view') > 0
  ORDER BY 2 DESC LIMIT p_limit;
END; $$;

CREATE OR REPLACE FUNCTION public.analytics_top_events(p_from TIMESTAMPTZ, p_to TIMESTAMPTZ, p_limit INTEGER DEFAULT 20)
RETURNS TABLE (event_name TEXT, count BIGINT, latest TIMESTAMPTZ)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN RAISE EXCEPTION 'Not authorized'; END IF;
  RETURN QUERY
  SELECT ae.event_name, COUNT(*)::BIGINT, MAX(ae.created_at)
  FROM analytics_events ae
  WHERE ae.created_at >= p_from AND ae.created_at < p_to
  GROUP BY ae.event_name ORDER BY 2 DESC LIMIT p_limit;
END; $$;

CREATE OR REPLACE FUNCTION public.analytics_top_sources(p_from TIMESTAMPTZ, p_to TIMESTAMPTZ, p_limit INTEGER DEFAULT 15)
RETURNS TABLE (source TEXT, sessions BIGINT, inquiries BIGINT)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN RAISE EXCEPTION 'Not authorized'; END IF;
  RETURN QUERY
  WITH page_views AS (
    SELECT COALESCE(NULLIF(regexp_replace(COALESCE(properties->>'referrer',''),'^https?://([^/]+).*$','\1'),''),'direct') AS src,
           user_agent
    FROM analytics_events
    WHERE event_name='page_view' AND created_at>=p_from AND created_at<p_to
  ),
  inq AS (
    SELECT COALESCE(NULLIF(regexp_replace(COALESCE(properties->>'referrer',''),'^https?://([^/]+).*$','\1'),''),'direct') AS src,
           COUNT(*) AS n
    FROM analytics_events
    WHERE event_name='inquiry_submitted' AND created_at>=p_from AND created_at<p_to
    GROUP BY 1
  )
  SELECT pv.src, COUNT(DISTINCT pv.user_agent)::BIGINT, COALESCE(MAX(inq.n),0)::BIGINT
  FROM page_views pv LEFT JOIN inq ON inq.src = pv.src
  GROUP BY pv.src ORDER BY 2 DESC LIMIT p_limit;
END; $$;

CREATE OR REPLACE FUNCTION public.chat_search(p_query TEXT, p_lead_status TEXT DEFAULT NULL, p_from TIMESTAMPTZ DEFAULT NULL)
RETURNS TABLE (session_id UUID)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN RAISE EXCEPTION 'Not authorized'; END IF;
  RETURN QUERY
  SELECT DISTINCT cs.id FROM chat_sessions cs
  WHERE (p_from IS NULL OR cs.last_message_at >= p_from)
    AND (p_lead_status IS NULL OR cs.lead_status = p_lead_status OR (p_lead_status = 'unreviewed' AND cs.lead_status IS NULL))
    AND (p_query IS NULL OR p_query = '' OR EXISTS (
      SELECT 1 FROM chat_messages cm WHERE cm.session_id = cs.id AND cm.content ILIKE '%' || p_query || '%'
    ));
END; $$;
