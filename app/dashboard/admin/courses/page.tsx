"use client";

import { useState } from "react";
import { AdminService } from "@/services";
import { PageHeader, Badge, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import { BOARD_LABELS, SUBJECT_LABELS, PROGRAM_LABELS } from "@/lib/constants";
import { BookOpen, Plus } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { CourseForm } from "@/components/forms/course-form";

export default async function AdminCoursesPage() {
  let courses: Awaited<ReturnType<typeof AdminService.getCourses>> = { data: [], total: 0, page: 1, pageSize: 20 };

  try {
    courses = await AdminService.getCourses();
  } catch {}

  function getCourseLabel(course: (typeof courses.data)[0]) {
    if (course.course_type === "board") {
      return `${course.subject ? SUBJECT_LABELS[course.subject] : ""} — ${course.board ? BOARD_LABELS[course.board] : ""}`;
    }
    return course.program ? PROGRAM_LABELS[course.program] : course.title;
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<typeof courses.data[0] | null>(null);
  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (course: typeof courses.data[0]) => {
    setEditingCourse(course);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCourse(null);
  };

  const handleSuccess = () => {
    window.location.reload();
  };

  return (
    <div>
      <PageHeader title="Courses" description={`${courses.total} courses`} action={<Button onClick={handleOpenAdd}><Plus className="h-4 w-4" /> Create Course</Button>} />
      {courses.data.length === 0 ? (
        <Card><CardContent><EmptyState icon={BookOpen} title="No courses yet" description="Create your first course to start enrolling students." action={<Button onClick={handleOpenAdd}><Plus className="h-4 w-4" /> Create Course</Button>} /></CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.data.map((course) => (
            <Card key={course.id} hover>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant={course.is_published ? "success" : "warning"}>${course.is_published ? "Published" : "Draft"}</Badge>
                  <span className="font-bold text-indigo-600">{formatCurrency(course.fee_amount)}</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">${getCourseLabel(course)}</h3>
                <p className="text-sm text-slate-500 line-clamp-2">${course.description}</p>
                <p className="text-xs text-slate-400 mt-3">${course.duration_months} months · Max ${course.max_enrollments} students</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} title="Add Course" description="Add a new course to the system">
        <CourseForm
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={() => window.location.reload()}
          branches={[]}
        />
      </Dialog>
    </div>
  );
}
