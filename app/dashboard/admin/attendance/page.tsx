import { AdminService } from "@/services";
import { PageHeader, Badge, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/utils/format";
import { ClipboardCheck } from "lucide-react";

export default async function AdminAttendancePage() {
  let attendance: Awaited<ReturnType<typeof AdminService.getAttendance>> = [];
  try { attendance = await AdminService.getAttendance(); } catch {}

  const statusVariant = { present: "success", absent: "danger", late: "warning", excused: "info" } as const;

  return (
    <div>
      <PageHeader title="Attendance Monitoring" description="Track student attendance across all courses" />
      {attendance.length === 0 ? (
        <Card><CardContent><EmptyState icon={ClipboardCheck} title="No attendance records" description="Attendance will appear here once teachers start marking." /></CardContent></Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left text-xs font-medium text-slate-500 uppercase px-6 py-3">Student</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase px-6 py-3">Course</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase px-6 py-3">Date</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase px-6 py-3">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {attendance.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{a.student?.user?.full_name || "—"}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{a.course?.title || "—"}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatDate(a.date)}</td>
                    <td className="px-6 py-4"><Badge variant={statusVariant[a.status]}>{a.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
