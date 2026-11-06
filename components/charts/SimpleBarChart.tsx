interface SimpleBarChartProps {
  data: { label: string; value: number }[];
  /** Shown after each value, e.g. "%" */
  suffix?: string;
}

/** Horizontal bars scaled to the largest value. */
export default function SimpleBarChart({ data, suffix = "" }: SimpleBarChartProps) {
  const max = Math.max(0, ...data.map((d) => d.value));
  if (data.length === 0) return <p className="text-sm text-slate-500">No data yet.</p>;
  return (
    <div className="space-y-2">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-28 shrink-0 truncate text-sm" title={item.label}>{item.label}</span>
          <div className="h-4 flex-1 rounded bg-gray-200">
            <div className="h-4 rounded bg-amber-500" style={{ width: `${max ? (item.value / max) * 100 : 0}%` }} />
          </div>
          <span className="w-20 shrink-0 text-right text-sm tabular-nums">{item.value.toLocaleString("en-PK")}{suffix}</span>
        </div>
      ))}
    </div>
  );
}
