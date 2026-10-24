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

const examSchema = z.object({
  course_id: z.string().uuid("Select a course"),
  teacher_id: z.string().uuid("Select a teacher"),
  title: z.string().min(2, "Exam title required"),
  description: z.string().optional(),
  exam_type: z.enum(["quiz", "midterm", "final", "practice", "entry_test"]),
  total_marks: z.number().min(1).default(100),
  passing_marks: z.number().min(0).default(40),
  duration_minutes: z.number().min(1).default(60),
  scheduled_at: z.string().min(1, "Schedule date required"),
  is_published: z.boolean().default(false),
});

type ExamFormData = z.infer<typeof examSchema>;

interface ExamFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: ExamFormData & { id: string } | null;
  courses?: { id: string; title: string }[];
  teachers?: { id: string; full_name: string }[];
}

export function ExamForm({ open, onClose, onSuccess, initialData, courses = [], teachers = [] }: ExamFormProps) {
  const isEditing = !!initialData;
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    defaultValues: initialData || {
      course_id: "",
      teacher_id: "",
      title: "",
      description: "",
      exam_type: "quiz",
      total_marks: 100,
      passing_marks: 40,
      duration_minutes: 60,
      scheduled_at: "",
      is_published: false,
    },
  });

  const onSubmit = async (data: ExamFormData) => {
    setIsLoading(true);
    try {
      const url = isEditing ? `/api/admin/exams/${initialData?.id}` : "/api/admin/exams";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save exam");
      }

      toast.success(isEditing ? "Exam updated successfully" : "Exam created successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose} title={isEditing ? "Edit Exam" : "Create Exam"} description={isEditing ? "Update exam information" : "Create a new exam"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader />
        <DialogContent className="space-y-4">
          <Select label="Course" placeholder="Select course" error={errors.course_id?.message} options={courses.map(c => ({ value: c.id, label: c.title }))} {...register("course_id")} />
          <Select label="Teacher" placeholder="Select teacher" error={errors.teacher_id?.message} options={teachers.map(t => ({ value: t.id, label: t.user?.full_name || t.id }))} {...register("teacher_id")} />
          <Input label="Title" placeholder="Midterm Exam" error={errors.title?.message} {...register("title")} />
          <Input label="Description" placeholder="Exam description" error={errors.description?.message} {...register("description")} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Exam Type" error={errors.exam_type?.message} options={[
              { value: "quiz", label: "Quiz" },
              { value: "midterm", label: "Midterm" },
              { value: "final", label: "Final" },
              { value: "practice", label: "Practice" },
              { value: "entry_test", label: "Entry Test" },
            ]} {...register("exam_type")} />
            <Input label="Total Marks" type="number" min={1} error={errors.total_marks?.message} {...register("total_marks")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Passing Marks" type="number" min={0} error={errors.passing_marks?.message} {...register("passing_marks")} />
            <Input label="Duration (minutes)" type="number" min={1} error={errors.duration_minutes?.message} {...register("duration_minutes")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Scheduled At" type="datetime-local" error={errors.scheduled_at?.message} {...register("scheduled_at")} />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_published" {...register("is_published")} className="h-4 w-4 rounded border-slate-300 text-indigo-600" />
              <label htmlFor="is_published" className="text-sm text-slate-700">Published</label>
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? "Update Exam" : "Create Exam"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}