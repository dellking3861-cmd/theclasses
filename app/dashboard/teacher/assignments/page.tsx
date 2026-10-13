import { PageHeader, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenTool, Plus } from "lucide-react";

export default function TeacherAssignmentsPage() {
  return (
    <div>
      <PageHeader title="Assignments" description="Create and manage assignments" action={<Button><Plus className="h-4 w-4" /> Create Assignment</Button>} />
      <Card><CardContent><EmptyState icon={PenTool} title="No assignments" description="Create assignments for your students." action={<Button><Plus className="h-4 w-4" /> Create Assignment</Button>} /></CardContent></Card>
    </div>
  );
}
