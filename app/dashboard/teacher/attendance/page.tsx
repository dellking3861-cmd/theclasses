import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AttendanceMarker } from "@/components/forms/attendance-marker";
import { ClipboardCheck } from "lucide-react";

export const metadata = { title: "Mark Attendance" };

export default async function TeacherAttendancePage() {
  const user = await requireAuth("teacher");
  const supabase = await createClient();
  const { data: teacher } = await supabase.from("teachers").select("id").eq("user_id", user.id).maybeSingle();

  return (
    <div>
      <PageHeader title="Mark Attendance" description="Record attendance for your classes" />
      {teacher ? (
        <AttendanceMarker teacherId={teacher.id} />
      ) : (
        <Card><CardContent><EmptyState icon={ClipboardCheck} title="No teacher profile" description="Ask the office to finish setting up your teacher account." /></CardContent></Card>
      )}
    </div>
  );
}
