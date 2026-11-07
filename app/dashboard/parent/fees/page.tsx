import { requireAuth } from "@/lib/auth";
import { loadChildren } from "@/lib/parent-data";
import { PageHeader, Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NoChildren } from "@/components/parent/no-children";
import { formatCurrency, formatDate } from "@/utils/format";

export const metadata = { title: "Fees" };

const variant = { paid: "success", partial: "warning", pending: "warning", overdue: "danger", refunded: "info" } as const;

export default async function ParentFeesPage() {
  await requireAuth("parent");
  const { supabase, children } = await loadChildren();
  const rows = children.length
    ? (await supabase.from("payments").select("id, student_id, amount, paid_amount, status, due_date, receipt_number, course:courses(title)").in("student_id", children.map((c) => c.student_id)).order("due_date", { ascending: false })).data ?? []
    : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Fees" description="Fee records entered by the office" />
      {children.length === 0 && <NoChildren />}
      {children.map((c) => {
        const mine = rows.filter((r) => r.student_id === c.student_id);
        const due = mine
          .filter((r) => r.status !== "paid" && r.status !== "refunded")
          .reduce((sum, r) => sum + Number(r.amount) - Number(r.paid_amount ?? 0), 0);
        return (
          <Card key={c.student_id}>
            <CardHeader>
              <CardTitle>{c.full_name}</CardTitle>
              <p className="text-sm text-slate-500">{mine.length ? (due > 0 ? `Outstanding: ${formatCurrency(due)}` : "All paid") : "No fee records yet"}</p>
            </CardHeader>
            {mine.length > 0 && (
              <CardContent>
                <ul className="divide-y divide-slate-100">
                  {mine.map((r) => (
                    <li key={r.id} className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-slate-700">
                        {(r.course as { title?: string } | null)?.title ?? "Fee"} · due {formatDate(r.due_date)}
                        {r.receipt_number && <span className="text-slate-500"> · receipt {r.receipt_number}</span>}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">
                          {formatCurrency(Number(r.paid_amount ?? 0))} of {formatCurrency(Number(r.amount))}
                        </span>
                        <Badge variant={variant[r.status as keyof typeof variant]}>{r.status}</Badge>
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            )}
          </Card>
        );
      })}
      <p className="text-sm text-slate-500">To pay, visit the office or ask about bank transfer, JazzCash or EasyPaisa.</p>
    </div>
  );
}
