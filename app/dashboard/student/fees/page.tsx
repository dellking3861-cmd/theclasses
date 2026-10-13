import { PageHeader, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function StudentFeesPage() {
  return (
    <div>
      <PageHeader title="Fee Status" description="View your fee payments and dues" />
      <Card><CardContent><EmptyState icon={CreditCard} title="No fee records" description="Your fee payment history will appear here." /></CardContent></Card>
    </div>
  );
}
