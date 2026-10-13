import { AdminService } from "@/services";
import { PageHeader, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/utils/format";
import { Megaphone, Plus } from "lucide-react";

export default async function AdminAnnouncementsPage() {
  let announcements: Awaited<ReturnType<typeof AdminService.getAnnouncements>> = [];
  try { announcements = await AdminService.getAnnouncements(); } catch {}

  return (
    <div>
      <PageHeader title="Announcements" description="Send announcements to students, teachers, and parents" action={<Button><Plus className="h-4 w-4" /> New Announcement</Button>} />
      {announcements.length === 0 ? (
        <Card><CardContent><EmptyState icon={Megaphone} title="No announcements" description="Create announcements to keep everyone informed." action={<Button><Plus className="h-4 w-4" /> New Announcement</Button>} /></CardContent></Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <Card key={a.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{a.title}</h3>
                    <p className="text-sm text-slate-600 mt-2">{a.content}</p>
                    <p className="text-xs text-slate-400 mt-3">By {a.author?.full_name} · {a.published_at ? formatRelativeTime(a.published_at) : ""}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
