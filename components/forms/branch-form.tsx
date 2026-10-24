"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogHeader, DialogContent, DialogFooter } from "@/components/ui/dialog";

const branchSchema = z.object({
  name: z.string().min(2, "Branch name required"),
  address: z.string().min(5, "Address required"),
  city: z.string().min(2, "City required"),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  is_active: z.boolean(),
});

type BranchFormData = z.infer<typeof branchSchema>;

interface BranchFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: BranchFormData & { id: string } | null;
}

export function BranchForm({ open, onClose, onSuccess, initialData }: BranchFormProps) {
  const isEditing = !!initialData;
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: initialData || {
      name: "",
      address: "",
      city: "",
      phone: "",
      email: "",
      is_active: true,
    },
  });

  const onSubmit = async (data: BranchFormData) => {
    setIsLoading(true);
    try {
      const url = isEditing ? `/api/admin/branches/${initialData?.id}` : "/api/admin/branches";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save branch");
      }

      toast.success(isEditing ? "Branch updated successfully" : "Branch created successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose} title={isEditing ? "Edit Branch" : "Add Branch"} description={isEditing ? "Update branch information" : "Add a new branch to the system"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="space-y-4">
          <Input label="Branch Name" placeholder="The Classes - Gulshan Campus" error={errors.name?.message} {...register("name")} />
          <Input label="Address" placeholder="Plot 45, Block 7, Gulshan-e-Iqbal" error={errors.address?.message} {...register("address")} />
          <Input label="City" placeholder="Karachi" error={errors.city?.message} {...register("city")} />
          <Input label="Phone" placeholder="+92-21-34876543" error={errors.phone?.message} {...register("phone")} />
          <Input label="Email" type="email" placeholder="gulshan@theclasses.pk" error={errors.email?.message} {...register("email")} />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_active" {...register("is_active")} className="h-4 w-4 rounded border-slate-300 text-indigo-600" />
            <label htmlFor="is_active" className="text-sm text-slate-700">Active</label>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? "Update Branch" : "Create Branch"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
