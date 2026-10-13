import { PageHeader, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardCheck } from "lucide-react";

export default function ParentAttendancePage() {
  return (
    <div>
      <PageHeader title="Attendance Reports" description="View your child's attendance records" />
      <Card><CardContent><EmptyState icon={ClipboardCheck} title="No attendance data" description="Attendance reports will appear once classes begin." /></CardContent></Card>
    </div>
  );
}
