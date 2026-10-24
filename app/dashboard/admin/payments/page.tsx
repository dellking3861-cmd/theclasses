"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import { PageHeader, Badge, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/utils/format";
import { CreditCard, Plus } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { PaymentForm } from "@/components/forms/payments-form";

const statusVariant: Record<string, "success" | "warning" | "danger" | "info" | "default"> = { paid: "success", pending: "warning", overdue: "danger", partial: "info", refunded: "default" };

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<{ data: any[]; total: number; page: number; pageSize: number }>({ data: [], total: 0, page: 1, pageSize: 20 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await adminApi.getPayments();
        setPayments(data);
      } catch {}
      finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<typeof payments.data[0] | null>(null);

  const handleOpenAdd = () => {
    setEditingPayment(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (payment: typeof payments.data[0]) => {
    setEditingPayment(payment);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPayment(null);
  };

  const handleSuccess = () => {
    window.location.reload();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div>
      <PageHeader title="Payment Monitoring" description="Track all fee payments" action={<Button onClick={handleOpenAdd}><Plus className="h-4 w-4" /> Record Payment</Button>} />
      {payments.data.length === 0 ? (
        <Card><CardContent><EmptyState icon={CreditCard} title="No payments recorded" description="Start recording student fee payments." action={<Button onClick={handleOpenAdd}><Plus className="h-4 w-4" /> Record Payment</Button>} /></CardContent></Card>
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
                <th className="text-left text-xs font-medium text-slate-500 uppercase px-6 py-3">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {payments.data.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{p.student?.user?.full_name || "—"}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatCurrency(p.amount)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatCurrency(p.paid_amount)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatDate(p.due_date)}</td>
                    <td className="px-6 py-4"><Badge variant={statusVariant[p.status] || "default"}>{p.status}</Badge></td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEdit(p)}
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} title="Add Payment" description="Record a new payment">
        <PaymentForm
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={() => window.location.reload()}
        />
      </Dialog>
    </div>
  );
}
