import { PageHeader, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, Plus } from "lucide-react";

export default function AdminParentsPage() {
  return (
    <div>
      <PageHeader title="Parent Accounts" description="Manage parent accounts and student links" action={<Button><Plus className="h-4 w-4" /> Link Parent</Button>} />
      <Card><CardContent><EmptyState icon={UserCheck} title="No parent accounts" description="Link parent accounts to student profiles for monitoring." action={<Button><Plus className="h-4 w-4" /> Link Parent</Button>} /></CardContent></Card>
    </div>
  );
}
