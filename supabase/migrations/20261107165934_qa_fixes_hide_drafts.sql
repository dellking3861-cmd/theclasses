-- Students should not read draft assignments, even through the API.
ALTER POLICY "Students view course assignments" ON assignments USING (
  status <> 'draft' AND EXISTS (SELECT 1 FROM enrollments e JOIN students s ON s.id = e.student_id
          WHERE s.user_id = auth.uid() AND e.course_id = assignments.course_id AND e.status = 'active')
);
