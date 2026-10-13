import { PageHeader, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

export default function AdminAssignmentsPage() {
  return (
    <div>
      <PageHeader title="Assignments" description="Manage course assignments" action={<Button><Plus className="h-4 w-4" /> Upload Assignment</Button>} />
      <Card><CardContent><EmptyState icon={FileText} title="No assignments" description="Teachers can create assignments from their dashboard." /></CardContent></Card>
    </div>
  );
}
