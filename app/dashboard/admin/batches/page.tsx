"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import { PageHeader, Badge, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/format";
import { Layers, Plus } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { BatchForm } from "@/components/forms/batch-form";

interface Batch {
  id: string;
  name: string;
  branch_id: string | null;
  start_date: string;
  end_date: string | null;
  max_students: number;
  is_active: boolean;
  branch?: {
    name: string;
  };
}

interface BatchesResponse {
  data: Batch[];
  total: number;
  page: number;
  pageSize: number;
}

export default function AdminBatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [branchesLoaded, setBranchesLoaded] = useState(false);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const data = await adminApi.getBatches();
        setBatches(data.data || []);
      } catch {}
      finally {
        setIsLoading(false);
      }
    };
    fetchBatches();
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await adminApi.getBranches();
        setBranches(data.data || []);
        setBranchesLoaded(true);
      } catch {}
    };
    fetchBranches();
  }, []);

  const handleOpenAdd = () => {
    if (!branchesLoaded || branches.length === 0) {
      return; // wait for branches to load
    }
    setEditingBatch(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (batch: Batch) => {
    setEditingBatch(batch);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBatch(null);
  };

  const handleSuccess = () => {
    window.location.reload();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div>
      <PageHeader title="Batch Management" description="Manage student batches" action={<Button onClick={handleOpenAdd}><Plus className="h-4 w-4" /> Create Batch</Button>} />
      {batches.length === 0 ? (
        <Card><CardContent><EmptyState icon={Layers} title="No batches" description="Create batches to organize students." action={<Button onClick={handleOpenAdd}><Plus className="h-4 w-4" /> Create Batch</Button>} /></CardContent></Card>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} title="Add Batch" description="Add a new batch to the system">
        <BatchForm
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={() => window.location.reload()}
          branches={branches}
        />
      </Dialog>
    </div>
  );
}