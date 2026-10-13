import { AdminService } from "@/services";
import { PageHeader, Badge, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/badge";
import { Users, Plus } from "lucide-react";
import Link from "next/link";

export default async function AdminStudentsPage() {
  let students: Awaited<ReturnType<typeof AdminService.getStudents>> = { data: [], total: 0, page: 1, pageSize: 20 };

  try {
    students = await AdminService.getStudents();
  } catch {
    // Database not connected
  }

  return (
    <div>
      <PageHeader
        title="Students"
        description={`${students.total} students registered`}
        action={
          <Button>
            <Plus className="h-4 w-4" /> Add Student
          </Button>
        }
      />

      {students.data.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={Users}
              title="No students yet"
              description="Add your first student to get started with student management."
              action={<Button><Plus className="h-4 w-4" /> Add Student</Button>}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
