-- Reusable updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Ventures table
CREATE TABLE public.ventures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT,
  description TEXT,
  accent_color TEXT NOT NULL DEFAULT 'hsl(24 32% 52%)',
  icon TEXT,
  website_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','paused','archived','idea')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, slug)
);

CREATE INDEX idx_ventures_user_sort ON public.ventures(user_id, sort_order);

ALTER TABLE public.ventures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage their ventures"
ON public.ventures
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) AND user_id = auth.uid())
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) AND user_id = auth.uid());

CREATE TRIGGER update_ventures_updated_at
BEFORE UPDATE ON public.ventures
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed function
CREATE OR REPLACE FUNCTION public.seed_default_ventures(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.ventures (user_id, slug, name, short_name, description, accent_color, icon, website_url, status, sort_order)
  VALUES
    (target_user_id, 'impact-zone', 'Impact Zone NJ', 'IZ', 'Bergen County''s largest gym — 51,000 sq ft', 'hsl(0 65% 50%)', 'Dumbbell', 'https://impactzonenj.com', 'active', 1),
    (target_user_id, '2thirty', '2THIRTY', '230', '5-in-1 Hydration+ Mixer', 'hsl(340 70% 60%)', 'GlassWater', 'https://drink2thirty.com', 'active', 2),
    (target_user_id, 'valence', 'Valence', 'VLC', 'Gym management SaaS', 'hsl(210 75% 55%)', 'Building2', 'https://meetvalence.com', 'active', 3),
    (target_user_id, 'onlyshitz', 'OnlyShitz', 'OS', 'Free-to-play social casino', 'hsl(140 55% 45%)', 'Gamepad2', 'https://onlyshitz.com', 'active', 4),
    (target_user_id, 'creative-vision', 'Creative Vision', 'CV', 'Manufacturing & private label', 'hsl(270 35% 55%)', 'Factory', NULL, 'active', 5),
    (target_user_id, 'personal', 'Personal Brand', 'DP', 'devinpolicastro.com — the connector', 'hsl(24 32% 52%)', 'User', 'https://devinpolicastro.com', 'active', 6),
    (target_user_id, 'new-projects', 'New Projects', 'NEW', 'Ideas not yet promoted to ventures', 'hsl(30 8% 50%)', 'Sparkles', NULL, 'active', 99)
  ON CONFLICT (user_id, slug) DO NOTHING;
END;
$$;

-- Run seed for existing admin
DO $$
DECLARE
  admin_id UUID;
BEGIN
  SELECT id INTO admin_id FROM auth.users WHERE email = 'devinpolicastro@gmail.com' LIMIT 1;
  IF admin_id IS NOT NULL THEN
    PERFORM public.seed_default_ventures(admin_id);
  END IF;
END $$;