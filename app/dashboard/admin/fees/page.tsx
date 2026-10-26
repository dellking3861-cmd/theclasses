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

export default function AdminFeesPage() {
  const [fees, setFees] = useState<{ data: { id: string; student_id: string; course_id: string | null; amount: number; paid_amount: number; status: string; method: string | null; due_date: string; paid_at: string | null; receipt_number: string | null; notes: string | null; created_by: string | null; student?: { user?: { full_name: string } }; course?: { title: string } }[]; total: number; page: number; pageSize: number }>({ data: [], total: 0, page: 1, pageSize: 20 });
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<{ id: string; full_name: string }[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [feesData, studentsData] = await Promise.all([
          adminApi.getFees(),
          adminApi.getStudents(),
        ]);
        setFees(feesData);
        setStudents(studentsData.data?.map(s => ({ id: s.id, full_name: s.user?.full_name || s.user?.email || s.id })) || []);
      } catch {}
      finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<typeof fees.data[0] | null>(null);

  const handleOpenAdd = () => {
    setEditingFee(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (fee: typeof fees.data[0]) => {
    setEditingFee(fee);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingFee(null);
  };

  const handleSuccess = () => {
    window.location.reload();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div>
      <PageHeader title="Fee Management" description="Manage student fee records and payments" action={<Button onClick={handleOpenAdd}><Plus className="h-4 w-4" /> Add Fee Record</Button>} />
      {fees.data.length === 0 ? (
        <Card><CardContent><EmptyState icon={CreditCard} title="No fee records" description="Add fee records to track student payments." action={<Button onClick={() => setIsDialogOpen(true)}><Plus className="h-4 w-4" /> Add Fee Record</Button>} /></CardContent></Card>
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
                {fees.data.map((f: { id: string; student_id: string; course_id: string | null; amount: number; paid_amount: number; status: string; method: string | null; due_date: string; paid_at: string | null; receipt_number: string | null; notes: string | null; created_by: string | null; student?: { user?: { full_name: string } }; course?: { title: string } }) => (
                  <tr key={f.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{f.student?.user?.full_name || "—"}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatCurrency(f.amount)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatCurrency(f.paid_amount)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatDate(f.due_date)}</td>
                    <td className="px-6 py-4"><Badge variant={statusVariant[f.status] || "default"}>{f.status}</Badge></td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEdit(f)}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} title="Add Fee Record" description="Add a new fee record">
        <PaymentForm
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={() => window.location.reload()}
        />
      </Dialog>
    </div>
  );
}
