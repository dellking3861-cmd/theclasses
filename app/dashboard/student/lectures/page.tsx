import { requireAuth } from "@/lib/auth";
import { StudentService, CourseService } from "@/services";
import { PageHeader, StatCard, Badge, EmptyState } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Play, Clock, Eye } from "lucide-react";

export default async function StudentLecturesPage() {
  const user = await requireAuth("student");

  let enrollments: Awaited<ReturnType<typeof StudentService.getEnrollments>> = [];
  let profile: Awaited<ReturnType<typeof StudentService.getProfile>>;

  try {
    profile = await StudentService.getProfile(user.id);
    enrollments = await StudentService.getEnrollments(profile?.id || user.id);
  } catch {
    // Database not available
  }

  const totalLectures = 24;
  const watchedLectures = 18;
  const totalDuration = 480; // minutes
  const watchedDuration = 360; // minutes

  return (
    <div>
      <PageHeader title="Recorded Lectures" description="Watch lectures from your enrolled courses" />

      <div className="grid sm:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Lectures" value={totalLectures} icon={Video} />
        <StatCard title="Watched" value={watchedLectures} icon={Play} changeType="positive" />
        <StatCard title="Total Duration" value={`${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m`} icon={Clock} />
        <StatCard title="Watched Time" value={`${Math.floor(watchedDuration / 60)}h ${watchedDuration % 60}m`} icon={Eye} changeType="positive" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.length === 0 ? (
          <Card className="col-span-full">
            <CardContent>
              <EmptyState
                icon={Video}
                title="No lectures available"
                description="Lectures will appear here once your teachers upload them."
              />
            </CardContent>
          </Card>
        ) : (
          enrollments.map((enrollment) => (
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
                <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Video className="h-12 w-12 text-slate-300" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Lectures</span>
                    <span className="font-medium text-slate-900">
                      {Math.floor(enrollment.progress_percentage || 0) / 4}/24
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all"
                      style={{ width: `${enrollment.progress_percentage || 0}%` }}
                    />
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
                    <Play className="h-4 w-4" />
                    Watch Lecture
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
