import { PageHeader } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminFeesPage() {
  return (
    <div>
      <PageHeader title="Fee Management" description="Configure and manage course fees" />
      <Card className="mb-6">
        <CardHeader><CardTitle>Fee Structure</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">Configure fee amounts when creating or editing courses. Payment tracking is available in the Payments section.</p>
        </CardContent>
      </Card>
    </div>
  );
}
