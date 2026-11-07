import { EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export function NoChildren() {
  return (
    <Card>
      <CardContent>
        <EmptyState icon={Users} title="No children linked yet" description="Ask the office to link your child to your account." />
      </CardContent>
    </Card>
  );
}
