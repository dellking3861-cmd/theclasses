"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import { PageHeader, StatCard, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Calendar, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { BranchForm } from "@/components/forms/branch-form";

interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState<{ id: string; name: string; address: string; city: string; phone: string | null; email: string | null; is_active: boolean; created_at: string; updated_at: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await adminApi.getBranches();
        setBranches(data.data || []);
      } catch {
        // Database not available
      } finally {
        setIsLoading(false);
      }
    };
    fetchBranches();
  }, []);

  const branchList = branches || [];
  const activeCount = branchList.filter((b) => b.is_active).length;
  const inactiveCount = branchList.filter((b) => !b.is_active).length;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<typeof branchList[0] | null>(null);

  const handleOpenAdd = () => {
    setEditingBranch(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (branch: typeof branchList[0]) => {
    setEditingBranch(branch);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBranch(null);
  };

  const handleSuccess = () => {
    window.location.reload();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div>
      <PageHeader
        title="Branches"
        description={`${activeCount} active, ${inactiveCount} inactive`}
        action={<Button onClick={handleOpenAdd}><Plus className="h-4 w-4" /> Add Branch</Button>}
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
                action={<Button onClick={handleOpenAdd}>Add Branch</Button>}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} title="Add Branch" description="Add a new branch to the system">
        <BranchForm
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={() => window.location.reload()}
        />
      </Dialog>
    </div>
  );
}
