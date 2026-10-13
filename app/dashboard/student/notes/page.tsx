import { PageHeader, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";

export default function StudentNotesPage() {
  return (
    <div>
      <PageHeader title="Study Notes" description="Download notes from your courses" />
      <Card><CardContent><EmptyState icon={Download} title="No notes available" description="Notes will appear here once uploaded by your teachers." /></CardContent></Card>
    </div>
  );
}
