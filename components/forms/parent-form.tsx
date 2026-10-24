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

const parentSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  occupation: z.string().optional(),
  relationship: z.string().optional(),
});

type ParentFormData = z.infer<typeof parentSchema>;

interface ParentFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: ParentFormData & { id: string } | null;
}

export function ParentForm({ open, onClose, onSuccess, initialData }: ParentFormProps) {
  const isEditing = !!initialData;
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParentFormData>({
    resolver: zodResolver(parentSchema),
    defaultValues: initialData || {
      email: "",
      password: "",
      full_name: "",
      phone: "",
      occupation: "",
      relationship: "parent",
    },
  });

  const onSubmit = async (data: ParentFormData) => {
    setIsLoading(true);
    try {
      const url = isEditing ? `/api/admin/parents/${initialData?.id}` : "/api/admin/parents";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save parent");
      }

      toast.success(isEditing ? "Parent updated successfully" : "Parent created successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose} title={isEditing ? "Edit Parent" : "Add Parent"} description={isEditing ? "Update parent information" : "Add a new parent to the system"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader />
        <DialogContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="Ahmed Ali" error={errors.full_name?.message} {...register("full_name")} />
            <Input label="Email" type="email" placeholder="parent@example.com" error={errors.email?.message} {...register("email")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Password" type={isEditing ? "text" : "password"} placeholder={isEditing ? "Leave blank to keep current" : "Min 8 characters"} error={errors.password?.message} {...register("password")} />
            <Input label="Phone" placeholder="+92 3XX XXXXXXX" error={errors.phone?.message} {...register("phone")} />
          </div>
          <Input label="Occupation" placeholder="Doctor, Engineer, etc." error={errors.occupation?.message} {...register("occupation")} />
          <Select label="Relationship" placeholder="Select relationship" error={errors.relationship?.message} options={[
            { value: "parent", label: "Parent" },
            { value: "guardian", label: "Guardian" },
            { value: "other", label: "Other" },
          ]} {...register("relationship")} />
        </DialogContent>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? "Update Parent" : "Create Parent"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
