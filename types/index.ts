import type { UserRole } from "@/lib/constants";

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  branch_id: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Batch {
  id: string;
  name: string;
  branch_id: string;
  start_date: string;
  end_date: string | null;
  max_students: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  branch?: Branch;
}

export interface Teacher {
  id: string;
  user_id: string;
  employee_id: string | null;
  specialization: string[] | null;
  qualification: string | null;
  experience_years: number;
  bio: string | null;
  hire_date: string | null;
  salary: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Student {
  id: string;
  user_id: string;
  roll_number: string | null;
  board: string | null;
  grade: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  emergency_contact: string | null;
  admission_date: string | null;
  batch_id: string | null;
  branch_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  batch?: Batch;
  branch?: Branch;
}

export interface Parent {
  id: string;
  user_id: string;
  occupation: string | null;
  relationship: string;
  created_at: string;
  updated_at: string;
  user?: User;
  students?: Student[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  course_type: "board" | "special_program";
  board: string | null;
  subject: string | null;
  program: string | null;
  teacher_id: string | null;
  branch_id: string | null;
  batch_id: string | null;
  fee_amount: number;
  duration_months: number;
  max_enrollments: number;
  thumbnail_url: string | null;
  is_published: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  teacher?: Teacher;
  branch?: Branch;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  status: "active" | "completed" | "dropped" | "pending";
  enrolled_at: string;
  completed_at: string | null;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
  course?: Course;
  student?: Student;
}

export interface Payment {
  id: string;
  student_id: string;
  course_id: string | null;
  amount: number;
  paid_amount: number;
  status: "pending" | "paid" | "overdue" | "partial" | "refunded";
  method: string | null;
  due_date: string;
  paid_at: string | null;
  receipt_number: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  student?: Student;
  course?: Course;
}

export interface Attendance {
  id: string;
  student_id: string;
  course_id: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  marked_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  student?: Student;
  course?: Course;
}

export interface Lecture {
  id: string;
  course_id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  lecture_type: "live" | "recorded" | "hybrid";
  video_url: string | null;
  duration_minutes: number | null;
  scheduled_at: string | null;
  is_published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  course_id: string;
  lecture_id: string | null;
  teacher_id: string;
  title: string;
  file_url: string;
  file_size: number | null;
  file_type: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: string;
  course_id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  instructions: string | null;
  max_marks: number;
  due_date: string;
  status: "draft" | "published" | "closed";
  attachment_url: string | null;
  created_at: string;
  updated_at: string;
  course?: Course;
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  content: string | null;
  file_url: string | null;
  status: "pending" | "submitted" | "graded" | "late" | "returned";
  marks_obtained: number | null;
  feedback: string | null;
  submitted_at: string | null;
  graded_at: string | null;
  graded_by: string | null;
  created_at: string;
  updated_at: string;
  assignment?: Assignment;
}

export interface Exam {
  id: string;
  course_id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  exam_type: "quiz" | "midterm" | "final" | "practice" | "entry_test";
  total_marks: number;
  passing_marks: number;
  duration_minutes: number;
  scheduled_at: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  course?: Course;
}

export interface ExamResult {
  id: string;
  exam_id: string;
  student_id: string;
  marks_obtained: number | null;
  percentage: number | null;
  grade: string | null;
  is_passed: boolean | null;
  feedback: string | null;
  attempted_at: string | null;
  graded_at: string | null;
  created_at: string;
  updated_at: string;
  exam?: Exam;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author_id: string;
  branch_id: string | null;
  course_id: string | null;
  target_roles: UserRole[] | null;
  is_pinned: boolean;
  published_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  author?: User;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  reference_id: string | null;
  reference_type: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface StudentProgress {
  id: string;
  student_id: string;
  course_id: string;
  attendance_percentage: number;
  assignment_completion_rate: number;
  average_exam_score: number;
  overall_grade: string | null;
  lectures_watched: number;
  total_lectures: number;
  last_activity_at: string | null;
  created_at: string;
  updated_at: string;
  course?: Course;
}

export interface TimetableEntry {
  id: string;
  course_id: string;
  teacher_id: string;
  branch_id: string | null;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  course?: Course;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalRevenue: number;
  pendingPayments: number;
  attendanceRate: number;
  activeEnrollments: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
