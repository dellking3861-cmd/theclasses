"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import { PageHeader, Badge, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import { BOARD_LABELS, SUBJECT_LABELS, PROGRAM_LABELS } from "@/lib/constants";
import { BookOpen, Plus } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { CourseForm } from "@/components/forms/course-form";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  course_type: string;
  board: string | null;
  subject: string | null;
  program: string | null;
  teacher_id: string | null;
  branch_id: string | null;
  batch_id: string | null;
  fee_amount: number;
  duration_months: number;
  max_enrollments: number;
  thumbnail_url: string | null;
  is_published: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  teacher?: {
    user?: {
      full_name: string;
    };
  };
  branch?: {
    name: string;
  };
  batch?: {
    name: string;
  };
}

function getCourseLabel(course: Course) {
  if (course.course_type === "board") {
    return `${course.subject ? SUBJECT_LABELS[course.subject] : ""} — ${course.board ? BOARD_LABELS[course.board] : ""}`;
  }
  return course.program ? PROGRAM_LABELS[course.program] : course.title;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<{ data: Course[]; total: number; page: number; pageSize: number }>({ data: [], total: 0, page: 1, pageSize: 20 });
  const [isLoading, setIsLoading] = useState(true);
  const [branchesLoaded, setBranchesLoaded] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await adminApi.getCourses();
        setCourses(data);
      } catch {}
      finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<typeof courses.data[0] | null>(null);
  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await adminApi.getBranches();
        setBranches(data.data || []);
        setBranchesLoaded(true);
      } catch {}
    };
    fetchBranches();
  }, []);

  const handleOpenAdd = () => {
    if (!branchesLoaded || branches.length === 0) {
      return; // wait for branches to load
    }
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

  function getCourseLabel(course: Course) {
    if (course.course_type === "board") {
      return `${course.subject ? SUBJECT_LABELS[course.subject] : ""} — ${course.board ? BOARD_LABELS[course.board] : ""}`;
    }
    return course.program ? PROGRAM_LABELS[course.program] : course.title;
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

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
          branches={branches}
        />
      </Dialog>
    </div>
  );
}
