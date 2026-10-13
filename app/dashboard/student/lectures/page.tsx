import { PageHeader, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Video } from "lucide-react";

export default function StudentLecturesPage() {
  return (
    <div>
      <PageHeader title="Recorded Lectures" description="Watch lectures from your enrolled courses" />
      <Card><CardContent><EmptyState icon={Video} title="No lectures available" description="Lectures will appear here once your teachers upload them." /></CardContent></Card>
    </div>
  );
}
