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
import { Textarea } from "@/components/ui/textarea";

const assignmentSchema = z.object({
  course_id: z.string().uuid("Select a course"),
  teacher_id: z.string().uuid("Select a teacher"),
  title: z.string().min(2, "Assignment title required"),
  description: z.string().optional(),
  instructions: z.string().optional(),
  max_marks: z.number().min(1),
  due_date: z.string().min(1, "Due date required"),
  status: z.enum(["draft", "published", "closed"]),
  attachment_url: z.string().optional()
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface AssignmentFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: AssignmentFormData & { id: string } | null;
  courses?: { id: string; title: string }[];
  teachers?: { id: string; user?: { full_name: string }; full_name: string }[];
}

export function AssignmentForm({ open, onClose, onSuccess, initialData, courses = [], teachers = [] }: AssignmentFormProps) {
  const isEditing = !!initialData;
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: initialData || {
      course_id: "",
      teacher_id: "",
      title: "",
      description: "",
      instructions: "",
      max_marks: 100,
      due_date: "",
      status: "draft",
      attachment_url: "",
    },
  });

  const onSubmit = async (data: AssignmentFormData) => {
    setIsLoading(true);
    try {
      const url = isEditing ? `/api/admin/assignments/${initialData?.id}` : "/api/admin/assignments";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save assignment");
      }

      toast.success(isEditing ? "Assignment updated successfully" : "Assignment created successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose} title={isEditing ? "Edit Assignment" : "Create Assignment"} description={isEditing ? "Update assignment information" : "Create a new assignment"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="space-y-4">
          <Select label="Course" placeholder="Select course" error={errors.course_id?.message} options={courses.map(c => ({ value: c.id, label: c.title }))} {...register("course_id")} />
          <Select label="Teacher" placeholder="Select teacher" error={errors.teacher_id?.message} options={teachers.map(t => ({ value: t.id, label: t.user?.full_name || t.id }))} {...register("teacher_id")} />
          <Input label="Title" placeholder="Assignment 1" error={errors.title?.message} {...register("title")} />
          <Textarea label="Description" placeholder="Assignment description" error={errors.description?.message} {...register("description")} />
          <Textarea label="Instructions" placeholder="Submission instructions" error={errors.instructions?.message} {...register("instructions")} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Max Marks" type="number" min={1} error={errors.max_marks?.message} {...register("max_marks")} />
            <Select label="Status" error={errors.status?.message} options={[
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "closed", label: "Closed" },
            ]} {...register("status")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Due Date" type="datetime-local" error={errors.due_date?.message} {...register("due_date")} />
            <Input label="Attachment URL" placeholder="https://example.com/assignment.pdf" error={errors.attachment_url?.message} {...register("attachment_url")} />
          </div>
        </DialogContent>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? "Update Assignment" : "Create Assignment"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
