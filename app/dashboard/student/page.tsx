import { requireAuth } from "@/lib/auth";
import { StudentService } from "@/services";
import { PageHeader, StatCard, Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercentage } from "@/utils/format";
import { BookOpen, ClipboardCheck, FileText, CreditCard } from "lucide-react";

export default async function StudentDashboardPage() {
  const user = await requireAuth("student");

  let enrollments: Awaited<ReturnType<typeof StudentService.getEnrollments>> = [];
  let attendance = { total: 0, present: 0, percentage: 0 };
  let payments: Awaited<ReturnType<typeof StudentService.getPayments>> = [];
  let notifications: Awaited<ReturnType<typeof StudentService.getNotifications>> = [];

  try {
    const profile = await StudentService.getProfile(user.id);
    [enrollments, attendance, payments, notifications] = await Promise.all([
      StudentService.getEnrollments(profile.id),
      StudentService.getAttendanceSummary(profile.id),
      StudentService.getPayments(profile.id),
      StudentService.getNotifications(user.id),
    ]);
  } catch {}

  const pendingFees = payments.filter((p) => p.status === "pending" || p.status === "overdue").length;

  return (
    <div>
      <PageHeader title={`Welcome, ${user.full_name}`} description="Your learning dashboard" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Enrolled Courses" value={enrollments.length} icon={BookOpen} />
        <StatCard title="Attendance" value={formatPercentage(attendance.percentage)} icon={ClipboardCheck} changeType={attendance.percentage >= 75 ? "positive" : "negative"} />
        <StatCard title="Pending Assignments" value="0" icon={FileText} />
        <StatCard title="Fee Due" value={pendingFees} icon={CreditCard} changeType={pendingFees > 0 ? "negative" : "positive"} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>My Courses</CardTitle></CardHeader>
          <CardContent>
            {enrollments.length === 0 ? (
              <p className="text-sm text-slate-500">No enrolled courses yet. Browse available courses to enroll.</p>
            ) : (
              <div className="space-y-3">
                {enrollments.slice(0, 5).map((e) => (
                  <div key={e.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{e.course?.title}</p>
                      <p className="text-xs text-slate-500">{e.progress_percentage}% complete</p>
                    </div>
                    <Badge variant={e.status === "active" ? "success" : "default"}>{e.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Notifications</CardTitle></CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <p className="text-sm text-slate-500">No notifications yet.</p>
            ) : (
              <div className="space-y-3">
                {notifications.slice(0, 5).map((n) => (
                  <div key={n.id} className="py-2 border-b border-slate-100 last:border-0">
                    <p className="text-sm font-medium text-slate-900">{n.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
