import { createClient } from "@/lib/supabase/server";
import { PageHeader, StatCard } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SimpleBarChart from "@/components/charts/SimpleBarChart";
import { boardLabel } from "@/lib/curriculum";
import { Users, CreditCard, ClipboardCheck, UserPlus } from "lucide-react";

export const metadata = { title: "Analytics" };

// Months are counted in Karachi time, so a payment at 00:30 on the 1st lands in the right month
const monthKey = (d: string | Date) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Karachi", year: "numeric", month: "2-digit" }).format(new Date(d)).slice(0, 7);

function lastMonths(n: number): { key: string; label: string }[] {
  const [y, m] = monthKey(new Date()).split("-").map(Number);
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(Date.UTC(y, m - 1 - (n - 1 - i), 15));
    return { key: d.toISOString().slice(0, 7), label: d.toLocaleString("en", { month: "short", timeZone: "UTC" }) };
  });
}

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();
  const months = lastMonths(6);
  const since = `${months[0].key}-01`;

  // shortcut: loads every student row and 6 months of payments/attendance; fine for one campus, move to SQL aggregates past ~10k rows
  const [{ data: students }, { data: payments }, { data: attendance }] = await Promise.all([
    supabase.from("students").select("board, created_at, is_active"),
    supabase.from("payments").select("paid_amount, paid_at").not("paid_at", "is", null).gte("paid_at", since),
    supabase.from("attendance").select("status").gte("date", since),
  ]);

  const newByMonth = new Map<string, number>();
  for (const s of students ?? []) newByMonth.set(monthKey(s.created_at), (newByMonth.get(monthKey(s.created_at)) ?? 0) + 1);
  const feesByMonth = new Map<string, number>();
  for (const p of payments ?? []) feesByMonth.set(monthKey(p.paid_at!), (feesByMonth.get(monthKey(p.paid_at!)) ?? 0) + Number(p.paid_amount ?? 0));
  const byBoard = new Map<string, number>();
  for (const s of students ?? []) if (s.is_active) byBoard.set(boardLabel(s.board) || "No board", (byBoard.get(boardLabel(s.board) || "No board") ?? 0) + 1);

  const thisMonth = months[months.length - 1].key;
  const marked = attendance?.length ?? 0;
  const present = attendance?.filter((a) => a.status === "present" || a.status === "late").length ?? 0;

  return (
    <div>
      <PageHeader title="Analytics Dashboard" description="Live figures from your records (last 6 months)" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Active Students" value={(students ?? []).filter((s) => s.is_active).length} icon={Users} />
        <StatCard title="New This Month" value={newByMonth.get(thisMonth) ?? 0} icon={UserPlus} />
        <StatCard title="Fees Collected This Month" value={`PKR ${(feesByMonth.get(thisMonth) ?? 0).toLocaleString("en-PK")}`} icon={CreditCard} />
        <StatCard title="Attendance Rate" value={marked ? `${Math.round((present / marked) * 100)}%` : "—"} icon={ClipboardCheck} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader><CardTitle>New Students per Month</CardTitle></CardHeader>
          <CardContent>
            <SimpleBarChart data={months.map((m) => ({ label: m.label, value: newByMonth.get(m.key) ?? 0 }))} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Fees Collected per Month (PKR)</CardTitle></CardHeader>
          <CardContent>
            <SimpleBarChart data={months.map((m) => ({ label: m.label, value: Math.round(feesByMonth.get(m.key) ?? 0) }))} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Active Students by Board</CardTitle></CardHeader>
        <CardContent>
          <SimpleBarChart data={[...byBoard].sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value }))} />
        </CardContent>
      </Card>
    </div>
  );
}
