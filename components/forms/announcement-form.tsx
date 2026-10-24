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

const announcementSchema = z.object({
  title: z.string().min(2, "Title required"),
  content: z.string().min(10, "Content required"),
  author_id: z.string().uuid(),
  branch_id: z.string().uuid().optional(),
  course_id: z.string().uuid().optional(),
  target_roles: z.array(z.enum(["admin", "teacher", "student", "parent"])).optional(),
  is_pinned: z.boolean(),
  published_at: z.string().optional(),
  expires_at: z.string().optional(),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

interface AnnouncementFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: AnnouncementFormData & { id: string } | null;
  branches?: { id: string; name: string }[];
}

export function AnnouncementForm({ open, onClose, onSuccess, initialData, branches = [] }: AnnouncementFormProps) {
  const isEditing = !!initialData;
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: initialData || {
      title: "",
      content: "",
      author_id: "",
      branch_id: undefined,
      course_id: undefined,
      target_roles: [],
      is_pinned: false,
      published_at: "",
      expires_at: "",
    },
  });

  const onSubmit = async (data: AnnouncementFormData) => {
    setIsLoading(true);
    try {
      const url = isEditing ? `/api/admin/announcements/${initialData?.id}` : "/api/admin/announcements";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save announcement");
      }

      toast.success(isEditing ? "Announcement updated successfully" : "Announcement created successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose} title={isEditing ? "Edit Announcement" : "Create Announcement"} description={isEditing ? "Update announcement" : "Create a new announcement"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="space-y-4">
          <Input label="Title" placeholder="Important Announcement" error={errors.title?.message} {...register("title")} />
          <Textarea label="Content" placeholder="Announcement content" error={errors.content?.message} {...register("content")} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Branch" placeholder="All branches" error={errors.branch_id?.message} options={branches.map(b => ({ value: b.id, label: b.name }))} {...register("branch_id")} />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_pinned" {...register("is_pinned")} className="h-4 w-4 rounded border-slate-300 text-indigo-600" />
              <label htmlFor="is_pinned" className="text-sm text-slate-700">Pinned</label>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Published At" type="datetime-local" error={errors.published_at?.message} {...register("published_at")} />
            <Input label="Expires At" type="datetime-local" error={errors.expires_at?.message} {...register("expires_at")} />
          </div>
        </DialogContent>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? "Update Announcement" : "Create Announcement"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
