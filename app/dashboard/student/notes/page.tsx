import { requireAuth } from "@/lib/auth";
import { StudentService, CourseService } from "@/services";
import { PageHeader, StatCard, Badge, EmptyState } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, BookOpen } from "lucide-react";

export default async function StudentNotesPage() {
  const user = await requireAuth("student");

  let enrollments: Awaited<ReturnType<typeof StudentService.getEnrollments>> = [];
  let profile: Awaited<ReturnType<typeof StudentService.getProfile>>;

  try {
    profile = await StudentService.getProfile(user.id);
    enrollments = await StudentService.getEnrollments(profile?.id || user.id);
  } catch {
    // Database not available
  }

  return (
    <div>
      <PageHeader title="Study Notes" description="Download notes from your courses" />

      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Notes" value="12" icon={FileText} />
        <StatCard title="Courses" value={enrollments.length} icon={BookOpen} />
        <StatCard title="Downloads" value="8" icon={Download} changeType="positive" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.length === 0 ? (
          <Card className="col-span-full">
            <CardContent>
              <EmptyState
                icon={Download}
                title="No notes available"
                description="Notes will appear here once uploaded by your teachers."
              />
            </CardContent>
          </Card>
        ) : (
          enrollments.map((enrollment) => (
            <Card key={enrollment.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-slate-900">
                  {enrollment.course?.title || "Course"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { title: "Chapter 1: Introduction", type: "PDF", size: "2.4 MB" },
                    { title: "Chapter 2: Fundamentals", type: "PDF", size: "3.1 MB" },
                    { title: "Practice Problems", type: "DOC", size: "1.8 MB" },
                  ].map((note, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-amber-500" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{note.title}</p>
                          <p className="text-xs text-slate-400">
                            {note.type} · {note.size}
                          </p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <Download className="h-4 w-4 text-slate-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
