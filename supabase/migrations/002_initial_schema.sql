-- Enable required extensions

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student', 'parent');
CREATE TYPE board_type AS ENUM ('aku_eb', 'sindh_board', 'cambridge_o', 'cambridge_a');
CREATE TYPE subject_type AS ENUM (
  'mathematics', 'physics', 'chemistry', 'biology',
  'computer_science', 'english'
);
CREATE TYPE program_type AS ENUM (
  'ai_web_development', 'spoken_english', 'programming_fundamentals',
  'freelancing', 'entry_test_preparation'
);
CREATE TYPE course_type AS ENUM ('board', 'special_program');
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'dropped', 'pending');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'partial', 'refunded');
CREATE TYPE payment_method AS ENUM ('cash', 'bank_transfer', 'jazzcash', 'easypaisa', 'card', 'online');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
CREATE TYPE assignment_status AS ENUM ('draft', 'published', 'closed');
CREATE TYPE submission_status AS ENUM ('pending', 'submitted', 'graded', 'late', 'returned');
CREATE TYPE exam_type AS ENUM ('quiz', 'midterm', 'final', 'practice', 'entry_test');
CREATE TYPE notification_type AS ENUM (
  'announcement', 'fee_due', 'assignment', 'exam', 'attendance',
  'grade', 'general', 'ai'
);
CREATE TYPE lecture_type AS ENUM ('live', 'recorded', 'hybrid');

-- ============================================================
-- BRANCHES
-- ============================================================

CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT "extensions".uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL DEFAULT 'Karachi',
  phone VARCHAR(20),
  email VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- USERS (extends Supabase auth.users)
-- ============================================================

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'student',
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_branch ON users(branch_id);
CREATE INDEX idx_users_email ON users(email);

-- ============================================================
-- TEACHERS
-- ============================================================

CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT "extensions".uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  employee_id VARCHAR(50) UNIQUE,
  specialization subject_type[],
  qualification TEXT,
  experience_years INTEGER DEFAULT 0,
  bio TEXT,
  hire_date DATE,
  salary DECIMAL(12, 2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_teachers_user ON teachers(user_id);

-- ============================================================
-- STUDENTS
-- ============================================================

CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT "extensions".uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  roll_number VARCHAR(50) UNIQUE,
  board board_type,
  grade VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(10),
  address TEXT,
  emergency_contact VARCHAR(20),
  admission_date DATE DEFAULT CURRENT_DATE,
  batch_id UUID,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_students_user ON students(user_id);
CREATE INDEX idx_students_roll ON students(roll_number);
CREATE INDEX idx_students_branch ON students(branch_id);

-- ============================================================
-- PARENTS
-- ============================================================

CREATE TABLE parents (
  id UUID PRIMARY KEY DEFAULT "extensions".uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  occupation VARCHAR(255),
  relationship VARCHAR(50) DEFAULT 'parent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE parent_students (
  id UUID PRIMARY KEY DEFAULT "extensions".uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  relationship VARCHAR(50) DEFAULT 'parent',
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(parent_id, student_id)
);

CREATE INDEX idx_parent_students_parent ON parent_students(parent_id);
CREATE INDEX idx_parent_students_student ON parent_students(student_id);

-- ============================================================
-- BATCHES
-- ============================================================

CREATE TABLE batches (
  id UUID PRIMARY KEY DEFAULT "extensions".uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  max_students INTEGER DEFAULT 30,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE students ADD CONSTRAINT fk_students_batch
  FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE SET NULL;

-- ============================================================
-- COURSES
-- ============================================================

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT "extensions".uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  course_type course_type NOT NULL DEFAULT 'board',
  board board_type,
  subject subject_type,
  program program_type,
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  batch_id UUID REFERENCES batches(id) ON DELETE SET NULL,
  fee_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  duration_months INTEGER DEFAULT 12,
  max_enrollments INTEGER DEFAULT 50,
  thumbnail_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_teacher ON courses(teacher_id);
CREATE INDEX idx_courses_type ON courses(course_type);

-- ============================================================
-- ENROLLMENTS
-- ============================================================

CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT "extensions".uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status enrollment_status NOT NULL DEFAULT 'pending',
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  progress_percentage DECIMAL(5, 2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);

-- ============================================================
-- PAYMENTS
-- ============================================================

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT "extensions".uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  amount DECIMAL(12, 2) NOT NULL,
  paid_amount DECIMAL(12, 2) DEFAULT 0,
  status payment_status NOT NULL DEFAULT 'pending',
  method payment_method,
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  receipt_number VARCHAR(100) UNIQUE,
  notes TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_student ON payments(student_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_due_date ON payments(due_date);

-- ============================================================
-- ATTENDANCE
-- ============================================================

CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT "extensions".uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status attendance_status NOT NULL DEFAULT 'present',
  marked_by UUID REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, course_id, date)
);

CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_course_date ON attendance(course_id, date);

-- ============================================================
-- LECTURES & NOTES
-- ============================================================

CREATE TABLE lectures (
  id UUID PRIMARY KEY DEFAULT "extensions".uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  lecture_type lecture_type NOT NULL DEFAULT 'recorded',
  video_url TEXT,
  duration_minutes INTEGER,
  scheduled_at TIMESTAMPTZ,
  is_published BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lectures_course ON lectures(course_id);

CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT "extensions".uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lecture_id UUID REFERENCES lectures(id) ON DELETE SET NULL,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(50),
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notes_course ON notes(course_id);

-- ============================================================
-- ASSIGNMENTS & SUBMISSIONS
-- ============================================================

CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT "extensions".uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructions TEXT,
  max_marks DECIMAL(6, 2) DEFAULT 100,
  due_date TIMESTAMPTZ NOT NULL,
  status assignment_status NOT NULL DEFAULT 'draft',
  attachment_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assignments_course ON assignments(course_id);
CREATE INDEX idx_assignments_due ON assignments(due_date);

CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT "extensions".uuid_generate_v4(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  content TEXT,
  file_url TEXT,
  status submission_status NOT NULL DEFAULT 'pending',
  marks_obtained DECIMAL(6, 2),
  feedback TEXT,
  submitted_at TIMESTAMPTZ,
  graded_at TIMESTAMPTZ,
  graded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(assignment_id, student_id)
);

CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX idx_submissions_student ON submissions(student_id);

-- ============================================================
-- EXAMS & RESULTS
-- ============================================================

CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT "extensions".uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  exam_type exam_type NOT NULL DEFAULT 'quiz',
  total_marks DECIMAL(6, 2) NOT NULL DEFAULT 100,
  passing_marks DECIMAL(6, 2) DEFAULT 40,
  duration_minutes INTEGER DEFAULT 60,
  scheduled_at TIMESTAMPTZ NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exams_course ON exams(course_id);
CREATE INDEX idx_exams_scheduled ON exams(scheduled_at);

CREATE TABLE exam_results (
  id UUID PRIMARY KEY DEFAULT "extensions".uuid_generate_v4(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  marks_obtained DECIMAL(6, 2),
  percentage DECIMAL(5, 2),
  grade VARCHAR(5),
  is_passed BOOLEAN,
  feedback TEXT,
  attempted_at TIMESTAMPTZ,
  graded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(exam_id, student_id)
);

CREATE INDEX idx_exam_results_exam ON exam_results(exam_id);
CREATE INDEX idx_exam_results_student ON exam_results(student_id);

-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================

CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT "extensions".uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  target_roles user_role[],
  is_pinned BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_announcements_branch ON announcements(branch_id);
CREATE INDEX idx_announcements_published ON announcements(published_at DESC);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT "extensions".uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL DEFAULT 'general',
  reference_id UUID,
  reference_type VARCHAR(50),
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- ============================================================
-- STUDENT PROGRESS
-- ============================================================

CREATE TABLE student_progress (
  id UUID PRIMARY KEY DEFAULT "extensions".uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  attendance_percentage DECIMAL(5, 2) DEFAULT 0,
  assignment_completion_rate DECIMAL(5, 2) DEFAULT 0,
  average_exam_score DECIMAL(5, 2) DEFAULT 0,
  overall_grade VARCHAR(5),
  lectures_watched INTEGER DEFAULT 0,
  total_lectures INTEGER DEFAULT 0,
  last_activity_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

CREATE INDEX idx_student_progress_student ON student_progress(student_id);

-- ============================================================
-- TIMETABLE
-- ============================================================

CREATE TABLE timetable (
  id UUID PRIMARY KEY DEFAULT "extensions".uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room VARCHAR(50),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_timetable_course ON timetable(course_id);
CREATE INDEX idx_timetable_teacher ON timetable(teacher_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parents_updated_at BEFORE UPDATE ON parents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_batches_updated_at BEFORE UPDATE ON batches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lectures_updated_at BEFORE UPDATE ON lectures
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exam_results_updated_at BEFORE UPDATE ON exam_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_progress_updated_at BEFORE UPDATE ON student_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Admins have full access helper function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
DECLARE
  user_role_val user_role;
BEGIN
  SELECT role INTO user_role_val FROM users WHERE id = auth.uid();
  RETURN user_role_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin policies
CREATE POLICY "Admins full access users" ON users
  FOR ALL USING (is_admin());

CREATE POLICY "Admins full access students" ON students
  FOR ALL USING (is_admin());

CREATE POLICY "Admins full access teachers" ON teachers
  FOR ALL USING (is_admin());

CREATE POLICY "Admins full access courses" ON courses
  FOR ALL USING (is_admin());

CREATE POLICY "Admins full access payments" ON payments
  FOR ALL USING (is_admin());

-- Students can view own data
CREATE POLICY "Students view own record" ON students
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Students view enrolled courses" ON courses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM enrollments e
      JOIN students s ON s.id = e.student_id
      WHERE s.user_id = auth.uid() AND e.course_id = courses.id
    ) OR is_published = true
  );

CREATE POLICY "Students view own enrollments" ON enrollments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM students s WHERE s.id = enrollments.student_id AND s.user_id = auth.uid())
  );

CREATE POLICY "Students view own payments" ON payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM students s WHERE s.id = payments.student_id AND s.user_id = auth.uid())
  );

