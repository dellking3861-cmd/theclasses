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

const courseSchema = z.object({
  title: z.string().min(2, "Course title required"),
  slug: z.string().min(2, "Slug required").regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  course_type: z.enum(["board", "special_program"]),
  stage: z.string().optional(),
  board: z.string().optional(),
  group_code: z.string().optional(),
  subject: z.string().optional(),
  program: z.enum(["ai_web_development", "spoken_english", "programming_fundamentals", "freelancing", "entry_test_preparation"]).optional().or(z.literal("")),
  teacher_id: z.string().uuid().optional().or(z.literal("")),
  branch_id: z.string().uuid().optional().or(z.literal("")),
  batch_id: z.string().uuid().optional().or(z.literal("")),
  fee_amount: z.number().min(0),
  duration_months: z.number().min(1),
  max_enrollments: z.number().min(1),
  thumbnail_url: z.string().optional(),
  is_published: z.boolean(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
}).superRefine((d, ctx) => {
  if (d.course_type !== "board") return;
  if (!d.stage) ctx.addIssue({ code: "custom", path: ["stage"], message: "Choose a level" });
  if (!d.board) ctx.addIssue({ code: "custom", path: ["board"], message: "Choose a board" });
  if (!d.subject) ctx.addIssue({ code: "custom", path: ["subject"], message: "Choose a subject" });
  if (!isValidSelection({ board: d.board, stage: d.stage, group: d.group_code, subject: d.subject })) {
    ctx.addIssue({ code: "custom", path: ["subject"], message: "That subject isn't offered for this board, level and group" });
  }
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: CourseFormData & { id: string } | null;
  branches?: { id: string; name: string }[];
  batches?: { id: string; name: string }[];
  teachers?: { id: string; user?: { full_name: string } }[];
}

export function CourseForm({ open, onClose, onSuccess, initialData, branches = [], batches = [], teachers = [] }: CourseFormProps) {
  const isEditing = !!initialData;
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: initialData || {
      title: "",
      slug: "",
      description: "",
      course_type: "board",
      stage: "",
      board: "",
      group_code: "",
      subject: "",
      program: "",
      teacher_id: undefined,
      branch_id: undefined,
      batch_id: undefined,
      fee_amount: 0,
      duration_months: 12,
      max_enrollments: 50,
      thumbnail_url: "",
      is_published: false,
      start_date: "",
      end_date: "",
    },
  });

  const courseType = watch("course_type");
  const curriculum: CurriculumValue = {
    stage: watch("stage") ?? "",
    board: watch("board") ?? "",
    group: watch("group_code") ?? "",
    subject: watch("subject") ?? "",
  };
  function setCurriculum(v: CurriculumValue) {
    const opts = { shouldDirty: true, shouldValidate: !!errors.subject || !!errors.board || !!errors.stage };
    setValue("stage", v.stage, opts);
    setValue("board", v.board, opts);
    setValue("group_code", v.group, opts);
    setValue("subject", v.subject, opts);
  }

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
    <Dialog open={open} onOpenChange={onClose} title={isEditing ? "Edit Course" : "Create Course"} description={isEditing ? "Update course information" : "Create a new course"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader title={isEditing ? "Edit Course" : "Create Course"} description={isEditing ? "Update course information" : "Create a new course"} />
        <DialogContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Title" placeholder="Mathematics 101" error={errors.title?.message} {...register("title")} />
            <Input label="Slug" placeholder="mathematics-101" error={errors.slug?.message} {...register("slug")} />
          </div>
          <Input label="Description" placeholder="Course description" error={errors.description?.message} {...register("description")} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Course Type" error={errors.course_type?.message} options={[
              { value: "board", label: "Board" },
              { value: "special_program", label: "Special Program" },
            ]} {...register("course_type")} />
          </div>
          {courseType === "board" && (
            <CurriculumSelect
              value={curriculum}
              onChange={setCurriculum}
              showSubject
              required
              idPrefix="course"
              errors={{ stage: errors.stage?.message, board: errors.board?.message, group: errors.group_code?.message, subject: errors.subject?.message }}
            />
          )}
          <div className="grid sm:grid-cols-2 gap-4">
{courseType === "special_program" && (
            <Select label="Program" placeholder="Select program" error={errors.program?.message} options={[
              { value: "ai_web_development", label: "AI Web Development" },
              { value: "spoken_english", label: "Spoken English" },
              { value: "programming_fundamentals", label: "Programming Fundamentals" },
              { value: "freelancing", label: "Freelancing" },
              { value: "entry_test_preparation", label: "Entry Test Preparation" },
            ]} {...register("program")} />
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Teacher" placeholder="Select teacher" error={errors.teacher_id?.message} options={teachers.map(t => ({ value: t.id, label: t.user?.full_name || t.id }))} {...register("teacher_id")} />
            <Select label="Branch" placeholder="Select branch" error={errors.branch_id?.message} options={branches.map(b => ({ value: b.id, label: b.name }))} {...register("branch_id")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Batch" placeholder="Select batch" error={errors.batch_id?.message} options={batches.map(b => ({ value: b.id, label: b.name }))} {...register("batch_id")} />
            <Input label="Fee Amount" type="number" min={0} error={errors.fee_amount?.message} {...register("fee_amount", { valueAsNumber: true })} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Duration (months)" type="number" min={1} error={errors.duration_months?.message} {...register("duration_months", { valueAsNumber: true })} />
            <Input label="Max Enrollments" type="number" min={1} error={errors.max_enrollments?.message} {...register("max_enrollments", { valueAsNumber: true })} />
          </div>
          <Input label="Thumbnail URL" placeholder="https://example.com/image.jpg" error={errors.thumbnail_url?.message} {...register("thumbnail_url")} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Start Date" type="date" error={errors.start_date?.message} {...register("start_date")} />
            <Input label="End Date" type="date" error={errors.end_date?.message} {...register("end_date")} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_published" {...register("is_published")} className="h-4 w-4 rounded border-slate-300 text-indigo-600" />
            <label htmlFor="is_published" className="text-sm text-slate-700">Published</label>
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