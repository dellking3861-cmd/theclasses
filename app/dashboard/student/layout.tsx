import { requireAuth } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ErrorBoundary } from "@/components/error-boundary";

const studentNav = [
  { href: "/dashboard/student", label: "Overview", icon: "LayoutDashboard" },
  { href: "/dashboard/student/courses", label: "My Courses", icon: "BookOpen" },
  { href: "/dashboard/student/lectures", label: "Lectures", icon: "Video" },
  { href: "/dashboard/student/notes", label: "Notes", icon: "Download" },
  { href: "/dashboard/student/assignments", label: "Assignments", icon: "PenTool" },
  { href: "/dashboard/student/attendance", label: "Attendance", icon: "ClipboardCheck" },
  { href: "/dashboard/student/exams", label: "Exams", icon: "FileText" },
  { href: "/dashboard/student/fees", label: "Fees", icon: "CreditCard" },
  { href: "/dashboard/student/ai-tutor", label: "AI Tutor", icon: "Brain" },
  { href: "/dashboard/student/progress", label: "Progress", icon: "BarChart3" },
];

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth("student");
  return (
    <DashboardShell user={user} navItems={studentNav}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </DashboardShell>
  );
}
