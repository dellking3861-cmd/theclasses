import { AdminService } from "@/services";
import { PageHeader, Badge, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/utils/format";
import { CreditCard, Plus } from "lucide-react";

const statusVariant = { paid: "success", pending: "warning", overdue: "danger", partial: "info", refunded: "default" } as const;

export default async function AdminPaymentsPage() {
  let payments: Awaited<ReturnType<typeof AdminService.getPayments>> = { data: [], total: 0, page: 1, pageSize: 20 };
  try { payments = await AdminService.getPayments(); } catch {}

  return (
    <div>
      <PageHeader title="Payment Monitoring" description="Track all fee payments" action={<Button><Plus className="h-4 w-4" /> Record Payment</Button>} />
      {payments.data.length === 0 ? (
        <Card><CardContent><EmptyState icon={CreditCard} title="No payments recorded" description="Start recording student fee payments." action={<Button><Plus className="h-4 w-4" /> Record Payment</Button>} /></CardContent></Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left text-xs font-medium text-slate-500 uppercase px-6 py-3">Student</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase px-6 py-3">Amount</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase px-6 py-3">Paid</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase px-6 py-3">Due Date</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase px-6 py-3">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {payments.data.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{p.student?.user?.full_name || "—"}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatCurrency(p.amount)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatCurrency(p.paid_amount)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatDate(p.due_date)}</td>
                    <td className="px-6 py-4"><Badge variant={statusVariant[p.status] || "default"}>{p.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
