"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import { PageHeader, Badge, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, formatDateTime } from "@/utils/format";
import { FileText, Plus } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { ExamForm } from "@/components/forms/exam-form";

export default function AdminExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await adminApi.getExams();
        setExams(data.data || []);
      } catch {}
      finally {
        setIsLoading(false);
      }
    };
    fetchExams();
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<typeof exams[0] | null>(null);
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
  const [teachers, setTeachers] = useState<{ id: string; full_name: string }[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [coursesData, teachersData] = await Promise.all([
          adminApi.getCourses(),
          adminApi.getTeachers(),
        ]);
        setCourses(coursesData.data || []);
        setTeachers(teachersData.data || []);
      } catch {}
    };
    fetchAll();
  }, []);

  const [depsLoaded, setDepsLoaded] = useState(false);

  useEffect(() => {
    if (courses.length > 0 && teachers.length > 0) {
      setDepsLoaded(true);
    }
  }, [courses, teachers]);

  const handleOpenAdd = () => {
    if (!depsLoaded || courses.length === 0 || teachers.length === 0) {
      return; // wait for deps to load
    }
    setEditingExam(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (exam: typeof exams[0]) => {
    setEditingExam(exam);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingExam(null);
  };

  const handleSuccess = () => {
    window.location.reload();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div>
      <PageHeader title="Exam Management" description="Manage exams and results" action={<Button onClick={handleOpenAdd}><Plus className="h-4 w-4" /> Create Exam</Button>} />
      {exams.length === 0 ? (
        <Card><CardContent><EmptyState icon={FileText} title="No exams scheduled" description="Create exams for your courses." action={<Button onClick={handleOpenAdd}><Plus className="h-4 w-4" /> Create Exam</Button>} /></CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {exams.map((exam) => (
            <Card key={exam.id} hover>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="info">{exam.exam_type}</Badge>
                  <Badge variant={exam.is_published ? "success" : "warning"}>{exam.is_published ? "Published" : "Draft"}</Badge>
                </div>
                <h3 className="font-semibold text-slate-900">{exam.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{exam.course?.title}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                  <span>{formatDateTime(exam.scheduled_at)}</span>
                  <span>{exam.total_marks} marks</span>
                  <span>{exam.duration_minutes} min</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(exam)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Edit
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} title="Add Exam" description="Create a new exam">
        <ExamForm
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={() => window.location.reload()}
          courses={courses}
          teachers={teachers}
        />
      </Dialog>
    </div>
  );
}
