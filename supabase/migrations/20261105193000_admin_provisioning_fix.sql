-- Fix: admin-created accounts were reported as "Failed to create".
-- GoTrue's admin createUser inserts auth.users BEFORE it writes app_metadata,
-- so the trigger never saw app_metadata.provisioned_by and created the
-- profile itself; the admin route's own insert then hit a duplicate key.
-- The admin routes now also tag user_metadata (present at INSERT time).
-- A self-registering user who sets this tag only skips their own profile
-- creation; it grants nothing.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  meta_role TEXT := NEW.raw_user_meta_data ->> 'role';
  new_role public.user_role;
BEGIN
  IF COALESCE(NEW.raw_app_meta_data ->> 'provisioned_by', '') = 'admin'
     OR COALESCE(NEW.raw_user_meta_data ->> 'provisioned_by', '') = 'admin' THEN
    RETURN NEW;
  END IF;

  new_role := CASE WHEN meta_role = 'parent'
                   THEN 'parent'::public.user_role
                   ELSE 'student'::public.user_role END;

  INSERT INTO public.users (id, email, full_name, phone, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NULLIF(trim(NEW.raw_user_meta_data ->> 'full_name'), ''), split_part(NEW.email, '@', 1)),
    NULLIF(trim(NEW.raw_user_meta_data ->> 'phone'), ''),
    new_role,
    true
  )
  ON CONFLICT (id) DO NOTHING;

  IF new_role = 'student' THEN
    INSERT INTO public.students (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  ELSE
    INSERT INTO public.parents (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
