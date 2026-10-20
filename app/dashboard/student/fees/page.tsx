import { requireAuth } from "@/lib/auth";
import { StudentService } from "@/services";
import { PageHeader, StatCard, Badge, EmptyState } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, DollarSign, AlertCircle, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/utils/format";

export default async function StudentFeesPage() {
  const user = await requireAuth("student");

  let payments: Awaited<ReturnType<typeof StudentService.getPayments>> = [];
  let profile: Awaited<ReturnType<typeof StudentService.getProfile>>;

  try {
    profile = await StudentService.getProfile(user.id);
    payments = await StudentService.getPayments(profile?.id || user.id);
  } catch {
    // Database not available
  }

  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalPaid = payments.reduce((sum, p) => sum + (p.paid_amount || 0), 0);
  const totalDue = totalAmount - totalPaid;
  const pendingCount = payments.filter((p) => p.status === "pending" || p.status === "overdue").length;
  const paidCount = payments.filter((p) => p.status === "paid").length;

  return (
    <div>
      <PageHeader title="Fee Status" description="View your fee payments and dues" />

      <div className="grid sm:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Fees" value={formatCurrency(totalAmount)} icon={DollarSign} />
        <StatCard title="Paid" value={formatCurrency(totalPaid)} icon={CheckCircle2} changeType="positive" />
        <StatCard title="Due" value={formatCurrency(totalDue)} icon={AlertCircle} changeType={totalDue > 0 ? "negative" : "positive"} />
        <StatCard title="Pending" value={pendingCount} icon={CreditCard} changeType={pendingCount > 0 ? "negative" : "positive"} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <EmptyState
              icon={CreditCard}
              title="No fee records"
              description="Your fee payment history will appear here."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">Course</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">Amount</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">Paid</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">Due</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">Due Date</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-900">
                        {payment.course?.title || "Course Fee"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-emerald-600">
                        {formatCurrency(payment.paid_amount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-900 font-medium">
                        {formatCurrency(payment.amount - payment.paid_amount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {new Date(payment.due_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            payment.status === "paid"
                              ? "success"
                              : payment.status === "overdue"
                              ? "danger"
                              : payment.status === "partial"
                              ? "warning"
                              : "default"
                          }
                        >
                          {payment.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
