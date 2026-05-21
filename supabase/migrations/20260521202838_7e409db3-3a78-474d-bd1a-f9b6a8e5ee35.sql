
ALTER TABLE public.kpis
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS public_label text,
  ADD COLUMN IF NOT EXISTS public_prefix text,
  ADD COLUMN IF NOT EXISTS public_suffix text,
  ADD COLUMN IF NOT EXISTS public_sort_order integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS kpis_is_public_idx ON public.kpis (is_public) WHERE is_public = true;

CREATE OR REPLACE FUNCTION public.public_kpis_with_latest()
RETURNS TABLE (
  id uuid,
  label text,
  prefix text,
  suffix text,
  unit text,
  custom_unit_label text,
  currency_code text,
  latest_value numeric,
  latest_entry_date date,
  sort_order integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    k.id,
    COALESCE(NULLIF(k.public_label, ''), k.name) AS label,
    COALESCE(k.public_prefix, '') AS prefix,
    COALESCE(k.public_suffix, '') AS suffix,
    k.unit,
    k.custom_unit_label,
    k.currency_code,
    (SELECT e.value FROM public.kpi_entries e WHERE e.kpi_id = k.id ORDER BY e.entry_date DESC LIMIT 1) AS latest_value,
    (SELECT e.entry_date FROM public.kpi_entries e WHERE e.kpi_id = k.id ORDER BY e.entry_date DESC LIMIT 1) AS latest_entry_date,
    k.public_sort_order AS sort_order
  FROM public.kpis k
  WHERE k.is_public = true AND k.archived = false
  ORDER BY k.public_sort_order ASC, k.name ASC;
$$;

GRANT EXECUTE ON FUNCTION public.public_kpis_with_latest() TO anon, authenticated;
