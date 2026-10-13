import { AdminService } from "@/services";
import { PageHeader, Badge, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, formatDateTime } from "@/utils/format";
import { FileText, Plus, Megaphone, Layers, Building2, UserCheck } from "lucide-react";

export default async function AdminExamsPage() {
  let exams: Awaited<ReturnType<typeof AdminService.getExams>> = [];
  try { exams = await AdminService.getExams(); } catch {}

  return (
    <div>
      <PageHeader title="Exam Management" description="Manage exams and results" action={<Button><Plus className="h-4 w-4" /> Create Exam</Button>} />
      {exams.length === 0 ? (
        <Card><CardContent><EmptyState icon={FileText} title="No exams scheduled" description="Create exams for your courses." action={<Button><Plus className="h-4 w-4" /> Create Exam</Button>} /></CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {exams.map((exam) => (
            <Card key={exam.id} hover>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="info">{exam.exam_type}</Badge>
                  <Badge variant={exam.is_published ? "success" : "warning"}>{exam.is_published ? "Published" : "Draft"}</Badge>
                </div>
                <h3 className="font-semibold text-slate-900">{exam.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{exam.course?.title}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                  <span>{formatDateTime(exam.scheduled_at)}</span>
                  <span>{exam.total_marks} marks</span>
                  <span>{exam.duration_minutes} min</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
