"use client";

import { PageHeader, StatCard } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Users, CreditCard, ClipboardCheck, TrendingUp } from "lucide-react";

const enrollmentData = [
  { month: "Jan", students: 120 }, { month: "Feb", students: 145 },
  { month: "Mar", students: 180 }, { month: "Apr", students: 210 },
  { month: "May", students: 250 }, { month: "Jun", students: 290 },
];

const revenueData = [
  { month: "Jan", revenue: 450000 }, { month: "Feb", revenue: 520000 },
  { month: "Mar", revenue: 680000 }, { month: "Apr", revenue: 750000 },
  { month: "May", revenue: 890000 }, { month: "Jun", revenue: 950000 },
];

const boardDistribution = [
  { name: "AKU-EB", value: 35, color: "#4f46e5" },
  { name: "Sindh Board", value: 25, color: "#10b981" },
  { name: "Cambridge O", value: 22, color: "#8b5cf6" },
  { name: "Cambridge A", value: 18, color: "#f59e0b" },
];

export default function AdminAnalyticsPage() {
  return (
    <div>
      <PageHeader title="Analytics Dashboard" description="Platform performance insights" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Monthly Enrollments" value="290" icon={Users} change="+15.6%" changeType="positive" />
        <StatCard title="Monthly Revenue" value="PKR 950K" icon={CreditCard} change="+8.2%" changeType="positive" />
        <StatCard title="Avg. Attendance" value="87.5%" icon={ClipboardCheck} change="+2.1%" changeType="positive" />
        <StatCard title="Retention Rate" value="94.2%" icon={TrendingUp} change="+1.3%" changeType="positive" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader><CardTitle>Enrollment Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Bar dataKey="students" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Revenue Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip formatter={(value) => `PKR ${Number(value).toLocaleString()}`} />
                <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} dot={{ fill: "#4f46e5" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Students by Board</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={boardDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {boardDistribution.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
