
-- daily_logs
CREATE TABLE public.daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL,
  mood SMALLINT CHECK (mood IS NULL OR (mood >= 1 AND mood <= 10)),
  energy SMALLINT CHECK (energy IS NULL OR (energy >= 1 AND energy <= 10)),
  wins TEXT,
  challenges TEXT,
  tomorrow_focus TEXT,
  notes TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, log_date)
);

CREATE INDEX idx_daily_logs_user_date ON public.daily_logs (user_id, log_date DESC);
CREATE INDEX idx_daily_logs_tags ON public.daily_logs USING GIN (tags);

ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage their daily logs"
  ON public.daily_logs
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) AND user_id = auth.uid())
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) AND user_id = auth.uid());

CREATE TRIGGER update_daily_logs_updated_at
  BEFORE UPDATE ON public.daily_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- quick_captures
CREATE TABLE public.quick_captures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  kind TEXT NOT NULL DEFAULT 'note' CHECK (kind IN ('note','idea','quote','link','reference')),
  title TEXT,
  body TEXT NOT NULL,
  venture_id UUID REFERENCES public.ventures(id) ON DELETE SET NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  pinned BOOLEAN NOT NULL DEFAULT false,
  archived BOOLEAN NOT NULL DEFAULT false,
  promoted_project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  promoted_at TIMESTAMPTZ,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_quick_captures_user_archived ON public.quick_captures (user_id, archived, created_at DESC);
CREATE INDEX idx_quick_captures_user_kind ON public.quick_captures (user_id, kind, created_at DESC);
CREATE INDEX idx_quick_captures_user_venture ON public.quick_captures (user_id, venture_id) WHERE venture_id IS NOT NULL;
CREATE INDEX idx_quick_captures_tags ON public.quick_captures USING GIN (tags);

ALTER TABLE public.quick_captures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage their captures"
  ON public.quick_captures
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) AND user_id = auth.uid())
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) AND user_id = auth.uid());

CREATE TRIGGER update_quick_captures_updated_at
  BEFORE UPDATE ON public.quick_captures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate daily_logs_quick into daily_logs (append to notes, grouped by date+user)
INSERT INTO public.daily_logs (user_id, log_date, notes)
SELECT user_id, (created_at AT TIME ZONE 'UTC')::date AS log_date,
       string_agg(content, E'\n\n---\n\n' ORDER BY created_at)
FROM public.daily_logs_quick
GROUP BY user_id, (created_at AT TIME ZONE 'UTC')::date
ON CONFLICT (user_id, log_date) DO UPDATE
  SET notes = COALESCE(public.daily_logs.notes, '') ||
              CASE WHEN public.daily_logs.notes IS NULL OR public.daily_logs.notes = '' THEN '' ELSE E'\n\n---\n\n' END ||
              EXCLUDED.notes;
