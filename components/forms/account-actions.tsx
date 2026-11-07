"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/** Deactivate/reactivate and delete for a student, teacher or parent account. */
export function AccountActions({ kind, id, name, active }: { kind: "students" | "teachers" | "parents"; id: string; name: string; active: boolean }) {
  const [busy, setBusy] = useState<"status" | "delete" | null>(null);

  async function call(method: "PATCH" | "DELETE", body?: object) {
    const res = await fetch(`/api/admin/${kind}/${id}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "Something went wrong");
  }

  async function toggle() {
    const msg = active
      ? `Deactivate ${name}? They won't be able to sign in. Their records are kept and you can reactivate them later.`
      : `Reactivate ${name}? They will be able to sign in again.`;
    if (!window.confirm(msg)) return;
    setBusy("status");
    try {
      await call("PATCH", { is_active: !active });
      toast.success(active ? `${name} deactivated` : `${name} reactivated`);
      window.location.reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update");
      setBusy(null);
    }
  }

  async function remove() {
    if (!window.confirm(`Permanently delete ${name}? This removes their login and ALL their records (attendance, fees, results, links). This cannot be undone.\n\nTo keep their history, use Deactivate instead.`)) return;
    setBusy("delete");
    try {
      await call("DELETE");
      toast.success(`${name} deleted`);
      window.location.reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete");
      setBusy(null);
    }
  }

  return (
    <span className="inline-flex flex-wrap gap-2">
      <Button type="button" variant="outline" size="sm" onClick={toggle} isLoading={busy === "status"} disabled={busy !== null}>
        {active ? "Deactivate" : "Reactivate"}
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={remove} isLoading={busy === "delete"} disabled={busy !== null} className="text-red-600 hover:text-red-700">
        Delete
      </Button>
    </span>
  );
}
