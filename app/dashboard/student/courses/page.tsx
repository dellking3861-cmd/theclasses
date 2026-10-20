import { requireAuth } from "@/lib/auth";
import { StudentService, CourseService } from "@/services";
import { PageHeader, StatCard, Badge, EmptyState } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function StudentCoursesPage() {
  const user = await requireAuth("student");

  let enrollments: Awaited<ReturnType<typeof StudentService.getEnrollments>> = [];
  let allCourses: Awaited<ReturnType<typeof CourseService.getPublishedCourses>> = [];
  let profile: Awaited<ReturnType<typeof StudentService.getProfile>>;

  try {
    profile = await StudentService.getProfile(user.id);
    enrollments = await StudentService.getEnrollments(profile?.id || user.id);
    const publishedCourses = await CourseService.getPublishedCourses();
    allCourses = publishedCourses || [];
  } catch {
    // Database not available
  }

  const activeCount = enrollments.filter((e) => e.status === "active").length;
  const completedCount = enrollments.filter((e) => e.status === "completed").length;
  const avgProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce((sum, e) => sum + (e.progress_percentage || 0), 0) /
            enrollments.length
        )
      : 0;

  return (
    <div>
      <PageHeader title="My Courses" description="View and manage your enrolled courses" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Active Courses" value={activeCount} icon={BookOpen} changeType="positive" />
        <StatCard title="Completed" value={completedCount} icon={CheckCircle2} changeType="positive" />
        <StatCard title="Avg Progress" value={`${avgProgress}%`} icon={TrendingUp} />
        <StatCard title="Total Courses" value={allCourses.length} icon={Clock} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.length === 0 ? (
          <Card className="col-span-full">
            <CardContent>
              <EmptyState
                icon={BookOpen}
                title="No enrolled courses"
                description="Browse available courses and enroll to start learning."
                action={
                  <Link href="/courses">
                    <Button>Browse Courses</Button>
                  </Link>
                }
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
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-medium text-slate-900">
                      {enrollment.progress_percentage || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all"
                      style={{ width: `${enrollment.progress_percentage || 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>
                      {enrollment.course?.teacher?.user?.full_name || "Teacher"}
                    </span>
                    <span>
                      {enrollment.enrolled_at
                        ? new Date(enrollment.enrolled_at).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                  <Link href={`/dashboard/student/courses/${enrollment.course?.id}`}>
                    <Button size="sm" className="w-full" variant="outline">
                      Continue Learning
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {enrollments.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Available Courses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCourses
              .filter(
                (c) =>
                  !enrollments.some((e) => e.course_id === c.id && e.status === "active")
              )
              .slice(0, 3)
              .map((course) => (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-slate-900">
                      {course.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                      {course.description || "No description available."}
                    </p>
                    <div className="flex justify-between text-xs text-slate-500 mb-4">
                      <span>
                        {course.teacher?.user?.full_name || "Teacher"}
                      </span>
                      <span>
                        {course.duration_months || 12} months
                      </span>
                    </div>
                    <Link href={`/courses/${course.slug}`}>
                      <Button size="sm" className="w-full" variant="outline">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
