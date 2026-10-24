"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import { PageHeader, Badge, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, Plus } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { ParentForm } from "@/components/forms/parent-form";

interface Parent {
  id: string;
  user_id: string;
  occupation: string | null;
  relationship: string;
  user?: {
    full_name: string;
    email: string;
    avatar_url: string | null;
  };
}

interface ParentsResponse {
  data: Parent[];
  total: number;
  page: number;
  pageSize: number;
}

export default function AdminParentsPage() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const data = await adminApi.getParents();
        setParents(data.data || []);
      } catch {
        // Database not connected
      } finally {
        setIsLoading(false);
      }
    };
    fetchParents();
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);

  const handleOpenAdd = () => {
    setEditingParent(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (parent: Parent) => {
    setEditingParent(parent);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingParent(null);
  };

  const handleSuccess = () => {
    window.location.reload();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div>
      <PageHeader title="Parent Accounts" description="Manage parent accounts and student links" action={<Button onClick={handleOpenAdd}><Plus className="h-4 w-4" /> Add Parent</Button>} />
      {parents.length === 0 ? (
        <Card><CardContent><EmptyState icon={UserCheck} title="No parent accounts" description="Add parent accounts to link with student profiles." action={<Button onClick={() => setIsDialogOpen(true)}><Plus className="h-4 w-4" /> Add Parent</Button>} /></CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {parents.map((parent) => (
            <Card key={parent.id} hover>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <UserCheck className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{parent.user?.full_name}</p>
                    <p className="text-sm text-slate-500">{parent.user?.email}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600">Occupation: {parent.occupation || "—"}</p>
                <p className="text-sm text-slate-600">Relationship: {parent.relationship}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(parent)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Edit
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} title="Add Parent" description="Add a new parent account">
        <ParentForm
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={() => window.location.reload()}
        />
      </Dialog>
    </div>
  );
}
