-- Found by the live QA run.

-- Admins could not create assignments, and enrolled students could not see them.
CREATE POLICY "Admins manage assignments" ON assignments FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Students view course assignments" ON assignments FOR SELECT USING (
  EXISTS (SELECT 1 FROM enrollments e JOIN students s ON s.id = e.student_id
          WHERE s.user_id = auth.uid() AND e.course_id = assignments.course_id AND e.status = 'active')
);

-- exam_results.student_id is students.id, not the login id, so students never saw their results.
DROP POLICY IF EXISTS "Exam results student view" ON exam_results;
CREATE POLICY "Exam results student view" ON exam_results FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM students s WHERE s.id = exam_results.student_id AND s.user_id = auth.uid())
);

-- Admins could only edit announcements they wrote themselves.
CREATE POLICY "Admins manage announcements" ON announcements FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Negative fees and paying more than the fee were accepted.
ALTER TABLE payments ADD CONSTRAINT payments_amounts_valid CHECK (amount >= 0 AND paid_amount >= 0 AND paid_amount <= amount);
