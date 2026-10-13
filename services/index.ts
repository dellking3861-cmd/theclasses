import { createClient } from "@/lib/supabase/server";
import type {
  Student,
  Teacher,
  Course,
  Payment,
  Attendance,
  Enrollment,
  DashboardStats,
  Announcement,
  Exam,
  Assignment,
  Branch,
  Batch,
  StudentProgress,
  Notification,
  Parent,
} from "@/types";
import { createSuccessResponse, createErrorResponse, handleApiError } from "./api";

export class AdminService {
  static async getDashboardStats(): Promise<DashboardStats> {
    const supabase = await createClient();

    const [
      { count: totalStudents },
      { count: totalTeachers },
      { count: totalCourses },
      { data: payments },
      { count: activeEnrollments },
      { data: attendance },
    ] = await Promise.all([
      supabase.from("students").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("teachers").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("courses").select("*", { count: "exact", head: true }),
      supabase.from("payments").select("amount, paid_amount, status"),
      supabase.from("enrollments").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("attendance").select("status").gte("date", new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0]),
    ]);

    const totalRevenue = payments?.reduce((sum, p) => sum + (p.paid_amount || 0), 0) || 0;
    const pendingPayments = payments?.filter((p) => p.status === "pending" || p.status === "overdue").length || 0;
    const presentCount = attendance?.filter((a) => a.status === "present").length || 0;
    const attendanceRate = attendance?.length ? (presentCount / attendance.length) * 100 : 0;

