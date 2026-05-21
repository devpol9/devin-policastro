CREATE OR REPLACE FUNCTION public.inquiries_autolink_person()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin uuid;
  v_person_id uuid;
  v_phone text;
BEGIN
  -- Find the admin user (single-tenant HQ)
  SELECT user_id INTO v_admin FROM public.user_roles WHERE role = 'admin' LIMIT 1;
  IF v_admin IS NULL THEN
    RETURN NEW;
  END IF;

  v_phone := COALESCE(NEW.phone, NULLIF(NEW.form_data->>'phone',''));

  -- Match existing person by email (case-insensitive)
  SELECT id INTO v_person_id
  FROM public.people
  WHERE user_id = v_admin AND lower(email) = lower(NEW.email)
  LIMIT 1;

  IF v_person_id IS NULL THEN
    INSERT INTO public.people (user_id, name, email, phone, source, tags, notes, meta)
    VALUES (
      v_admin,
      NEW.name,
      NEW.email,
      v_phone,
      'inquiry',
      ARRAY['lead', NEW.service_type]::text[],
      'Auto-created from inquiry on ' || to_char(NEW.created_at, 'YYYY-MM-DD'),
      jsonb_build_object('first_inquiry_id', NEW.id, 'service_type', NEW.service_type)
    )
    RETURNING id INTO v_person_id;
  ELSE
    -- Update existing: bump last_contacted, add service tag, fill phone if missing
    UPDATE public.people
    SET last_contacted_at = NEW.created_at,
        phone = COALESCE(phone, v_phone),
        tags = (
          SELECT ARRAY(SELECT DISTINCT unnest(tags || ARRAY['lead', NEW.service_type]::text[]))
        ),
        updated_at = now()
    WHERE id = v_person_id;
  END IF;

  -- Back-link inquiry → person via meta
  NEW.form_data := COALESCE(NEW.form_data, '{}'::jsonb) || jsonb_build_object('person_id', v_person_id);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS inquiries_autolink_person_trigger ON public.inquiries;
CREATE TRIGGER inquiries_autolink_person_trigger
BEFORE INSERT ON public.inquiries
FOR EACH ROW EXECUTE FUNCTION public.inquiries_autolink_person();

CREATE INDEX IF NOT EXISTS idx_people_user_email_lower ON public.people(user_id, lower(email));