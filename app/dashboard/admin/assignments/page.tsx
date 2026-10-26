"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import { PageHeader, Badge, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { AssignmentForm } from "@/components/forms/assignment-form";

export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await adminApi.getAssignments();
        setAssignments(data.data || []);
      } catch {}
      finally {
        setIsLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<typeof assignments[0] | null>(null);
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
    setEditingAssignment(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (assignment: typeof assignments[0]) => {
    setEditingAssignment(assignment);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAssignment(null);
  };

  const handleSuccess = () => {
    window.location.reload();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div>
      <PageHeader title="Assignments" description="Manage course assignments" action={<Button onClick={handleOpenAdd}><Plus className="h-4 w-4" /> Create Assignment</Button>} />
      {assignments.length === 0 ? (
        <Card><CardContent><EmptyState icon={FileText} title="No assignments" description="Create assignments for your courses." action={<Button onClick={handleOpenAdd}><Plus className="h-4 w-4" /> Create Assignment</Button>} /></CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <Card key={assignment.id} hover>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant={assignment.status === "published" ? "success" : assignment.status === "draft" ? "warning" : "default"}>{assignment.status}</Badge>
                </div>
                <h3 className="font-semibold text-slate-900">{assignment.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{assignment.course?.title}</p>
                <p className="text-xs text-slate-400 mt-2">Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : "—"}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(assignment)}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} title="Add Assignment" description="Create a new assignment">
        <AssignmentForm
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={() => window.location.reload()}
          courses={[]}
          teachers={[]}
        />
      </Dialog>
    </div>
  );
}
