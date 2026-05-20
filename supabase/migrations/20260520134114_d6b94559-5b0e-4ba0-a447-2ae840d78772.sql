
-- ============================================================
-- KPIs table
-- ============================================================
CREATE TABLE public.kpis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  venture_id UUID REFERENCES public.ventures(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  unit TEXT NOT NULL CHECK (unit IN ('currency','count','percent','duration_minutes','custom')),
  currency_code TEXT DEFAULT 'USD',
  custom_unit_label TEXT,
  target_value NUMERIC,
  direction TEXT NOT NULL DEFAULT 'up' CHECK (direction IN ('up','down')),
  entry_cadence TEXT NOT NULL DEFAULT 'manual' CHECK (entry_cadence IN ('manual','daily','weekly','monthly','quarterly')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  archived BOOLEAN NOT NULL DEFAULT false,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT kpis_user_name_unique UNIQUE (user_id, name)
);

CREATE INDEX idx_kpis_user_venture_sort ON public.kpis(user_id, venture_id, sort_order);
CREATE INDEX idx_kpis_user_active ON public.kpis(user_id) WHERE archived = false;

ALTER TABLE public.kpis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage their KPIs"
  ON public.kpis
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) AND user_id = auth.uid())
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) AND user_id = auth.uid());

CREATE TRIGGER set_kpis_updated_at
  BEFORE UPDATE ON public.kpis
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- KPI entries table
-- ============================================================
CREATE TABLE public.kpi_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kpi_id UUID NOT NULL REFERENCES public.kpis(id) ON DELETE CASCADE,
  value NUMERIC NOT NULL,
  entry_date DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT kpi_entries_kpi_date_unique UNIQUE (kpi_id, entry_date)
);

CREATE INDEX idx_kpi_entries_kpi_date ON public.kpi_entries(kpi_id, entry_date DESC);

ALTER TABLE public.kpi_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage their KPI entries"
  ON public.kpi_entries
  FOR ALL
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    AND kpi_id IN (SELECT id FROM public.kpis WHERE user_id = auth.uid())
  )
  WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role)
    AND kpi_id IN (SELECT id FROM public.kpis WHERE user_id = auth.uid())
  );

CREATE TRIGGER set_kpi_entries_updated_at
  BEFORE UPDATE ON public.kpi_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- Helper: kpi_summary(p_kpi_id, p_range_days)
-- Returns current value, prior-period value, latest entry date,
-- and total entry count for a KPI within the given range.
-- ============================================================
CREATE OR REPLACE FUNCTION public.kpi_summary(p_kpi_id UUID, p_range_days INTEGER)
RETURNS TABLE(
  current_value NUMERIC,
  prior_value NUMERIC,
  latest_entry_date DATE,
  entry_count BIGINT
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_owner UUID;
  v_today DATE := CURRENT_DATE;
  v_window_start DATE;
  v_prior_start DATE;
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT user_id INTO v_owner FROM public.kpis WHERE id = p_kpi_id;
  IF v_owner IS NULL OR v_owner <> auth.uid() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  IF p_range_days IS NULL OR p_range_days <= 0 THEN
    p_range_days := 30;
  END IF;

  v_window_start := v_today - (p_range_days || ' days')::interval;
  v_prior_start := v_window_start - (p_range_days || ' days')::interval;

  RETURN QUERY
  SELECT
    (SELECT e.value FROM public.kpi_entries e
       WHERE e.kpi_id = p_kpi_id
       ORDER BY e.entry_date DESC LIMIT 1) AS current_value,
    (SELECT e.value FROM public.kpi_entries e
       WHERE e.kpi_id = p_kpi_id
         AND e.entry_date >= v_prior_start
         AND e.entry_date < v_window_start
       ORDER BY e.entry_date DESC LIMIT 1) AS prior_value,
    (SELECT MAX(e.entry_date) FROM public.kpi_entries e
       WHERE e.kpi_id = p_kpi_id) AS latest_entry_date,
    (SELECT COUNT(*) FROM public.kpi_entries e
       WHERE e.kpi_id = p_kpi_id) AS entry_count;
END;
$$;