    return {
      totalStudents: totalStudents || 0,
      totalTeachers: totalTeachers || 0,
      totalCourses: totalCourses || 0,
      totalRevenue,
      pendingPayments,
      attendanceRate,
      activeEnrollments: activeEnrollments || 0,
    };
  }

  static async getStudents(page = 1, pageSize = 20) {
    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await supabase
      .from("students")
      .select("*, user:users(*), branch:branches(*), batch:batches(*)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { data: data as Student[], total: count || 0, page, pageSize };
  }

  static async getTeachers(page = 1, pageSize = 20) {
    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await supabase
      .from("teachers")
      .select("*, user:users(*)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { data: data as Teacher[], total: count || 0, page, pageSize };
  }

  static async getCourses(page = 1, pageSize = 20) {
    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await supabase
      .from("courses")
      .select("*, teacher:teachers(*, user:users(*)), branch:branches(*)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { data: data as Course[], total: count || 0, page, pageSize };
  }

  static async getPayments(page = 1, pageSize = 20) {
    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await supabase
      .from("payments")
      .select("*, student:students(*, user:users(*)), course:courses(*)", { count: "exact" })
      .order("due_date", { ascending: true })
      .range(from, to);

    if (error) throw error;
    return { data: data as Payment[], total: count || 0, page, pageSize };
  }

  static async getAttendance(courseId?: string, date?: string) {
    const supabase = await createClient();
    let query = supabase
      .from("attendance")
      .select("*, student:students(*, user:users(*)), course:courses(*)");

    if (courseId) query = query.eq("course_id", courseId);
    if (date) query = query.eq("date", date);

    const { data, error } = await query.order("date", { ascending: false }).limit(100);
    if (error) throw error;
    return data as Attendance[];
  }

  static async getAnnouncements() {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("announcements")
      .select("*, author:users(*)")
      .order("published_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return data as Announcement[];
  }

  static async getBranches() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("branches").select("*").eq("is_active", true);
    if (error) throw error;
    return data as Branch[];
  }

  static async getBatches(branchId?: string) {
    const supabase = await createClient();
    let query = supabase.from("batches").select("*, branch:branches(*)").eq("is_active", true);
    if (branchId) query = query.eq("branch_id", branchId);
    const { data, error } = await query;
    if (error) throw error;
    return data as Batch[];
  }

  static async getExams() {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("exams")
      .select("*, course:courses(*), teacher:teachers(*, user:users(*))")
      .order("scheduled_at", { ascending: true });
    if (error) throw error;
    return data as Exam[];
  }
}

export class StudentService {
  static async getProfile(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("students")
      .select("*, user:users(*), branch:branches(*), batch:batches(*)")
      .eq("user_id", userId)
      .single();
    if (error) throw error;
    return data as Student;
  }

  static async getEnrollments(studentId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("enrollments")
      .select("*, course:courses(*, teacher:teachers(*, user:users(*)))")
      .eq("student_id", studentId)
      .order("enrolled_at", { ascending: false });
    if (error) throw error;
    return data as Enrollment[];
  }

  static async getProgress(studentId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("student_progress")
      .select("*, course:courses(*)")
      .eq("student_id", studentId);
    if (error) throw error;
    return data as StudentProgress[];
  }

  static async getAssignments(studentId: string) {
    const supabase = await createClient();
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("course_id")
      .eq("student_id", studentId)
      .eq("status", "active");

    if (!enrollments?.length) return [];

    const courseIds = enrollments.map((e) => e.course_id);
    const { data, error } = await supabase
      .from("assignments")
      .select("*, course:courses(*), submissions!left(*)")
      .in("course_id", courseIds)
      .eq("status", "published")
      .order("due_date", { ascending: true });

    if (error) throw error;
    return data as Assignment[];
  }

  static async getPayments(studentId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("payments")
      .select("*, course:courses(*)")
      .eq("student_id", studentId)
      .order("due_date", { ascending: true });
    if (error) throw error;
    return data as Payment[];
  }

  static async getNotifications(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    return data as Notification[];
  }

  static async getAttendanceSummary(studentId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("attendance")
      .select("status, course_id")
      .eq("student_id", studentId);
    if (error) throw error;

    const total = data?.length || 0;
    const present = data?.filter((a) => a.status === "present" || a.status === "late").length || 0;
    return { total, present, percentage: total ? (present / total) * 100 : 0 };
  }
}

export class TeacherService {
  static async getProfile(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("teachers")
      .select("*, user:users(*)")
      .eq("user_id", userId)
      .single();
    if (error) throw error;
    return data as Teacher;
  }

  static async getCourses(teacherId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("courses")
      .select("*, branch:branches(*), batch:batches(*)")
      .eq("teacher_id", teacherId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Course[];
  }

  static async getAssignments(teacherId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("assignments")
      .select("*, course:courses(*), submissions(count)")
      .eq("teacher_id", teacherId)
      .order("due_date", { ascending: true });
    if (error) throw error;
    return data as Assignment[];
  }

  static async getStudentsForCourse(courseId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("enrollments")
      .select("*, student:students(*, user:users(*))")
      .eq("course_id", courseId)
      .eq("status", "active");
    if (error) throw error;
    return data;
  }
}

export class ParentService {
  static async getProfile(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("parents")
      .select("*, user:users(*)")
      .eq("user_id", userId)
      .single();
    if (error) throw error;
    return data as Parent;
  }

  static async getLinkedStudents(parentId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("parent_students")
      .select("*, student:students(*, user:users(*), branch:branches(*))")
      .eq("parent_id", parentId);
    if (error) throw error;
    return data;
  }

  static async getStudentAttendance(studentId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("attendance")
      .select("*, course:courses(*)")
      .eq("student_id", studentId)
      .order("date", { ascending: false })
      .limit(30);
    if (error) throw error;
    return data as Attendance[];
  }

  static async getStudentPayments(studentId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("payments")
      .select("*, course:courses(*)")
      .eq("student_id", studentId)
      .order("due_date", { ascending: false });
    if (error) throw error;
    return data as Payment[];
  }

  static async getStudentExamResults(studentId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("exam_results")
      .select("*, exam:exams(*, course:courses(*))")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  }
}

export class CourseService {
  static async getPublishedCourses() {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("courses")
      .select("*, teacher:teachers(*, user:users(*)), branch:branches(*)")
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Course[];
  }

  static async getCourseBySlug(slug: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("courses")
      .select("*, teacher:teachers(*, user:users(*)), branch:branches(*)")
      .eq("slug", slug)
      .single();
    if (error) throw error;
    return data as Course;
  }
}

export { createSuccessResponse, createErrorResponse, handleApiError };
