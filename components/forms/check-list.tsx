"use client";

/** A labelled list of checkboxes that returns the ticked ids. */
export function CheckList({
  label,
  options,
  value,
  onChange,
  empty,
}: {
  label: string;
  options: { id: string; label: string }[];
  value: string[];
  onChange: (ids: string[]) => void;
  empty: string;
}) {
  return (
    <fieldset className="space-y-1.5">
      <legend className="block text-sm font-medium text-slate-700">{label}</legend>
      {options.length === 0 ? (
        <p className="text-sm text-slate-500">{empty}</p>
      ) : (
        <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-slate-200 p-2">
          {options.map((o) => (
            <label key={o.id} className="flex min-h-10 cursor-pointer items-center gap-3 rounded-md px-2 hover:bg-slate-50">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={value.includes(o.id)}
                onChange={(e) => onChange(e.target.checked ? [...value, o.id] : value.filter((id) => id !== o.id))}
              />
              <span className="text-sm text-slate-800">{o.label}</span>
            </label>
          ))}
        </div>
      )}
    </fieldset>
  );
}
