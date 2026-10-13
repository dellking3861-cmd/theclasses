import { PageHeader, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PenTool } from "lucide-react";

export default function TeacherGradingPage() {
  return (
    <div>
      <PageHeader title="Grade Assignments" description="Review and grade student submissions" />
      <Card><CardContent><EmptyState icon={PenTool} title="No submissions to grade" description="Student submissions will appear here for grading." /></CardContent></Card>
    </div>
  );
}
