import { PageHeader, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function StudentExamsPage() {
  return (
    <div>
      <PageHeader title="Exams & Quizzes" description="View exam schedules and results" />
      <Card><CardContent><EmptyState icon={FileText} title="No exams scheduled" description="Exam schedules and results will appear here." /></CardContent></Card>
    </div>
  );
}
