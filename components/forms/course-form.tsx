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

const courseSchema = z.object({
  title: z.string().min(2, "Course title required"),
  slug: z.string().min(2, "Slug required").regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  course_type: z.enum(["board", "special_program"]),
  board: z.enum(["aku_eb", "sindh_board", "cambridge_o", "cambridge_a"]).optional(),
  subject: z.enum(["mathematics", "physics", "chemistry", "biology", "computer_science", "english"]).optional(),
  program: z.enum(["ai_web_development", "spoken_english", "programming_fundamentals", "freelancing", "entry_test_preparation"]).optional(),
  teacher_id: z.string().optional(),
  branch_id: z.string().uuid().optional(),
  batch_id: z.string().uuid().optional(),
  fee_amount: z.number().min(0),
  duration_months: z.number().min(1),
  max_enrollments: z.number().min(1),
  thumbnail_url: z.string().optional(),
  is_published: z.boolean().default(false),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: CourseFormData & { id: string } | null;
  branches?: { id: string; name: string }[];
}

export function CourseForm({ open, onClose, onSuccess, initialData, branches = [] }: CourseFormProps) {
  const isEditing = !!initialData;
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: initialData || {
      title: "",
      slug: "",
      description: "",
      course_type: "board",
      board: null,
      subject: null,
      program: null,
      teacher_id: null,
      branch_id: null,
      batch_id: null,
      fee_amount: 0,
      duration_months: 12,
      max_enrollments: 50,
      thumbnail_url: "",
      is_published: false,
      start_date: "",
      end_date: "",
    },
  });

  const onSubmit = async (data: CourseFormData) => {
    setIsLoading(true);
    try {
      const url = isEditing ? `/api/admin/courses/${initialData?.id}` : "/api/admin/courses";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save course");
      }

      toast.success(isEditing ? "Course updated successfully" : "Course created successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose} title={isEditing ? "Edit Course" : "Create Course"} description={isEditing ? "Update course information" : "Add a new course to the system"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader />
        <DialogContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Title" placeholder="Calculus I" error={errors.title?.message} {...register("title")} />
            <Input label="Slug" placeholder="calculus-i" error={errors.slug?.message} {...register("slug")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Description" placeholder="Course description" error={errors.description?.message} {...register("description")} />
            <Select label="Course Type" error={errors.course_type?.message} options={[
              { value: "board", label: "Board" },
              { value: "special_program", label: "Special Program" },
            ]} {...register("course_type")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Board" error={errors.board?.message} options={[
              { value: "aku_eb", label: "AKU-EB" },
              { value: "sindh_board", label: "Sindh Board" },
              { value: "cambridge_o", label: "Cambridge O-Level" },
              { value: "cambridge_a", label: "Cambridge A-Level" },
            ]} {...register("board")} />
            <Input label="Fee Amount" type="number" min={0} error={errors.fee_amount?.message} {...register("fee_amount")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Duration (months)" type="number" min={1} error={errors.duration_months?.message} {...register("duration_months")} />
            <Input label="Max Enrollments" type="number" min={1} error={errors.max_enrollments?.message} {...register("max_enrollments")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Thumbnail URL" placeholder="https://example.com/thumbnail.jpg" error={errors.thumbnail_url?.message} {...register("thumbnail_url")} />
            <Input label="Start Date" type="date" error={errors.start_date?.message} {...register("start_date")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="End Date" type="date" error={errors.end_date?.message} {...register("end_date")} />
            <Select label="Published" error={errors.is_published?.message} options={[
              { value: false, label: "Draft" },
              { value: true, label: "Published" },
            ]} {...register("is_published")} />
          </div>
        </DialogContent>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? "Update Course" : "Create Course"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}