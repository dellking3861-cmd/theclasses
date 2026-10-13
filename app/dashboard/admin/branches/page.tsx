import { AdminService } from "@/services";
import { PageHeader, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Plus, MapPin, Phone, Mail } from "lucide-react";

export default async function AdminBranchesPage() {
  let branches: Awaited<ReturnType<typeof AdminService.getBranches>> = [];
  try { branches = await AdminService.getBranches(); } catch {}

  return (
    <div>
      <PageHeader title="Branch Management" description="Manage campus locations" action={<Button><Plus className="h-4 w-4" /> Add Branch</Button>} />
      {branches.length === 0 ? (
        <Card><CardContent><EmptyState icon={Building2} title="No branches" description="Add your first campus branch." action={<Button><Plus className="h-4 w-4" /> Add Branch</Button>} /></CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <Card key={branch.id} hover>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-slate-900">{branch.name}</h3>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />{branch.address}, {branch.city}</p>
                  {branch.phone && <p className="flex items-center gap-2"><Phone className="h-4 w-4" />{branch.phone}</p>}
                  {branch.email && <p className="flex items-center gap-2"><Mail className="h-4 w-4" />{branch.email}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
