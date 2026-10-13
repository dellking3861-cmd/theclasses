import { requireAuth } from "@/lib/auth";
import { TeacherService } from "@/services";
import { PageHeader, StatCard, Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, PenTool, Users, Calendar } from "lucide-react";

export default async function TeacherDashboardPage() {
  const user = await requireAuth("teacher");

  let courses: Awaited<ReturnType<typeof TeacherService.getCourses>> = [];
  let assignments: Awaited<ReturnType<typeof TeacherService.getAssignments>> = [];

  try {
    const profile = await TeacherService.getProfile(user.id);
    [courses, assignments] = await Promise.all([
      TeacherService.getCourses(profile.id),
      TeacherService.getAssignments(profile.id),
    ]);
  } catch {}

  return (
    <div>
      <PageHeader title={`Welcome, ${user.full_name}`} description="Teacher dashboard" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="My Courses" value={courses.length} icon={BookOpen} />
        <StatCard title="Active Assignments" value={assignments.filter((a) => a.status === "published").length} icon={PenTool} />
        <StatCard title="Total Students" value="—" icon={Users} />
        <StatCard title="Classes Today" value="—" icon={Calendar} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>My Courses</CardTitle></CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <p className="text-sm text-slate-500">No courses assigned yet.</p>
            ) : (
              <div className="space-y-3">
                {courses.map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{c.title}</p>
                      <p className="text-xs text-slate-500">{c.branch?.name}</p>
                    </div>
                    <Badge variant={c.is_published ? "success" : "warning"}>{c.is_published ? "Active" : "Draft"}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Upcoming Assignments</CardTitle></CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <p className="text-sm text-slate-500">No assignments created yet.</p>
            ) : (
              <div className="space-y-3">
                {assignments.slice(0, 5).map((a) => (
                  <div key={a.id} className="py-2 border-b border-slate-100 last:border-0">
                    <p className="text-sm font-medium text-slate-900">{a.title}</p>
                    <p className="text-xs text-slate-500">{a.course?.title} · Due: {new Date(a.due_date).toLocaleDateString()}</p>
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
