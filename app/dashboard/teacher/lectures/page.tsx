import { PageHeader, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Plus } from "lucide-react";

export default function TeacherLecturesPage() {
  return (
    <div>
      <PageHeader title="Video Lectures" description="Upload recorded lectures for students" action={<Button><Plus className="h-4 w-4" /> Upload Lecture</Button>} />
      <Card><CardContent><EmptyState icon={Video} title="No lectures uploaded" description="Upload video lectures for your students to watch." action={<Button><Plus className="h-4 w-4" /> Upload Lecture</Button>} /></CardContent></Card>
    </div>
  );
}
