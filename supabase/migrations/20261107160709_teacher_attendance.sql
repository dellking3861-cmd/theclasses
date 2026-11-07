-- Teachers mark attendance for their own courses.
-- course_roster returns only enrolled students' ids and names, and only to the
-- course's (active) teacher or an admin, instead of opening the users table.
CREATE OR REPLACE FUNCTION public.course_roster(p_course_id uuid)
RETURNS TABLE (student_id uuid, full_name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT s.id, u.full_name::text
  FROM public.enrollments e
  JOIN public.students s ON s.id = e.student_id
  JOIN public.users u ON u.id = s.user_id
  WHERE e.course_id = p_course_id
    AND e.status = 'active'
    AND (
      public.is_admin()
      OR EXISTS (
        SELECT 1 FROM public.courses c
        JOIN public.teachers t ON t.id = c.teacher_id
        WHERE c.id = p_course_id AND t.user_id = auth.uid() AND public.is_staff()
      )
    )
  ORDER BY u.full_name;
$$;

REVOKE EXECUTE ON FUNCTION public.course_roster(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.course_roster(uuid) TO authenticated, service_role;

-- Same rule as before, but a deactivated teacher can no longer write
DROP POLICY IF EXISTS "Teachers manage attendance" ON public.attendance;
CREATE POLICY "Teachers manage attendance" ON public.attendance
  FOR ALL TO authenticated
  USING (
    public.is_staff() AND EXISTS (
      SELECT 1 FROM public.courses c
      JOIN public.teachers t ON t.id = c.teacher_id
      WHERE c.id = attendance.course_id AND t.user_id = auth.uid()
    )
  )
  WITH CHECK (
    public.is_staff() AND EXISTS (
      SELECT 1 FROM public.courses c
      JOIN public.teachers t ON t.id = c.teacher_id
      WHERE c.id = attendance.course_id AND t.user_id = auth.uid()
    )
  );

-- Enrollments made from the admin Students page are active; any saved before
-- this fix landed as 'pending' (the column default) and were invisible.
UPDATE public.enrollments SET status = 'active' WHERE status = 'pending';
