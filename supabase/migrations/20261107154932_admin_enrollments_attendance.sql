-- Admins could not enroll students or record attendance: the only policies were
-- student/parent read access and teacher access for their own courses.
DROP POLICY IF EXISTS "Admins manage enrollments" ON public.enrollments;
CREATE POLICY "Admins manage enrollments" ON public.enrollments
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins manage attendance" ON public.attendance;
CREATE POLICY "Admins manage attendance" ON public.attendance
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
