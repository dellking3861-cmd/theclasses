"use client";

import { PageHeader, StatCard } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, ClipboardCheck, FileText, Award } from "lucide-react";

const progressData = [
  { subject: "Math", score: 85 },
  { subject: "Physics", score: 78 },
  { subject: "Chemistry", score: 92 },
  { subject: "English", score: 88 },
];

export default function StudentProgressPage() {
  return (
    <div>
      <PageHeader title="Progress Analytics" description="Track your academic performance" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Overall Grade" value="A" icon={Award} changeType="positive" />
        <StatCard title="Attendance" value="87%" icon={ClipboardCheck} changeType="positive" />
        <StatCard title="Assignments Done" value="12/15" icon={FileText} />
        <StatCard title="Avg. Exam Score" value="82%" icon={TrendingUp} changeType="positive" />
      </div>

      <Card>
        <CardHeader><CardTitle>Subject Performance</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="subject" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
              <Tooltip formatter={(value) => `${Number(value)}%`} />
              <Bar dataKey="score" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
