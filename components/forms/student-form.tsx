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

const studentSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  roll_number: z.string().optional(),
  branch_id: z.string().uuid().optional().or(z.literal("")),
  batch_id: z.string().uuid().optional().or(z.literal("")),
  date_of_birth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional().or(z.literal("")),
  address: z.string().optional(),
  emergency_contact: z.string().optional(),
  grade: z.string().optional(),
  board: z.enum(["aku_eb", "sindh_board", "cambridge_o", "cambridge_a"]).optional().or(z.literal("")),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: StudentFormData & { id: string } | null;
  branches?: { id: string; name: string }[];
  batches?: { id: string; name: string }[];
}

export function StudentForm({ open, onClose, onSuccess, initialData, branches = [], batches = [] }: StudentFormProps) {
  const isEditing = !!initialData;
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData || {
      email: "",
      password: "",
      full_name: "",
      phone: "",
      roll_number: "",
      branch_id: "",
      batch_id: "",
      date_of_birth: "",
      gender: undefined,
      address: "",
      emergency_contact: "",
      grade: "",
      board: undefined,
    },
  });

  const onSubmit = async (data: StudentFormData) => {
    setIsLoading(true);
    try {
      const url = isEditing ? `/api/admin/students/${initialData?.id}` : "/api/admin/students";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save student");
      }

      toast.success(isEditing ? "Student updated successfully" : "Student created successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose} title={isEditing ? "Edit Student" : "Add Student"} description={isEditing ? "Update student information" : "Add a new student to the system"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader title={isEditing ? "Edit Student" : "Add Student"} description={isEditing ? "Update student information" : "Add a new student to the system"} />
        <DialogContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="John Doe" error={errors.full_name?.message} {...register("full_name")} />
            <Input label="Email" type="email" placeholder="john@example.com" error={errors.email?.message} {...register("email")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Password" type={isEditing ? "text" : "password"} placeholder={isEditing ? "Leave blank to keep current" : "Min 8 characters"} error={errors.password?.message} {...register("password")} />
            <Input label="Phone" placeholder="+92 3XX XXXXXXX" error={errors.phone?.message} {...register("phone")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Roll Number" placeholder="STU-001" error={errors.roll_number?.message} {...register("roll_number")} />
            <Select label="Branch" placeholder="Select branch" error={errors.branch_id?.message} options={branches.map(b => ({ value: b.id, label: b.name }))} {...register("branch_id")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Batch" placeholder="Select batch" error={errors.batch_id?.message} options={branches.map(b => ({ value: b.id, label: b.name }))} {...register("batch_id")} />
            <Input label="Date of Birth" type="date" error={errors.date_of_birth?.message} {...register("date_of_birth")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Gender" placeholder="Select gender" error={errors.gender?.message} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }, { value: "other", label: "Other" }]} {...register("gender")} />
            <Select label="Board" placeholder="Select board" error={errors.board?.message} options={[
              { value: "aku_eb", label: "AKU-EB" },
              { value: "sindh_board", label: "Sindh Board" },
              { value: "cambridge_o", label: "Cambridge O-Level" },
              { value: "cambridge_a", label: "Cambridge A-Level" },
            ]} {...register("board")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Grade" placeholder="Grade 10" error={errors.grade?.message} {...register("grade")} />
            <Input label="Emergency Contact" placeholder="+92 3XX XXXXXXX" error={errors.emergency_contact?.message} {...register("emergency_contact")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Address" placeholder="Full address" error={errors.address?.message} {...register("address")} className="sm:col-span-2" />
          </div>
        </DialogContent>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? "Update Student" : "Create Student"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}