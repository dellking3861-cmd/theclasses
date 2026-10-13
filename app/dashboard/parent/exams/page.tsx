import { PageHeader, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function ParentExamsPage() {
  return (
    <div>
      <PageHeader title="Exam Performance" description="Track your child's exam results" />
      <Card><CardContent><EmptyState icon={BarChart3} title="No exam results" description="Exam results will appear here after assessments." /></CardContent></Card>
    </div>
  );
}
