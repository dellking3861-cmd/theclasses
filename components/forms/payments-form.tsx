"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog, DialogHeader, DialogContent, DialogFooter } from "@/components/ui/dialog";

const paymentSchema = z.object({
  student_id: z.string().uuid(),
  course_id: z.string().uuid().optional().or(z.literal("")),
  amount: z.number().min(0.01),
  paid_amount: z.number().min(0),
  status: z.enum(["pending", "paid", "overdue", "partial", "refunded"]),
  method: z.enum(["cash", "bank_transfer", "jazzcash", "easypaisa", "card", "online"]).optional().or(z.literal("")),
  due_date: z.string(),
  paid_at: z.string().optional(),
  receipt_number: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: PaymentFormData & { id: string } | null;
  students?: { id: string; full_name: string }[];
}

export function PaymentForm({ open, onClose, onSuccess, initialData, students = [] }: PaymentFormProps) {
  const isEditing = !!initialData;
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: initialData || {
      student_id: "",
      course_id: undefined,
      amount: 0,
      paid_amount: 0,
      status: "pending",
      method: undefined,
      due_date: "",
      paid_at: undefined,
      receipt_number: "",
      notes: "",
    },
  });

  const onSubmit = async (data: PaymentFormData) => {
    setIsLoading(true);
    try {
      const url = isEditing ? `/api/admin/payments/${initialData?.id}` : "/api/admin/payments";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save payment");
      }

      toast.success(isEditing ? "Payment updated successfully" : "Payment created successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose} title={isEditing ? "Edit Payment" : "Add Payment"} description={isEditing ? "Update payment information" : "Add a new payment record"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader title={isEditing ? "Edit Payment" : "Add Payment"} description={isEditing ? "Update payment information" : "Add a new payment record"} />
        <DialogContent className="space-y-4">
          <Select label="Student" placeholder="Select student" error={errors.student_id?.message} options={[]} {...register("student_id")} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Amount" type="number" min="0.01" step="0.01" error={errors.amount?.message} {...register("amount")} />
            <Input label="Paid Amount" type="number" min="0" step="0.01" error={errors.paid_amount?.message} {...register("paid_amount")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Status" error={errors.status?.message} options={[
              { value: "pending", label: "Pending" },
              { value: "paid", label: "Paid" },
              { value: "overdue", label: "Overdue" },
              { value: "partial", label: "Partial" },
              { value: "refunded", label: "Refunded" },
            ]} {...register("status")} />
            <Input label="Due Date" type="date" error={errors.due_date?.message} {...register("due_date")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Method" error={errors.method?.message} options={[
              { value: "cash", label: "Cash" },
              { value: "bank_transfer", label: "Bank Transfer" },
              { value: "jazzcash", label: "JazzCash" },
              { value: "easypaisa", label: "Easypaisa" },
              { value: "card", label: "Card" },
              { value: "online", label: "Online" },
            ]} {...register("method")} />
            <Input label="Paid At" type="date" error={errors.paid_at?.message} {...register("paid_at")} />
          </div>
          <Input label="Receipt Number" placeholder="RCPT-001" error={errors.receipt_number?.message} {...register("receipt_number")} />
          <Input label="Notes" placeholder="Additional notes" error={errors.notes?.message} {...register("notes")} />
        </DialogContent>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? "Update Payment" : "Create Payment"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}