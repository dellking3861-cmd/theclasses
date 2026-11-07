import { requireAuth } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ErrorBoundary } from "@/components/error-boundary";

const parentNav = [
  { href: "/dashboard/parent", label: "Overview", icon: "LayoutDashboard" },
  { href: "/dashboard/parent/attendance", label: "Attendance", icon: "ClipboardCheck" },
  { href: "/dashboard/parent/fees", label: "Fees", icon: "CreditCard" },
  { href: "/dashboard/parent/exams", label: "Exam Results", icon: "BarChart3" },
];

export default async function ParentLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth("parent");
  return (
    <DashboardShell user={user} navItems={parentNav}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </DashboardShell>
  );
}
