"use client";

import { useState, useEffect } from "react";
import { adminApi, ALL } from "@/lib/api";
import { PageHeader, Badge, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, Plus } from "lucide-react";
import { ParentForm } from "@/components/forms/parent-form";

interface Parent {
  id: string;
  user_id: string;
  occupation: string | null;
  relationship: string;
  parent_students?: { student_id: string }[];
  user?: {
    full_name: string;
    email: string;
    phone?: string | null;
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
  const [students, setStudents] = useState<{ id: string; full_name: string }[]>([]);

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const [data, studentsData] = await Promise.all([adminApi.getParents(), adminApi.getStudents(ALL)]);
        setParents(data.data || []);
        setStudents(studentsData.data?.map((s) => ({ id: s.id, full_name: s.user?.full_name || s.user?.email || s.id })) || []);
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
        <Card><CardContent><EmptyState icon={UserCheck} title="No parent accounts" description="Add parent accounts to link with student profiles." action={<Button onClick={handleOpenAdd}><Plus className="h-4 w-4" /> Add Parent</Button>} /></CardContent></Card>
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

      <ParentForm
          key={editingParent?.id ?? "new"}
          open={isDialogOpen}
          onClose={handleCloseDialog}
          students={students}
          initialData={editingParent && {
            id: editingParent.id,
            email: editingParent.user?.email ?? "",
            full_name: editingParent.user?.full_name ?? "",
            phone: editingParent.user?.phone ?? "",
            occupation: editingParent.occupation ?? "",
            relationship: editingParent.relationship,
            student_ids: editingParent.parent_students?.map((l) => l.student_id) ?? [],
          }}
          onSuccess={() => window.location.reload()}
        />
    </div>
  );
}
