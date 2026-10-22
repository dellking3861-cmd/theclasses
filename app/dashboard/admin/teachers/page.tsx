"use client";

import { useState } from "react";
import { AdminService } from "@/services";
import { PageHeader, Badge, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/badge";
import { GraduationCap, Plus } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { TeacherForm } from "@/components/forms/teacher-form";

export default async function AdminTeachersPage() {
  let teachers: Awaited<ReturnType<typeof AdminService.getTeachers>> = { data: [], total: 0, page: 1, pageSize: 20 };

  try {
    teachers = await AdminService.getTeachers();
  } catch {
    // Database not connected
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<typeof teachers.data[0] | null>(null);
  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (teacher: typeof teachers.data[0]) => {
    setEditingTeacher(teacher);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTeacher(null);
  };

  const handleSuccess = () => {
    window.location.reload();
  };

  return (
    <div>
      <PageHeader
        title="Teachers"
        description={`${teachers.total} teachers on staff`}
        action={<Button onClick={handleOpenAdd}><Plus className="h-4 w-4" /> Add Teacher</Button>}
      />

      {teachers.data.length === 0 ? (
        <Card><CardContent>
          <EmptyState icon={GraduationCap} title="No teachers yet" description="Add teachers to manage courses and students." action={<Button onClick={handleOpenAdd}><Plus className="h-4 w-4" /> Add Teacher</Button>} />
        </CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.data.map((teacher) => (
            <Card key={teacher.id} hover>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar name={teacher.user?.full_name || "Teacher"} src={teacher.user?.avatar_url} />
                  <div>
                    <p className="font-semibold text-slate-900">{teacher.user?.full_name}</p>
                    <p className="text-sm text-slate-500">{teacher.user?.email}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-600">ID: {teacher.employee_id || "—"}</p>
                  <p className="text-slate-600">Experience: {teacher.experience_years} years</p>
                  <Badge variant={teacher.is_active ? "success" : "danger"}>
                    {teacher.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} title="Add Teacher" description="Add a new teacher to the system">
        <TeacherForm
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={() => window.location.reload()}
          branches={[]}
        />
      </Dialog>
    </div>
  );
}
