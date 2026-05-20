
-- =========================
-- content_items
-- =========================
CREATE TABLE public.content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  venture_id UUID REFERENCES public.ventures(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('instagram','tiktok','youtube','x','linkedin','email','blog','threads','podcast','other')),
  content_type TEXT NOT NULL CHECK (content_type IN ('reel','carousel','static','story','long_video','short','email_blast','blog_post','podcast_ep','thread','other')),
  caption TEXT,
  hashtags TEXT[] NOT NULL DEFAULT '{}',
  scheduled_at TIMESTAMPTZ,
  posted_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'idea' CHECK (status IN ('idea','drafting','ready','scheduled','posted','archived')),
  hook TEXT,
  notes TEXT,
  external_url TEXT,
  performance_stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  pillar TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_content_items_user_status ON public.content_items(user_id, status);
CREATE INDEX idx_content_items_user_scheduled ON public.content_items(user_id, scheduled_at) WHERE scheduled_at IS NOT NULL;
CREATE INDEX idx_content_items_user_venture ON public.content_items(user_id, venture_id);
CREATE INDEX idx_content_items_user_project ON public.content_items(user_id, project_id);

ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage their content"
ON public.content_items
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role) AND user_id = auth.uid())
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role) AND user_id = auth.uid());

-- updated_at trigger
CREATE TRIGGER trg_content_items_updated_at
BEFORE UPDATE ON public.content_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- posted_at auto-management
CREATE OR REPLACE FUNCTION public.set_posted_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status = 'posted' AND NEW.posted_at IS NULL THEN
      NEW.posted_at = now();
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.status = 'posted' AND OLD.status <> 'posted' THEN
      NEW.posted_at = now();
    ELSIF NEW.status <> 'posted' AND OLD.status = 'posted' THEN
      NEW.posted_at = NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_content_items_set_posted_at
BEFORE INSERT OR UPDATE ON public.content_items
FOR EACH ROW EXECUTE FUNCTION public.set_posted_at();

-- =========================
-- content_attachments
-- =========================
CREATE TABLE public.content_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  mime_type TEXT,
  file_size_bytes BIGINT,
  file_name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_content_attachments_item_sort ON public.content_attachments(content_item_id, sort_order);

ALTER TABLE public.content_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage their attachments"
ON public.content_attachments
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  AND content_item_id IN (SELECT id FROM public.content_items WHERE user_id = auth.uid())
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  AND content_item_id IN (SELECT id FROM public.content_items WHERE user_id = auth.uid())
);

-- =========================
-- content_pillars
-- =========================
CREATE TABLE public.content_pillars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'hsl(24 32% 52%)',
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, name)
);

ALTER TABLE public.content_pillars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage their pillars"
ON public.content_pillars
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role) AND user_id = auth.uid())
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role) AND user_id = auth.uid());

-- Seed default pillars for existing admin user(s)
INSERT INTO public.content_pillars (user_id, name, color, description, sort_order)
SELECT ur.user_id, p.name, p.color, p.description, p.sort_order
FROM public.user_roles ur
CROSS JOIN (VALUES
  ('Fitness & Training', 'hsl(0 65% 50%)', 'Impact Zone content — workouts, programming, gym life', 1),
  ('Hydration & Wellness', 'hsl(340 70% 60%)', '2THIRTY content — drinks, recovery, daily ritual', 2),
  ('Building in Public', 'hsl(210 75% 55%)', 'Valence, OnlyShitz, entrepreneurship and process', 3),
  ('Personal Brand', 'hsl(24 32% 52%)', 'Connector, lifestyle, NJ-rooted stories', 4),
  ('Behind the Scenes', 'hsl(30 8% 50%)', 'Raw, unpolished process content', 5)
) AS p(name, color, description, sort_order)
WHERE ur.role = 'admin'::public.app_role
ON CONFLICT (user_id, name) DO NOTHING;

-- =========================
-- storage bucket: content-media (private)
-- =========================
INSERT INTO storage.buckets (id, name, public)
VALUES ('content-media', 'content-media', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admins upload to content-media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'content-media' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins read content-media"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'content-media' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins delete from content-media"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'content-media' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins update content-media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'content-media' AND public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (bucket_id = 'content-media' AND public.has_role(auth.uid(), 'admin'::public.app_role));
