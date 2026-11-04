-- ============================================================
-- PHASE 1 ONBOARDING (audit items H1, H2)
-- - enquiries: storage for the public Contact / Admission forms
-- - handle_new_user(): creates the profile row for self-registered users
-- Safe to re-run.
-- ============================================================

-- ------------------------------------------------------------
-- H1: enquiries (written only by the server API with the service role)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  kind TEXT NOT NULL CHECK (kind IN ('contact', 'admission')),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 200),
  email TEXT NOT NULL CHECK (char_length(email) <= 255),
  phone TEXT CHECK (char_length(phone) <= 30),
  subject TEXT CHECK (char_length(subject) <= 200),
  message TEXT NOT NULL CHECK (char_length(message) <= 5000),
  board TEXT CHECK (char_length(board) <= 50),
  grade TEXT CHECK (char_length(grade) <= 50),
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'enrolled', 'closed')),
  notes TEXT CHECK (char_length(notes) <= 5000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status_created
  ON public.enquiries (status, created_at DESC);

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- No anon/authenticated insert policy on purpose: the public forms post to
-- /api/enquiries, which validates, rate-limits and inserts with the service role.
DROP POLICY IF EXISTS "Admins manage enquiries" ON public.enquiries;
CREATE POLICY "Admins manage enquiries" ON public.enquiries
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP TRIGGER IF EXISTS update_enquiries_updated_at ON public.enquiries;
CREATE TRIGGER update_enquiries_updated_at
  BEFORE UPDATE ON public.enquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ------------------------------------------------------------
-- H2: profile creation for self-registration
-- Runs as the table owner, so it works even though signUp() returns no
-- session while email confirmation is pending.
-- Role is taken from user metadata but ONLY 'student' or 'parent' are
-- accepted; anything else falls back to 'student'.
-- Accounts created by admins (app_metadata.provisioned_by = 'admin') are
-- skipped: the admin API routes create those profile rows themselves.
-- app_metadata cannot be set by the client during signUp().
-- ------------------------------------------------------------
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
  IF COALESCE(NEW.raw_app_meta_data ->> 'provisioned_by', '') = 'admin' THEN
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
