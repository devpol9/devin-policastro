-- Defense-in-depth: explicit RESTRICTIVE deny policies on user_roles
CREATE POLICY "Deny all inserts on user_roles"
ON public.user_roles AS RESTRICTIVE
FOR INSERT TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "Deny all updates on user_roles"
ON public.user_roles AS RESTRICTIVE
FOR UPDATE TO anon, authenticated
USING (false) WITH CHECK (false);

CREATE POLICY "Deny all deletes on user_roles"
ON public.user_roles AS RESTRICTIVE
FOR DELETE TO anon, authenticated
USING (false);