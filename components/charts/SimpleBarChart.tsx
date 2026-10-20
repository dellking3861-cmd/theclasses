"use client";

import React from "react";

interface SimpleBarChartProps {
  data: { label: string; value: number }[];
}

export default function SimpleBarChart({ data }: SimpleBarChartProps) {
  return (
    <div className="space-y-2">
      {data.map((item, i) => (
        <div key={i} className="flex items-center">
          <span className="w-24 text-sm">{item.label}</span>
          <div className="flex-1 bg-gray-200 h-4 rounded">
            <div
              className="h-4 bg-amber-500 rounded"
              style={{ width: `${item.value}%` }}
            />
          </div>
          <span className="ml-2 text-sm">{item.value}%</span>
        </div>
      ))}
    </div>
  );
}