CREATE POLICY "Students view own attendance" ON attendance
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM students s WHERE s.id = attendance.student_id AND s.user_id = auth.uid())
  );

CREATE POLICY "Students view own notifications" ON notifications
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Students view own progress" ON student_progress
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM students s WHERE s.id = student_progress.student_id AND s.user_id = auth.uid())
  );

-- Teachers policies
CREATE POLICY "Teachers view own record" ON teachers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Teachers manage own courses" ON courses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM teachers t WHERE t.id = courses.teacher_id AND t.user_id = auth.uid())
  );

CREATE POLICY "Teachers manage assignments" ON assignments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM teachers t WHERE t.id = assignments.teacher_id AND t.user_id = auth.uid())
  );

CREATE POLICY "Teachers manage attendance" ON attendance
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM courses c
      JOIN teachers t ON t.id = c.teacher_id
      WHERE c.id = attendance.course_id AND t.user_id = auth.uid()
    )
  );

-- Parents can view linked students
CREATE POLICY "Parents view linked students" ON students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM parent_students ps
      JOIN parents p ON p.id = ps.parent_id
      WHERE ps.student_id = students.id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Parents view linked attendance" ON attendance
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM parent_students ps
      JOIN parents p ON p.id = ps.parent_id
      WHERE ps.student_id = attendance.student_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Parents view linked payments" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM parent_students ps
      JOIN parents p ON p.id = ps.parent_id
      WHERE ps.student_id = payments.student_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Parents view linked exam results" ON exam_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM parent_students ps
      JOIN parents p ON p.id = ps.parent_id
      WHERE ps.student_id = exam_results.student_id AND p.user_id = auth.uid()
    )
  );

-- Public can view published courses
CREATE POLICY "Public view published courses" ON courses
  FOR SELECT USING (is_published = true);

-- Branches readable by authenticated users
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users view branches" ON branches
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage branches" ON branches
  FOR ALL USING (is_admin());

-- Batches
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated view batches" ON batches
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage batches" ON batches
  FOR ALL USING (is_admin());

-- ============================================================
-- SEED DATA (Branches)
-- ============================================================

INSERT INTO branches (name, address, city, phone, email) VALUES
  ('The Classes - Gulshan Campus', 'Plot 45, Block 7, Gulshan-e-Iqbal', 'Karachi', '+92-21-34876543', 'gulshan@theclasses.pk'),
  ('The Classes - Clifton Campus', 'Shop 12, Khayaban-e-Shamsheer', 'Karachi', '+92-21-35891234', 'clifton@theclasses.pk'),
  ('The Classes - Lahore Campus', '45-A, MM Alam Road', 'Lahore', '+92-42-35789012', 'lahore@theclasses.pk');
