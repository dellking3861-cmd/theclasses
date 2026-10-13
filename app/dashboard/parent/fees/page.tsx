import { PageHeader, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function ParentFeesPage() {
  return (
    <div>
      <PageHeader title="Fee Payment Status" description="Track fee payments for your children" />
      <Card><CardContent><EmptyState icon={CreditCard} title="No fee records" description="Fee payment information will appear here." /></CardContent></Card>
    </div>
  );
}
