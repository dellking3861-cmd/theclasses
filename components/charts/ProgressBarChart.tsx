"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ProgressBarChartProps {
  data: { subject: string; score: number }[];
}

export default function ProgressBarChart({ data }: ProgressBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="subject" stroke="#64748b" fontSize={12} />
        <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
        <Tooltip formatter={(value) => `${Number(value)}%`} />
        <Bar dataKey="score" fill="#4f46e5" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
