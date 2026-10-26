"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import { PageHeader, Badge, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/utils/format";
import { Megaphone, Plus } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { AnnouncementForm } from "@/components/forms/announcement-form";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await adminApi.getAnnouncements();
        setAnnouncements(data.data || []);
      } catch {}
      finally {
        setIsLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<typeof announcements[0] | null>(null);
  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await adminApi.getBranches();
        setBranches(data.data || []);
      } catch {}
    };
    fetchBranches();
  }, []);

  const [branchesLoaded, setBranchesLoaded] = useState(false);

  useEffect(() => {
    if (branches.length > 0) {
      setBranchesLoaded(true);
    }
  }, [branches]);

  const handleOpenAdd = () => {
    if (!branchesLoaded || branches.length === 0) {
      return; // wait for branches to load
    }
    setEditingAnnouncement(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (announcement: typeof announcements[0]) => {
    setEditingAnnouncement(announcement);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAnnouncement(null);
  };

  const handleSuccess = () => {
    window.location.reload();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div>
      <PageHeader title="Announcements" description="Send announcements to students, teachers, and parents" action={<Button onClick={handleOpenAdd}><Plus className="h-4 w-4" /> New Announcement</Button>} />
      {announcements.length === 0 ? (
        <Card><CardContent><EmptyState icon={Megaphone} title="No announcements" description="Create announcements to keep everyone informed." action={<Button onClick={handleOpenAdd}><Plus className="h-4 w-4" /> New Announcement</Button>} /></CardContent></Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <Card key={a.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{a.title}</h3>
                    <p className="text-sm text-slate-600 mt-2">{a.content}</p>
                    <p className="text-xs text-slate-400 mt-3">By {a.author?.full_name} ${a.published_at ? "· " + formatRelativeTime(a.published_at) : ""}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(a)}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} title="Add Announcement" description="Create a new announcement">
        <AnnouncementForm
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={() => window.location.reload()}
          branches={branches}
        />
      </Dialog>
    </div>
  );
}
