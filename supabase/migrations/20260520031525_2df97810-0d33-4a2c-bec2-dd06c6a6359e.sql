REVOKE EXECUTE ON FUNCTION public.seed_default_ventures(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.seed_default_ventures(UUID) TO authenticated;