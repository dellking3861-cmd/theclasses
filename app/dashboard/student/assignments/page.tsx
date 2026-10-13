import { PageHeader, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PenTool } from "lucide-react";

export default function StudentAssignmentsPage() {
  return (
    <div>
      <PageHeader title="Assignments" description="View and submit your homework" />
      <Card><CardContent><EmptyState icon={PenTool} title="No assignments" description="Assignments from your teachers will appear here." /></CardContent></Card>
    </div>
  );
}
