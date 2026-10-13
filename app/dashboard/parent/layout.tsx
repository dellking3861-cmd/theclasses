import { requireAuth } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ErrorBoundary } from "@/components/error-boundary";
import {
  LayoutDashboard,
  ClipboardCheck,
  FileText,
  CreditCard,
  MessageSquare,
  BarChart3,
  Bell,
} from "lucide-react";

const parentNav = [
  { href: "/dashboard/parent", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/parent/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/dashboard/parent/academics", label: "Academic Reports", icon: FileText },
  { href: "/dashboard/parent/fees", label: "Fee Status", icon: CreditCard },
  { href: "/dashboard/parent/feedback", label: "Teacher Feedback", icon: MessageSquare },
  { href: "/dashboard/parent/exams", label: "Exam Results", icon: BarChart3 },
  { href: "/dashboard/parent/notifications", label: "Notifications", icon: Bell },
];

export default async function ParentLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth("parent");
  return (
    <DashboardShell user={user} navItems={parentNav}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </DashboardShell>
  );
}
