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
import { isValidSelection } from "@/lib/curriculum";
import { CurriculumSelect, type CurriculumValue } from "@/components/forms/curriculum-select";
import { CheckList } from "@/components/forms/check-list";

const studentSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().optional(),
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
  stage: z.string().optional(),
  board: z.string().optional(),
  group_code: z.string().optional(),
}).superRefine((d, ctx) => {
  if (d.board && !d.stage) ctx.addIssue({ code: "custom", path: ["stage"], message: "Choose a level" });
  if (!isValidSelection({ board: d.board, stage: d.stage, group: d.group_code })) {
    ctx.addIssue({ code: "custom", path: ["group_code"], message: "Choose a valid board, level and group" });
  }
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: StudentFormData & { id: string; course_ids?: string[] } | null;
  branches?: { id: string; name: string }[];
  batches?: { id: string; name: string }[];
  courses?: { id: string; title: string }[];
}

export function StudentForm({ open, onClose, onSuccess, initialData, branches = [], batches = [], courses = [] }: StudentFormProps) {
  const isEditing = !!initialData;
  const [isLoading, setIsLoading] = useState(false);
  const [courseIds, setCourseIds] = useState<string[]>(initialData?.course_ids ?? []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
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
      stage: "",
      board: "",
      group_code: "",
    },
  });

  const curriculum: CurriculumValue = {
    stage: watch("stage") ?? "",
    board: watch("board") ?? "",
    group: watch("group_code") ?? "",
    subject: "",
  };
  function setCurriculum(v: CurriculumValue) {
    setValue("stage", v.stage, { shouldDirty: true });
    setValue("board", v.board, { shouldDirty: true });
    setValue("group_code", v.group, { shouldDirty: true });
  }

  const onSubmit = async (data: StudentFormData) => {
    if (!isEditing && (data.password?.length ?? 0) < 8) {
      setError("password", { message: "Password must be at least 8 characters" });
      return;
    }
    setIsLoading(true);
    try {
      const url = isEditing ? `/api/admin/students/${initialData?.id}` : "/api/admin/students";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, course_ids: courseIds }),
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
            <Input label="Email" type="email" placeholder="john@example.com" readOnly={isEditing} error={errors.email?.message} {...register("email")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {!isEditing && <Input label="Password" type="password" placeholder="Min 8 characters" error={errors.password?.message} {...register("password")} />}
            <Input label="Phone" placeholder="+92 3XX XXXXXXX" error={errors.phone?.message} {...register("phone")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Roll Number" placeholder="STU-001" error={errors.roll_number?.message} {...register("roll_number")} />
            <Select label="Branch" placeholder="Select branch" error={errors.branch_id?.message} options={branches.map(b => ({ value: b.id, label: b.name }))} {...register("branch_id")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Batch" placeholder="Select batch" error={errors.batch_id?.message} options={batches.map(b => ({ value: b.id, label: b.name }))} {...register("batch_id")} />
            <Input label="Date of Birth" type="date" error={errors.date_of_birth?.message} {...register("date_of_birth")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Gender" placeholder="Select gender" error={errors.gender?.message} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }, { value: "other", label: "Other" }]} {...register("gender")} />
            <Input label="Grade / Class" placeholder="e.g. Class 10, O Level 2, A1" error={errors.grade?.message} {...register("grade")} />
          </div>
          <CurriculumSelect
            value={curriculum}
            onChange={setCurriculum}
            idPrefix="student"
            errors={{ stage: errors.stage?.message, board: errors.board?.message, group: errors.group_code?.message }}
          />
          <CheckList
            label="Courses"
            options={courses.map((c) => ({ id: c.id, label: c.title }))}
            value={courseIds}
            onChange={setCourseIds}
            empty="No courses yet. Create one on the Courses page first."
          />
          <div className="grid sm:grid-cols-2 gap-4">
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