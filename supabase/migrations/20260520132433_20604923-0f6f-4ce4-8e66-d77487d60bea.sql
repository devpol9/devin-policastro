
REVOKE EXECUTE ON FUNCTION public.analytics_overview(TIMESTAMPTZ, TIMESTAMPTZ) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.analytics_over_time(TIMESTAMPTZ, TIMESTAMPTZ, TEXT) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.analytics_top_paths(TIMESTAMPTZ, TIMESTAMPTZ, INTEGER) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.analytics_top_events(TIMESTAMPTZ, TIMESTAMPTZ, INTEGER) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.analytics_top_sources(TIMESTAMPTZ, TIMESTAMPTZ, INTEGER) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.chat_search(TEXT, TEXT, TIMESTAMPTZ) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.analytics_overview(TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION public.analytics_over_time(TIMESTAMPTZ, TIMESTAMPTZ, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.analytics_top_paths(TIMESTAMPTZ, TIMESTAMPTZ, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.analytics_top_events(TIMESTAMPTZ, TIMESTAMPTZ, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.analytics_top_sources(TIMESTAMPTZ, TIMESTAMPTZ, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.chat_search(TEXT, TEXT, TIMESTAMPTZ) TO authenticated;
