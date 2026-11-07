import { requireAuth } from "@/lib/auth";
import { loadChildren } from "@/lib/parent-data";
import { PageHeader, Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NoChildren } from "@/components/parent/no-children";
import { formatDate } from "@/utils/format";

export const metadata = { title: "Attendance" };

const variant = { present: "success", late: "warning", absent: "danger", excused: "info" } as const;

export default async function ParentAttendancePage() {
  await requireAuth("parent");
  const { supabase, children } = await loadChildren();
  const rows = children.length
    ? (await supabase.from("attendance").select("id, student_id, date, status, course:courses(title)").in("student_id", children.map((c) => c.student_id)).order("date", { ascending: false }).limit(500)).data ?? []
    : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" description="Your child's attendance, newest first" />
      {children.length === 0 && <NoChildren />}
      {children.map((c) => {
        const mine = rows.filter((r) => r.student_id === c.student_id);
        const attended = mine.filter((r) => r.status === "present" || r.status === "late").length;
        return (
          <Card key={c.student_id}>
            <CardHeader>
              <CardTitle>{c.full_name}</CardTitle>
              <p className="text-sm text-slate-500">
                {mine.length ? `Attended ${attended} of ${mine.length} classes (${Math.round((attended / mine.length) * 100)}%)` : "No attendance recorded yet"}
              </p>
            </CardHeader>
            {mine.length > 0 && (
              <CardContent>
                <ul className="divide-y divide-slate-100">
                  {mine.slice(0, 60).map((r) => (
                    <li key={r.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                      <span className="text-slate-700">
                        {formatDate(r.date)} · {(r.course as { title?: string } | null)?.title ?? "Class"}
                      </span>
                      <Badge variant={variant[r.status as keyof typeof variant]}>{r.status}</Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
