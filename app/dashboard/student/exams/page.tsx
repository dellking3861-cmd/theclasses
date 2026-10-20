import { requireAuth } from "@/lib/auth";
import { StudentService } from "@/services";
import { PageHeader, StatCard, Badge, EmptyState } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Award, TrendingUp, AlertCircle } from "lucide-react";

export default async function StudentExamsPage() {
  const user = await requireAuth("student");

  let enrollments: Awaited<ReturnType<typeof StudentService.getEnrollments>> = [];
  let progress: Awaited<ReturnType<typeof StudentService.getProgress>> = [];
  let profile: Awaited<ReturnType<typeof StudentService.getProfile>>;

  try {
    profile = await StudentService.getProfile(user.id);
    enrollments = await StudentService.getEnrollments(profile?.id || user.id);
    progress = await StudentService.getProgress(profile?.id || user.id);
  } catch {
    // Database not available
  }

  const avgScore = progress.length > 0
    ? Math.round(progress.reduce((sum, p) => sum + (p.average_exam_score || 0), 0) / progress.length)
    : 0;
  const passedCount = progress.filter((p) => p.overall_grade === "A" || p.overall_grade === "B" || p.overall_grade === "C").length;
  const totalCourses = progress.length || enrollments.length || 1;

  return (
    <div>
      <PageHeader title="Exams & Quizzes" description="View exam schedules and results" />

      <div className="grid sm:grid-cols-4 gap-6 mb-8">
        <StatCard title="Avg Score" value={`${avgScore}%`} icon={TrendingUp} changeType="positive" />
        <StatCard title="Passed Courses" value={passedCount} icon={Award} changeType="positive" />
        <StatCard title="Total Exams" value={enrollments.length} icon={FileText} />
        <StatCard title="Overall Grade" value={progress[0]?.overall_grade || "—"} icon={AlertCircle} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {progress.length === 0 && enrollments.length === 0 ? (
          <Card className="col-span-full">
            <CardContent>
              <EmptyState
                icon={FileText}
                title="No exams scheduled"
                description="Exam schedules and results will appear here."
              />
            </CardContent>
          </Card>
        ) : (
          progress.length > 0
            ? progress.map((prog) => (
                <Card key={prog.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base font-semibold text-slate-900">
                        {prog.course?.title || "Course"}
                      </CardTitle>
                      <Badge
                        variant={
                          prog.overall_grade === "A" || prog.overall_grade === "B"
                            ? "success"
                            : prog.overall_grade === "F"
                            ? "danger"
                            : "warning"
                        }
                      >
                        Grade: {prog.overall_grade || "—"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-slate-900">
                            {prog.average_exam_score || 0}%
                          </div>
                          <div className="text-xs text-slate-500">Avg Score</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-slate-900">
                            {prog.attendance_percentage || 0}%
                          </div>
                          <div className="text-xs text-slate-500">Attendance</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-slate-900">
                            {prog.assignment_completion_rate || 0}%
                          </div>
                          <div className="text-xs text-slate-500">Assignments</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <FileText className="h-3 w-3" />
                        <span>
                          {prog.lectures_watched || 0}/{prog.total_lectures || 0} lectures watched
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            : enrollments.map((enrollment) => (
                <Card key={enrollment.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base font-semibold text-slate-900">
                        {enrollment.course?.title || "Course"}
                      </CardTitle>
                      <Badge variant={enrollment.status === "active" ? "success" : "default"}>
                        {enrollment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-500 mb-3">
                      {enrollment.course?.description || "No description available."}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <FileText className="h-3 w-3" />
                      <span>No exam results yet</span>
                    </div>
                  </CardContent>
                </Card>
              ))
        )}
      </div>
    </div>
  );
}
