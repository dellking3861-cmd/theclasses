import { AdminService } from "@/services";
import { PageHeader, Badge, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/format";
import { Layers, Plus, Building2, UserCheck, CreditCard } from "lucide-react";

export default async function AdminBatchesPage() {
  let batches: Awaited<ReturnType<typeof AdminService.getBatches>> = [];
  try { batches = await AdminService.getBatches(); } catch {}

  return (
    <div>
      <PageHeader title="Batch Management" description="Manage student batches" action={<Button><Plus className="h-4 w-4" /> Create Batch</Button>} />
      {batches.length === 0 ? (
        <Card><CardContent><EmptyState icon={Layers} title="No batches" description="Create batches to organize students." action={<Button><Plus className="h-4 w-4" /> Create Batch</Button>} /></CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => (
            <Card key={batch.id} hover>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-slate-900">{batch.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{batch.branch?.name}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                  <span>Start: {formatDate(batch.start_date)}</span>
                  <span>Max: {batch.max_students}</span>
                </div>
                <Badge variant={batch.is_active ? "success" : "default"} className="mt-3">{batch.is_active ? "Active" : "Inactive"}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
