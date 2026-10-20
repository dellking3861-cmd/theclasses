import { requireAuth } from "@/lib/auth";
import { AdminService } from "@/services";
import { PageHeader, StatCard, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminBranchesPage() {
  await requireAuth("admin");

  let branches: Awaited<ReturnType<typeof AdminService.getBranches>> = [];

  try {
    branches = await AdminService.getBranches();
  } catch {
    // Database not available
  }

  const branchList = branches || [];
  const activeCount = branchList.filter((b) => b.is_active).length;
  const inactiveCount = branchList.filter((b) => !b.is_active).length;

  return (
    <div>
      <PageHeader
        title="Branches"
        description={`${activeCount} active, ${inactiveCount} inactive`}
      />

      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total" value={branchList.length} icon={Building2} />
        <StatCard title="Active" value={activeCount} icon={Calendar} changeType="positive" />
        <StatCard
          title="Inactive"
          value={inactiveCount}
          icon={Calendar}
          changeType="negative"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {branchList.length === 0 ? (
          <Card>
            <CardContent>
              <EmptyState
                icon={Building2}
                title="No branches"
                description="Create a branch to get started."
                action={
                  <Button>
                    <Building2 className="h-4 w-4" /> Add Branch
                  </Button>
                }
              />
            </CardContent>
          </Card>
        ) : (
          branchList.map((branch) => (
            <Card key={branch.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-none w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {branch.name}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <MapPin className="h-3 w-3" />
                      {branch.city}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Button className="w-full mt-6">Add New Branch</Button>
    </div>
  );
}