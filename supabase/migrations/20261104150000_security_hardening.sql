-- ============================================================
-- 003 SECURITY HARDENING (audit items C1, C3)
-- - Users can no longer change their own role / is_active / branch_id
-- - is_admin() pinned search_path and requires an active account
-- - RLS enabled on parent_students and timetable
-- Safe to re-run: every object is dropped/replaced before creation.
-- Also reconciles drift found on the live project (bkpemjyzktnmamqertnj):
-- parents/parent_students had RLS off, and their hand-written policies
-- referenced their own tables (infinite recursion once RLS is enabled).
-- ============================================================

-- ------------------------------------------------------------
-- C1: is_admin() — fixed search_path, respects is_active
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin' AND is_active
  );
$$;

-- anon must keep EXECUTE: policies granted TO public (e.g. on courses, branches,
-- users) call is_admin() for anonymous visitors too. It returns false for them.
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

-- ------------------------------------------------------------
-- C1: self-update policy with an explicit WITH CHECK
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Browser sessions (anon/authenticated) may only update safe profile columns.
-- Privileged changes go through server routes using the service-role key.
REVOKE UPDATE ON public.users FROM anon, authenticated;
GRANT UPDATE (full_name, phone, avatar_url, last_login_at) ON public.users TO authenticated;

-- Defence in depth: reject role / status / branch changes unless the caller
-- is an active admin, the service role, or a database superuser (SQL editor).
-- SECURITY INVOKER on purpose so current_user is the real caller.
CREATE OR REPLACE FUNCTION public.prevent_privilege_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF (NEW.role      IS DISTINCT FROM OLD.role
   OR NEW.is_active IS DISTINCT FROM OLD.is_active
   OR NEW.branch_id IS DISTINCT FROM OLD.branch_id
   OR NEW.email     IS DISTINCT FROM OLD.email
   OR NEW.id        IS DISTINCT FROM OLD.id)
  AND current_user NOT IN ('service_role', 'postgres', 'supabase_admin')
  AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not allowed to change role, status, branch, email or id'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS users_prevent_privilege_change ON public.users;
CREATE TRIGGER users_prevent_privilege_change
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.prevent_privilege_change();

-- ------------------------------------------------------------
-- C3: parent_students had RLS disabled (world-readable/writable)
-- ------------------------------------------------------------
ALTER TABLE public.parent_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;

-- Drift policies from the live DB: self-referencing (recursive) or comparing
-- parent_id (a parents.id) with auth.uid() (a users.id), so never correct.
DROP POLICY IF EXISTS "Parent_students parent view" ON public.parent_students;
DROP POLICY IF EXISTS "Parent_students admin access" ON public.parent_students;
DROP POLICY IF EXISTS "Parents view linked" ON public.parents;

DROP POLICY IF EXISTS "Admins manage parent links" ON public.parent_students;
CREATE POLICY "Admins manage parent links" ON public.parent_students
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Parents view own links" ON public.parent_students;
CREATE POLICY "Parents view own links" ON public.parent_students
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.parents p
      WHERE p.id = parent_students.parent_id AND p.user_id = auth.uid()
    )
  );

-- parents: admins manage, a parent reads only their own row. Non-recursive,
-- so the "Parents view linked …" policies on other tables can join parents.
DROP POLICY IF EXISTS "Admins full access parents" ON public.parents;
CREATE POLICY "Admins full access parents" ON public.parents
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Parents view own record" ON public.parents;
CREATE POLICY "Parents view own record" ON public.parents
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- ------------------------------------------------------------
-- C3: timetable had RLS disabled
-- ------------------------------------------------------------
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;

-- Replace drift policies from the live DB with the is_admin() versions.
DROP POLICY IF EXISTS "Timetable admin access" ON public.timetable;
DROP POLICY IF EXISTS "Timetable authenticated view" ON public.timetable;

DROP POLICY IF EXISTS "Admins manage timetable" ON public.timetable;
CREATE POLICY "Admins manage timetable" ON public.timetable
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated view timetable" ON public.timetable;
CREATE POLICY "Authenticated view timetable" ON public.timetable
  FOR SELECT TO authenticated
  USING (true);
