import { requireAuth } from "@/lib/auth";
import { ParentService } from "@/services";
import { PageHeader, StatCard, Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercentage } from "@/utils/format";
import { Users, ClipboardCheck, CreditCard, FileText } from "lucide-react";

export default async function ParentDashboardPage() {
  const user = await requireAuth("parent");

  let linkedStudents: Awaited<ReturnType<typeof ParentService.getLinkedStudents>> = [];

  try {
    const profile = await ParentService.getProfile(user.id);
    linkedStudents = await ParentService.getLinkedStudents(profile.id);
  } catch {}

  return (
    <div>
      <PageHeader title={`Welcome, ${user.full_name}`} description="Monitor your child's academic progress" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Linked Students" value={linkedStudents.length} icon={Users} />
        <StatCard title="Avg. Attendance" value="—" icon={ClipboardCheck} />
        <StatCard title="Pending Fees" value="—" icon={CreditCard} />
        <StatCard title="Recent Exams" value="—" icon={FileText} />
      </div>

      <Card>
        <CardHeader><CardTitle>Your Children</CardTitle></CardHeader>
        <CardContent>
          {linkedStudents.length === 0 ? (
            <p className="text-sm text-slate-500">No students linked to your account. Contact the admin to link your child&apos;s profile.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {linkedStudents.map((link) => (
                <div key={link.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-slate-900">{link.student?.user?.full_name}</p>
                    <Badge variant="info">{link.relationship}</Badge>
                  </div>
                  <p className="text-sm text-slate-500">{link.student?.branch?.name || "No branch"}</p>
                  <p className="text-xs text-slate-400 mt-1">Roll: {link.student?.roll_number || "—"}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
