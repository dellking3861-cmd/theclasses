import { PageHeader, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";

export default function ParentNotificationsPage() {
  return (
    <div>
      <PageHeader title="Notifications" description="Stay updated on your child's progress" />
      <Card><CardContent><EmptyState icon={Bell} title="No notifications" description="You'll receive notifications about attendance, fees, and exam results." /></CardContent></Card>
    </div>
  );
}
