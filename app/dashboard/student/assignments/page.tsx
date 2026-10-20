import { requireAuth } from "@/lib/auth";
import { StudentService } from "@/services";
import { PageHeader, StatCard, Badge, EmptyState } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PenTool, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function StudentAssignmentsPage() {
  const user = await requireAuth("student");

  let assignments: Awaited<ReturnType<typeof StudentService.getAssignments>> = [];
  let profile: Awaited<ReturnType<typeof StudentService.getProfile>>;

  try {
    profile = await StudentService.getProfile(user.id);
    assignments = await StudentService.getAssignments(profile?.id || user.id);
  } catch {
    // Database not available
  }

  const pendingCount = assignments.filter((a) => a.status === "published").length;
  const submittedCount = assignments.filter((a) =>
    a.submissions?.some((s: any) => s.status === "submitted" || s.status === "graded")
  ).length;
  const overdueCount = assignments.filter((a) => {
    if (a.status !== "published") return false;
    const submission = a.submissions?.[0];
    return submission?.status !== "submitted" && new Date(a.due_date) < new Date();
  }).length;

  return (
    <div>
      <PageHeader title="Assignments" description="View and submit your homework" />

      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <StatCard title="Pending" value={pendingCount} icon={Clock} changeType="negative" />
        <StatCard title="Submitted" value={submittedCount} icon={CheckCircle2} changeType="positive" />
        <StatCard title="Overdue" value={overdueCount} icon={AlertCircle} changeType="negative" />
      </div>

      <div className="space-y-4">
        {assignments.length === 0 ? (
          <Card>
            <CardContent>
              <EmptyState
                icon={PenTool}
                title="No assignments"
                description="Assignments from your teachers will appear here."
              />
            </CardContent>
          </Card>
        ) : (
          assignments.map((assignment) => {
            const submission = assignment.submissions?.[0];
            const isOverdue =
              assignment.status === "published" &&
              new Date(assignment.due_date) < new Date() &&
              !submission;

            return (
              <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900">
                          {assignment.title}
                        </h3>
                        <Badge
                          variant={
                            assignment.status === "published"
                              ? "default"
                              : assignment.status === "closed"
                              ? "danger"
                              : "warning"
                          }
                        >
                          {assignment.status}
                        </Badge>
                        {isOverdue && (
                          <Badge variant="danger">Overdue</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mb-3">
                        {assignment.description || "No description provided."}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Due: {new Date(assignment.due_date).toLocaleDateString()}
                        </span>
                        <span>Max Marks: {assignment.max_marks}</span>
                        <span>
                          {assignment.course?.title || "Course"}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      {submission ? (
                        <div>
                          <div className="text-2xl font-bold text-slate-900">
                            {submission.marks_obtained !== null
                              ? `${submission.marks_obtained}/${assignment.max_marks}`
                              : "—"}
                          </div>
                          <p className="text-xs text-slate-500">
                            {submission.status === "graded"
                              ? "Graded"
                              : submission.status === "submitted"
                              ? "Submitted"
                              : "Pending"}
                          </p>
                          {submission.feedback && (
                            <p className="text-xs text-slate-400 mt-1 max-w-[150px] truncate">
                              &quot;{submission.feedback}&quot;
                            </p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-slate-400 mb-2">Not submitted</p>
                          <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                            Submit Now
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
