import { PageHeader, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function ParentFeedbackPage() {
  return (
    <div>
      <PageHeader title="Teacher Feedback" description="View feedback from your child's teachers" />
      <Card><CardContent><EmptyState icon={MessageSquare} title="No feedback yet" description="Teacher feedback will appear here." /></CardContent></Card>
    </div>
  );
}
