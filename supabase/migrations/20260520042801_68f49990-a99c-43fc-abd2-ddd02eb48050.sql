
-- PROJECTS
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  venture_id UUID REFERENCES public.ventures(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'backlog' CHECK (status IN ('backlog','planning','in-progress','blocked','done','archived')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  due_date DATE,
  percent_complete INTEGER NOT NULL DEFAULT 0 CHECK (percent_complete BETWEEN 0 AND 100),
  sort_order INTEGER NOT NULL DEFAULT 0,
  source_type TEXT,
  source_id UUID,
  tags TEXT[] NOT NULL DEFAULT '{}',
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_projects_user_status_sort ON public.projects (user_id, status, sort_order);
CREATE INDEX idx_projects_user_venture ON public.projects (user_id, venture_id);
CREATE INDEX idx_projects_user_due ON public.projects (user_id, due_date) WHERE due_date IS NOT NULL;

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage their projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role) AND user_id = auth.uid())
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role) AND user_id = auth.uid());

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.set_completed_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status = 'done' AND NEW.completed_at IS NULL THEN
      NEW.completed_at = now();
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.status = 'done' AND OLD.status <> 'done' THEN
      NEW.completed_at = now();
    ELSIF NEW.status <> 'done' AND OLD.status = 'done' THEN
      NEW.completed_at = NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER projects_set_completed_at
  BEFORE INSERT OR UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_completed_at();

-- SUBTASKS
CREATE TABLE public.subtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_subtasks_project_sort ON public.subtasks (project_id, sort_order);

ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage their subtasks"
  ON public.subtasks FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role)
    AND project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid()))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role)
    AND project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid()));

CREATE TRIGGER subtasks_updated_at
  BEFORE UPDATE ON public.subtasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- INQUIRIES: link to converted project
ALTER TABLE public.inquiries
  ADD COLUMN converted_project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL;

CREATE INDEX idx_inquiries_converted_project ON public.inquiries (converted_project_id);
