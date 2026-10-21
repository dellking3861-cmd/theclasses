import { requireAuth } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ErrorBoundary } from "@/components/error-boundary";

const adminNav = [
  { href: "/dashboard/admin", label: "Overview", icon: "LayoutDashboard" },
  { href: "/dashboard/admin/students", label: "Students", icon: "Users" },
  { href: "/dashboard/admin/teachers", label: "Teachers", icon: "GraduationCap" },
  { href: "/dashboard/admin/courses", label: "Courses", icon: "BookOpen" },
  { href: "/dashboard/admin/fees", label: "Fee Management", icon: "CreditCard" },
  { href: "/dashboard/admin/attendance", label: "Attendance", icon: "ClipboardCheck" },
  { href: "/dashboard/admin/payments", label: "Payments", icon: "CreditCard" },
  { href: "/dashboard/admin/analytics", label: "Analytics", icon: "BarChart3" },
  { href: "/dashboard/admin/exams", label: "Exams", icon: "FileText" },
  { href: "/dashboard/admin/assignments", label: "Assignments", icon: "FileText" },
  { href: "/dashboard/admin/announcements", label: "Announcements", icon: "Megaphone" },
  { href: "/dashboard/admin/batches", label: "Batches", icon: "Layers" },
  { href: "/dashboard/admin/branches", label: "Branches", icon: "Building2" },
  { href: "/dashboard/admin/parents", label: "Parents", icon: "UserCheck" },
  { href: "/dashboard/admin/blog", label: "Blog Portal", icon: "FileText" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth("admin");

  return (
    <DashboardShell user={user} navItems={adminNav}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </DashboardShell>
  );
}
