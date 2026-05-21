
CREATE TABLE public.people (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  role TEXT,
  city TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  source TEXT,
  last_contacted_at TIMESTAMPTZ,
  meta JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage their people" ON public.people FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role) AND user_id = auth.uid())
  WITH CHECK (has_role(auth.uid(),'admin'::app_role) AND user_id = auth.uid());
CREATE TRIGGER trg_people_updated BEFORE UPDATE ON public.people
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_people_user ON public.people(user_id);
CREATE INDEX idx_people_name_trgm ON public.people USING gin (name gin_trgm_ops);

CREATE TABLE public.intros (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  from_person_id UUID REFERENCES public.people(id) ON DELETE CASCADE,
  to_person_id UUID REFERENCES public.people(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'proposed',
  note TEXT,
  follow_up_at DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.intros ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage their intros" ON public.intros FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role) AND user_id = auth.uid())
  WITH CHECK (has_role(auth.uid(),'admin'::app_role) AND user_id = auth.uid());
CREATE TRIGGER trg_intros_updated BEFORE UPDATE ON public.intros
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.briefings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  week_start DATE NOT NULL,
  content TEXT NOT NULL,
  stats JSONB NOT NULL DEFAULT '{}',
  emailed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, week_start)
);
ALTER TABLE public.briefings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage their briefings" ON public.briefings FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role) AND user_id = auth.uid())
  WITH CHECK (has_role(auth.uid(),'admin'::app_role) AND user_id = auth.uid());
