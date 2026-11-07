import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { loadChildren } from "@/lib/parent-data";
import { ReviewPrompt } from "@/components/review-prompt";
import { PageHeader, StatCard } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NoChildren } from "@/components/parent/no-children";
import { formatCurrency } from "@/utils/format";
import { Users, ClipboardCheck, CreditCard, FileText } from "lucide-react";

export default async function ParentDashboardPage() {
  const user = await requireAuth("parent");
  const { supabase, children } = await loadChildren();
  const ids = children.map((c) => c.student_id);

  const [att, pay, res] = ids.length
    ? await Promise.all([
        supabase.from("attendance").select("status").in("student_id", ids),
        supabase.from("payments").select("amount, paid_amount, status").in("student_id", ids),
        supabase.from("exam_results").select("id", { count: "exact", head: true }).in("student_id", ids),
      ])
    : [null, null, null];

  const marked = att?.data?.length ?? 0;
  const attended = att?.data?.filter((a) => a.status === "present" || a.status === "late").length ?? 0;
  const due = (pay?.data ?? [])
    .filter((p) => p.status !== "paid" && p.status !== "refunded")
    .reduce((sum, p) => sum + Number(p.amount) - Number(p.paid_amount ?? 0), 0);

  return (
    <div>
      <PageHeader title={`Welcome, ${user.full_name?.split(" ")[0] || "there"}`} description="Your child's attendance, fees and results in one place" />

      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
        <StatCard title="Children" value={children.length} icon={Users} />
        <StatCard title="Attendance" value={marked ? `${Math.round((attended / marked) * 100)}%` : "—"} icon={ClipboardCheck} />
        <StatCard title="Fees due" value={due > 0 ? formatCurrency(due) : "All paid"} icon={CreditCard} />
        <StatCard title="Exam results" value={res?.count ?? 0} icon={FileText} />
      </div>

      {children.length === 0 ? (
        <NoChildren />
      ) : (
        <Card>
          <CardHeader><CardTitle>Your children</CardTitle></CardHeader>
          <CardContent>
            <ul className="grid gap-4 sm:grid-cols-2">
              {children.map((c) => (
                <li key={c.student_id} className="rounded-xl border border-slate-200 p-4">
                  <p className="font-semibold text-slate-900">{c.full_name}</p>
                  <p className="text-sm text-slate-500">Roll: {c.roll_number || "—"}</p>
                  <p className="mt-3 flex flex-wrap gap-3 text-sm font-medium">
                    <Link href="/dashboard/parent/attendance" className="text-brand-800 hover:underline">Attendance</Link>
                    <Link href="/dashboard/parent/fees" className="text-brand-800 hover:underline">Fees</Link>
                    <Link href="/dashboard/parent/exams" className="text-brand-800 hover:underline">Results</Link>
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      <ReviewPrompt audience="parent" />
    </div>
  );
}
