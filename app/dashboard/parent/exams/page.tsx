import { requireAuth } from "@/lib/auth";
import { loadChildren } from "@/lib/parent-data";
import { PageHeader, Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NoChildren } from "@/components/parent/no-children";

export const metadata = { title: "Exam Results" };

export default async function ParentExamsPage() {
  await requireAuth("parent");
  const { supabase, children } = await loadChildren();
  const rows = children.length
    ? (await supabase.from("exam_results").select("id, student_id, marks_obtained, percentage, grade, is_passed, exam:exams(title, total_marks)").in("student_id", children.map((c) => c.student_id)).order("created_at", { ascending: false })).data ?? []
    : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Exam Results" description="Results published by teachers" />
      {children.length === 0 && <NoChildren />}
      {children.map((c) => {
        const mine = rows.filter((r) => r.student_id === c.student_id);
        return (
          <Card key={c.student_id}>
            <CardHeader>
              <CardTitle>{c.full_name}</CardTitle>
              {mine.length === 0 && <p className="text-sm text-slate-500">No results yet</p>}
            </CardHeader>
            {mine.length > 0 && (
              <CardContent>
                <ul className="divide-y divide-slate-100">
                  {mine.map((r) => {
                    const exam = r.exam as { title?: string; total_marks?: number } | null;
                    return (
                      <li key={r.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                        <span className="text-slate-700">{exam?.title ?? "Exam"}</span>
                        <span className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">
                            {r.marks_obtained ?? "—"}{exam?.total_marks ? ` / ${exam.total_marks}` : ""}
                            {r.percentage !== null && ` (${Math.round(Number(r.percentage))}%)`}
                          </span>
                          {r.grade && <Badge variant="info">{r.grade}</Badge>}
                          {r.is_passed !== null && <Badge variant={r.is_passed ? "success" : "danger"}>{r.is_passed ? "Passed" : "Not passed"}</Badge>}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
