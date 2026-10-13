import { PageHeader, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function StudentCoursesPage() {
  return (
    <div>
      <PageHeader title="My Courses" description="View and manage your enrolled courses" />
      <Card><CardContent><EmptyState icon={BookOpen} title="No enrolled courses" description="Browse available courses and enroll to start learning." /></CardContent></Card>
    </div>
  );
}
