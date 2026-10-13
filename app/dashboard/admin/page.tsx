import { AdminService } from "@/services";
import { PageHeader, StatCard } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercentage } from "@/utils/format";
import {
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  ClipboardCheck,
  TrendingUp,
} from "lucide-react";

export default async function AdminDashboardPage() {
  let stats = {
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    attendanceRate: 0,
    activeEnrollments: 0,
  };

  try {
    stats = await AdminService.getDashboardStats();
  } catch {
    // Supabase not configured yet — show zero state
  }

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description="Overview of your educational platform"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value={stats.totalStudents.toLocaleString()}
          icon={Users}
          change="+12% this month"
          changeType="positive"
        />
        <StatCard
          title="Total Teachers"
          value={stats.totalTeachers.toLocaleString()}
          icon={GraduationCap}
        />
        <StatCard
          title="Active Courses"
          value={stats.totalCourses.toLocaleString()}
          icon={BookOpen}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={CreditCard}
          change="+8% this month"
          changeType="positive"
        />
        <StatCard
          title="Pending Payments"
          value={stats.pendingPayments.toLocaleString()}
          icon={CreditCard}
          changeType={stats.pendingPayments > 0 ? "negative" : "neutral"}
        />
        <StatCard
          title="Attendance Rate"
          value={formatPercentage(stats.attendanceRate)}
          icon={ClipboardCheck}
          changeType={stats.attendanceRate >= 80 ? "positive" : "negative"}
        />
        <StatCard
          title="Active Enrollments"
          value={stats.activeEnrollments.toLocaleString()}
          icon={TrendingUp}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "New student enrolled", detail: "Mathematics — AKU-EB", time: "2 hours ago" },
                { action: "Payment received", detail: "PKR 15,000 — Ahmed Hassan", time: "4 hours ago" },
                { action: "Assignment submitted", detail: "Physics Quiz #3", time: "6 hours ago" },
                { action: "New announcement", detail: "Midterm exam schedule", time: "1 day ago" },
              ].map((item) => (
                <div key={item.action + item.time} className="flex items-start justify-between py-3 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.action}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.detail}</p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Add Student", href: "/dashboard/admin/students" },
                { label: "Add Teacher", href: "/dashboard/admin/teachers" },
                { label: "Create Course", href: "/dashboard/admin/courses" },
                { label: "Send Announcement", href: "/dashboard/admin/announcements" },
                { label: "Record Payment", href: "/dashboard/admin/payments" },
                { label: "View Analytics", href: "/dashboard/admin/analytics" },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center justify-center rounded-lg border border-slate-200 p-4 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-colors"
                >
                  {action.label}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
