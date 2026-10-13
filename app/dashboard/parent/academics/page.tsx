import { PageHeader, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function ParentAcademicsPage() {
  return (
    <div>
      <PageHeader title="Academic Reports" description="View detailed academic performance" />
      <Card><CardContent><EmptyState icon={FileText} title="No reports available" description="Academic reports will be generated as your child progresses." /></CardContent></Card>
    </div>
  );
}
