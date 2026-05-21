-- Backfill: grant admin to any current auth user with this email
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE lower(u.email) = 'devinpolicastro@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Trigger: on every new signup with this email, grant admin
CREATE OR REPLACE FUNCTION public.grant_admin_to_owner_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) = 'devinpolicastro@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS grant_admin_to_owner_email_trigger ON auth.users;
CREATE TRIGGER grant_admin_to_owner_email_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.grant_admin_to_owner_email();