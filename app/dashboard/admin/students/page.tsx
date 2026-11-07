"use client";

import { useState, useEffect } from "react";
import { adminApi, ALL } from "@/lib/api";
import { PageHeader, Badge, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/badge";
import { Users, Plus } from "lucide-react";
import { StudentForm } from "@/components/forms/student-form";
import { AccountActions } from "@/components/forms/account-actions";

interface Student {
  id: string;
  roll_number: string | null;
  board: string | null;
  grade: string | null;
  is_active: boolean;
  stage: string | null;
  group_code: string | null;
  branch_id: string | null;
  batch_id: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  emergency_contact: string | null;
  enrollments?: { course_id: string }[];
  user?: {
    full_name: string;
    email: string;
    phone: string | null;
    avatar_url: string | null;
  };
}

interface StudentsResponse {
  data: Student[];
  total: number;
  page: number;
  pageSize: number;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<{ data: Student[]; total: number; page: number; pageSize: number }>({ data: [], total: 0, page: 1, pageSize: 20 });
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
  const [branchesLoaded, setBranchesLoaded] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [studentsData, coursesData, branchesData, batchesData] = await Promise.all([
          adminApi.getStudents(),
          adminApi.getCourses(ALL),
          adminApi.getBranches(),
          adminApi.getBatches(),
        ]);
        setStudents(studentsData);
        setCourses(coursesData.data || []);
        setBranches(branchesData.data || []);
        setBatches(batchesData.data || []);
        setBranchesLoaded(true);
      } catch {
        // Database not connected
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);
  const [batches, setBatches] = useState<{ id: string; name: string }[]>([]);

  const handleOpenAdd = () => {
    if (!branchesLoaded || branches.length === 0) {
      return; // wait for branches to load
    }
    setEditingStudent(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (student: Student) => {
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

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

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
                      <span className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => handleEdit(student)}
                          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Edit
                        </button>
                        <AccountActions kind="students" id={student.id} name={student.user?.full_name || "this student"} active={student.is_active} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <StudentForm
          key={editingStudent?.id ?? "new"}
          open={isDialogOpen}
          onClose={handleCloseDialog}
          initialData={editingStudent && {
            id: editingStudent.id,
            email: editingStudent.user?.email ?? "",
            full_name: editingStudent.user?.full_name ?? "",
            phone: editingStudent.user?.phone ?? "",
            roll_number: editingStudent.roll_number ?? "",
            branch_id: editingStudent.branch_id ?? "",
            batch_id: editingStudent.batch_id ?? "",
            date_of_birth: editingStudent.date_of_birth ?? "",
            gender: (editingStudent.gender as "male" | "female" | "other" | null) ?? "",
            address: editingStudent.address ?? "",
            emergency_contact: editingStudent.emergency_contact ?? "",
            grade: editingStudent.grade ?? "",
            stage: editingStudent.stage ?? "",
            board: editingStudent.board ?? "",
            group_code: editingStudent.group_code ?? "",
            course_ids: editingStudent.enrollments?.map((e) => e.course_id) ?? [],
          }}
          courses={courses}
          onSuccess={() => window.location.reload()}
          branches={branches}
          batches={batches}
        />
    </div>
  );
}