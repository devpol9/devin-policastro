ALTER TABLE public.intros ADD COLUMN IF NOT EXISTS context text;
ALTER TABLE public.intros ADD COLUMN IF NOT EXISTS outcome text;
ALTER TABLE public.people ADD COLUMN IF NOT EXISTS relationship_strength smallint;