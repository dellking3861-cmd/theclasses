import { requireAuth } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ErrorBoundary } from "@/components/error-boundary";

const teacherNav = [
  { href: "/dashboard/teacher", label: "Overview", icon: "LayoutDashboard" },
  { href: "/dashboard/teacher/notes", label: "Upload Notes", icon: "Upload" },
  { href: "/dashboard/teacher/assignments", label: "Assignments", icon: "PenTool" },
  { href: "/dashboard/teacher/attendance", label: "Mark Attendance", icon: "ClipboardCheck" },
  { href: "/dashboard/teacher/grading", label: "Grade Work", icon: "PenTool" },
  { href: "/dashboard/teacher/lectures", label: "Video Lectures", icon: "Video" },
  { href: "/dashboard/teacher/quizzes", label: "Quiz Generator", icon: "Brain" },
  { href: "/dashboard/teacher/timetable", label: "Timetable", icon: "Calendar" },
  { href: "/dashboard/teacher/communication", label: "Communication", icon: "MessageSquare" },
];

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth("teacher");
  return (
    <DashboardShell user={user} navItems={teacherNav}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </DashboardShell>
  );
}
