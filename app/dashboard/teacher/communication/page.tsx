import { PageHeader, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function TeacherCommunicationPage() {
  return (
    <div>
      <PageHeader title="Student Communication" description="Send messages and feedback to students" />
      <Card><CardContent><EmptyState icon={MessageSquare} title="No messages" description="Communicate with your students through this panel." /></CardContent></Card>
    </div>
  );
}
