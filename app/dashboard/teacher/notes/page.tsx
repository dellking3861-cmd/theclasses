import { PageHeader, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Plus } from "lucide-react";

export default function TeacherNotesPage() {
  return (
    <div>
      <PageHeader title="Upload Notes" description="Share study materials with your students" action={<Button><Plus className="h-4 w-4" /> Upload Notes</Button>} />
      <Card><CardContent><EmptyState icon={Upload} title="No notes uploaded" description="Upload lecture notes for your students to download." action={<Button><Plus className="h-4 w-4" /> Upload Notes</Button>} /></CardContent></Card>
    </div>
  );
}
