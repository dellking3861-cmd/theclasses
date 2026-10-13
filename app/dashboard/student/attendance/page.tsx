import { PageHeader, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardCheck } from "lucide-react";

export default function StudentAttendancePage() {
  return (
    <div>
      <PageHeader title="Attendance" description="Track your attendance percentage" />
      <Card><CardContent><EmptyState icon={ClipboardCheck} title="No attendance records" description="Your attendance will be tracked once classes begin." /></CardContent></Card>
    </div>
  );
}
