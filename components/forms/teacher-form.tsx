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

const teacherSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  employee_id: z.string().optional(),
  branch_id: z.string().uuid().optional().or(z.literal("")),
  specialization: z.array(z.enum(["mathematics", "physics", "chemistry", "biology", "computer_science", "english"])).optional(),
  qualification: z.string().optional(),
  experience_years: z.number().min(0).optional(),
  bio: z.string().optional(),
  hire_date: z.string().optional(),
  salary: z.number().min(0).optional(),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

interface TeacherFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: TeacherFormData & { id: string } | null;
  branches?: { id: string; name: string }[];
}

export function TeacherForm({ open, onClose, onSuccess, initialData, branches = [] }: TeacherFormProps) {
  const isEditing = !!initialData;
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: initialData || {
      email: "",
      password: "",
      full_name: "",
      phone: "",
      employee_id: "",
      branch_id: "",
      specialization: [],
      qualification: "",
      experience_years: 0,
      bio: "",
      hire_date: "",
      salary: 0,
    },
  });

  const onSubmit = async (data: TeacherFormData) => {
    setIsLoading(true);
    try {
      const url = isEditing ? `/api/admin/teachers/${initialData?.id}` : "/api/admin/teachers";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save teacher");
      }

      toast.success(isEditing ? "Teacher updated successfully" : "Teacher created successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose} title={isEditing ? "Edit Teacher" : "Add Teacher"} description={isEditing ? "Update teacher information" : "Add a new teacher to the system"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader title={isEditing ? "Edit Teacher" : "Add Teacher"} description={isEditing ? "Update teacher information" : "Add a new teacher to the system"} />
        <DialogContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="John Smith" error={errors.full_name?.message} {...register("full_name")} />
            <Input label="Email" type="email" placeholder="john@example.com" error={errors.email?.message} {...register("email")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Password" type={isEditing ? "text" : "password"} placeholder={isEditing ? "Leave blank to keep current" : "Min 8 characters"} error={errors.password?.message} {...register("password")} />
            <Input label="Phone" placeholder="+92 3XX XXXXXXX" error={errors.phone?.message} {...register("phone")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Employee ID" placeholder="EMP-001" error={errors.employee_id?.message} {...register("employee_id")} />
            <Select label="Branch" placeholder="Select branch" error={errors.branch_id?.message} options={branches.map(b => ({ value: b.id, label: b.name }))} {...register("branch_id")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Specialization" placeholder="Select specializations" error={errors.specialization?.message} options={[
              { value: "mathematics", label: "Mathematics" },
              { value: "physics", label: "Physics" },
              { value: "chemistry", label: "Chemistry" },
              { value: "biology", label: "Biology" },
              { value: "computer_science", label: "Computer Science" },
              { value: "english", label: "English" },
            ]} {...register("specialization")} multiple />
            <Input label="Qualification" placeholder="M.Sc, PhD, etc." error={errors.qualification?.message} {...register("qualification")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Experience (Years)" type="number" min={0} error={errors.experience_years?.message} {...register("experience_years", { valueAsNumber: true })} />
            <Input label="Salary" type="number" min={0} step="0.01" error={errors.salary?.message} {...register("salary", { valueAsNumber: true })} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Hire Date" type="date" error={errors.hire_date?.message} {...register("hire_date")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Bio" placeholder="Short bio" error={errors.bio?.message} {...register("bio")} className="sm:col-span-2" />
          </div>
        </DialogContent>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? "Update Teacher" : "Create Teacher"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}