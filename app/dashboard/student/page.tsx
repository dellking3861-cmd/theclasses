import { requireAuth } from "@/lib/auth";
import { ReviewPrompt } from "@/components/review-prompt";
import { StudentService } from "@/services";
import { PageHeader, StatCard, Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { BookOpen, ClipboardCheck, FileText, CreditCard, PlayCircle, Download, BarChart3, ArrowRight } from "lucide-react";

const shortcuts = [
  { href: "/dashboard/student/lectures", label: "Watch lectures", hint: "Recorded classes, any time", icon: PlayCircle, tone: "bg-rose-50 text-rose-600" },
  { href: "/dashboard/student/notes", label: "Notes & past papers", hint: "Read or download PDFs", icon: Download, tone: "bg-sky-50 text-sky-600" },
  { href: "/dashboard/student/assignments", label: "Assignments", hint: "What's due next", icon: FileText, tone: "bg-amber-50 text-amber-600" },
  { href: "/dashboard/student/progress", label: "My progress", hint: "Scores and attendance", icon: BarChart3, tone: "bg-emerald-50 text-emerald-600" },
];

export default async function StudentDashboardPage() {
  const user = await requireAuth("student");

  let enrollments: Awaited<ReturnType<typeof StudentService.getEnrollments>> = [];
  let attendance = { total: 0, present: 0, percentage: 0 };
  let payments: Awaited<ReturnType<typeof StudentService.getPayments>> = [];
  let notifications: Awaited<ReturnType<typeof StudentService.getNotifications>> = [];
  let assignments: Awaited<ReturnType<typeof StudentService.getAssignments>> = [];

  try {
    const profile = await StudentService.getProfile(user.id);
    [enrollments, attendance, payments, notifications, assignments] = await Promise.all([
      StudentService.getEnrollments(profile.id),
      StudentService.getAttendanceSummary(profile.id),
      StudentService.getPayments(profile.id),
      StudentService.getNotifications(user.id),
      StudentService.getAssignments(profile.id),
    ]);
  } catch {}

  const pendingFees = payments.filter((p) => p.status === "pending" || p.status === "overdue");
  const feeDue = pendingFees.reduce((sum, p) => sum + Number(p.amount ?? 0) - Number(p.paid_amount ?? 0), 0);
  // RLS returns only this student's own submissions, so none means it's still to do
  const pendingAssignments = assignments.filter((a) => !(a as { submissions?: unknown[] }).submissions?.length).length;
  const firstName = user.full_name?.split(" ")[0] || "there";

  return (
    <div>
      <PageHeader title={`Hey ${firstName} 👋`} description="Pick up where you left off." />

      <ul className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {shortcuts.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className="group flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:p-5"
            >
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${s.tone}`}>
                <s.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="flex items-center gap-1 font-semibold text-slate-900">
                  {s.label}
                  <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden="true" />
                </span>
                <span className="mt-0.5 block text-xs text-slate-500 sm:text-sm">{s.hint}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
        <StatCard title="Courses" value={enrollments.length} icon={BookOpen} />
        <StatCard title="Attendance" value={attendance.total ? `${Math.round(attendance.percentage)}%` : "—"} icon={ClipboardCheck} />
        <StatCard title="Assignments to do" value={pendingAssignments} icon={FileText} />
        <StatCard title="Fee due" value={feeDue > 0 ? `Rs ${feeDue.toLocaleString("en-PK")}` : "All paid"} icon={CreditCard} />
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
      <ReviewPrompt audience="student" />
    </div>
  );
}
