CREATE OR REPLACE FUNCTION public.inquiries_abuse_guard()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count int;
BEGIN
  -- Honeypot: bots fill hidden "website" field
  IF NEW.form_data ? 'website' AND length(coalesce(NEW.form_data->>'website','')) > 0 THEN
    RAISE EXCEPTION 'Invalid submission';
  END IF;

  -- Throttle: max 5 inquiries per 10 min per email
  SELECT count(*) INTO recent_count
  FROM public.inquiries
  WHERE email = NEW.email
    AND created_at > now() - interval '10 minutes';

  IF recent_count >= 5 THEN
    RAISE EXCEPTION 'Too many submissions. Please try again later.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS inquiries_abuse_guard_trigger ON public.inquiries;
CREATE TRIGGER inquiries_abuse_guard_trigger
BEFORE INSERT ON public.inquiries
FOR EACH ROW EXECUTE FUNCTION public.inquiries_abuse_guard();

CREATE INDEX IF NOT EXISTS idx_inquiries_email_created ON public.inquiries(email, created_at DESC);