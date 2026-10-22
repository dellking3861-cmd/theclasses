"use client";

import { useState } from "react";
import { AdminService } from "@/services";
import { PageHeader, Badge, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/badge";
import { Users, Plus } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { StudentForm } from "@/components/forms/student-form";

export default function AdminStudentsPage() {
  let students = { data: [], total: 0, page: 1, pageSize: 20 };

  try {
    students = await AdminService.getStudents();
  } catch {
    // Database not connected
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<typeof students.data[0] | null>(null);
  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);
  const [batches, setBatches] = useState<{ id: string; name: string }[]>([]);

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (student: typeof students.data[0]) => {
    setEditingStudent(student);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingStudent(null);
  };

  const handleSuccess = () => {
    window.location.reload();
  };

  return (
    <div>
      <PageHeader
        title="Students"
        description={`${students.total} students registered`}
        action={<Button onClick={handleOpenAdd}><Plus className="h-4 w-4" /> Add Student</Button>}
      />

      {students.data.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={Users}
              title="No students yet"
              description="Add your first student to get started with student management."
              action={<Button onClick={handleOpenAdd}><Plus className="h-4 w-4" /> Add Student</Button>}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Student</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Roll No.</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Board</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Grade</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.data.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={student.user?.full_name || "Student"} src={student.user?.avatar_url} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{student.user?.full_name}</p>
                          <p className="text-xs text-slate-500">{student.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{student.roll_number || "—"}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 capitalize">{student.board?.replace("_", " ") || "—"}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{student.grade || "—"}</td>
                    <td className="px-6 py-4">
                      <Badge variant={student.is_active ? "success" : "danger"}>
                        {student.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} title="Add Student" description="Add a new student to the system">
        <StudentForm
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={() => window.location.reload()}
          branches={branches}
          batches={batches}
        />
      </Dialog>
    </div>
  );
}