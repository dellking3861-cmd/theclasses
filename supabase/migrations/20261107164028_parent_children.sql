-- Parents may read their children's attendance, fees and results, but not the
-- users table, so names came back blank. my_children returns just the names
-- and roll numbers of the caller's own linked children.
CREATE OR REPLACE FUNCTION public.my_children()
RETURNS TABLE (student_id uuid, full_name text, roll_number text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT s.id, u.full_name::text, s.roll_number::text
  FROM public.parents p
  JOIN public.parent_students ps ON ps.parent_id = p.id
  JOIN public.students s ON s.id = ps.student_id
  JOIN public.users u ON u.id = s.user_id
  WHERE p.user_id = auth.uid() AND public.is_active_member()
  ORDER BY u.full_name;
$$;

REVOKE EXECUTE ON FUNCTION public.my_children() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.my_children() TO authenticated, service_role;
