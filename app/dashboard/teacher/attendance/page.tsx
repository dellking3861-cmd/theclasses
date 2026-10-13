import { PageHeader, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCheck } from "lucide-react";

export default function TeacherAttendancePage() {
  return (
    <div>
      <PageHeader title="Mark Attendance" description="Record student attendance for your classes" action={<Button>Mark Today's Attendance</Button>} />
      <Card><CardContent><EmptyState icon={ClipboardCheck} title="No attendance marked" description="Select a course and date to mark attendance." /></CardContent></Card>
    </div>
  );
}
