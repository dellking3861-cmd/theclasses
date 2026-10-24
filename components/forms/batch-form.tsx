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

const batchSchema = z.object({
  name: z.string().min(2, "Batch name required"),
  branch_id: z.string().uuid("Select a branch"),
  start_date: z.string().min(1, "Start date required"),
  end_date: z.string().optional(),
  max_students: z.number().min(1),
  is_active: z.boolean(),
});

type BatchFormData = z.infer<typeof batchSchema>;

interface BatchFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: BatchFormData & { id: string } | null;
  branches?: { id: string; name: string }[];
}

export function BatchForm({ open, onClose, onSuccess, initialData, branches = [] }: BatchFormProps) {
  const isEditing = !!initialData;
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BatchFormData>({
    resolver: zodResolver(batchSchema),
    defaultValues: initialData || {
      name: "",
      branch_id: "",
      start_date: "",
      end_date: undefined,
      max_students: 30,
      is_active: true,
    },
  });

  const onSubmit = async (data: BatchFormData) => {
    setIsLoading(true);
    try {
      const url = isEditing ? `/api/admin/batches/${initialData?.id}` : "/api/admin/batches";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save batch");
      }

      toast.success(isEditing ? "Batch updated successfully" : "Batch created successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose} title={isEditing ? "Edit Batch" : "Create Batch"} description={isEditing ? "Update batch information" : "Add a new batch to the system"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader title={isEditing ? "Edit Batch" : "Create Batch"} description={isEditing ? "Update batch information" : "Add a new batch to the system"} />
        <DialogContent className="space-y-4">
          <Input label="Batch Name" placeholder="Batch 2024-A" error={errors.name?.message} {...register("name")} />
          <Select label="Branch" placeholder="Select branch" error={errors.branch_id?.message} options={branches.map(b => ({ value: b.id, label: b.name }))} {...register("branch_id")} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Start Date" type="date" error={errors.start_date?.message} {...register("start_date")} />
            <Input label="End Date" type="date" error={errors.end_date?.message} {...register("end_date")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Max Students" type="number" min="1" error={errors.max_students?.message} {...register("max_students")} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_active" {...register("is_active")} className="h-4 w-4 rounded border-slate-300 text-indigo-600" />
            <label htmlFor="is_active" className="text-sm text-slate-700">Active</label>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? "Update Batch" : "Create Batch"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}