import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, StatCard } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SimpleBarChart from "@/components/charts/SimpleBarChart";
import { TrendingUp, ClipboardCheck, FileText, Award } from "lucide-react";

export const metadata = { title: "Progress" };

export default async function StudentProgressPage() {
  const user = await requireAuth("student");
  const supabase = await createClient();
  const { data: student } = await supabase.from("students").select("id").eq("user_id", user.id).maybeSingle();
  const sid = student?.id ?? "";

  const [{ data: results }, { data: attendance }, { data: submissions }] = await Promise.all([
    supabase.from("exam_results").select("percentage, exam:exams(title)").eq("student_id", sid).not("percentage", "is", null).order("created_at"),
    supabase.from("attendance").select("status").eq("student_id", sid),
    supabase.from("submissions").select("status").eq("student_id", sid),
  ]);

  const scores = (results ?? []).map((r) => Number(r.percentage));
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
  const marked = attendance?.length ?? 0;
  const present = attendance?.filter((a) => a.status === "present" || a.status === "late").length ?? 0;
  const done = submissions?.filter((s) => s.status !== "pending").length ?? 0;

  return (
    <div>
      <PageHeader title="Progress Analytics" description="Your real results, attendance and assignments" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Exams Taken" value={scores.length} icon={Award} />
        <StatCard title="Attendance" value={marked ? `${Math.round((present / marked) * 100)}%` : "—"} icon={ClipboardCheck} />
        <StatCard title="Assignments Done" value={`${done}/${submissions?.length ?? 0}`} icon={FileText} />
        <StatCard title="Avg. Exam Score" value={avg === null ? "—" : `${avg}%`} icon={TrendingUp} />
      </div>

      <Card>
        <CardHeader><CardTitle>Exam Results</CardTitle></CardHeader>
        <CardContent>
          <SimpleBarChart
            suffix="%"
            data={(results ?? []).slice(-10).map((r) => ({
              label: (r.exam as { title?: string } | null)?.title ?? "Exam",
              value: Math.round(Number(r.percentage)),
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
