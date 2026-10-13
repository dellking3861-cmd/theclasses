import { AdminService } from "@/services";
import { PageHeader, Badge, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/badge";
import { GraduationCap, Plus } from "lucide-react";

export default async function AdminTeachersPage() {
  let teachers: Awaited<ReturnType<typeof AdminService.getTeachers>> = { data: [], total: 0, page: 1, pageSize: 20 };

  try {
    teachers = await AdminService.getTeachers();
  } catch {
    // Database not connected
  }

  return (
    <div>
      <PageHeader
        title="Teachers"
        description={`${teachers.total} teachers on staff`}
        action={<Button><Plus className="h-4 w-4" /> Add Teacher</Button>}
      />

      {teachers.data.length === 0 ? (
        <Card><CardContent>
          <EmptyState icon={GraduationCap} title="No teachers yet" description="Add teachers to manage courses and students." action={<Button><Plus className="h-4 w-4" /> Add Teacher</Button>} />
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
    </div>
  );
}
