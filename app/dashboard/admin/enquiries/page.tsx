"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader, Badge, EmptyState, LoadingSpinner } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/utils/format";
import { Inbox, Mail, Phone, MessageCircle } from "lucide-react";

type Status = "new" | "contacted" | "enrolled" | "closed";

interface Enquiry {
  id: string;
  kind: "contact" | "admission";
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  board: string | null;
  grade: string | null;
  status: Status;
  created_at: string;
}

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "enrolled", label: "Enrolled" },
  { value: "closed", label: "Closed" },
];

const STATUS_VARIANT: Record<Status, "info" | "warning" | "success" | "default"> = {
  new: "info",
  contacted: "warning",
  enrolled: "success",
  closed: "default",
};

function whatsappLink(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `92${digits.slice(1)}`;
  return `https://wa.me/${digits}`;
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [filter, setFilter] = useState<Status | "">("new");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/enquiries${filter ? `?status=${filter}` : ""}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load enquiries");
        if (!cancelled) setEnquiries(json.data);
      })
      .catch((err: unknown) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : "Failed to load enquiries");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filter]);

  function changeFilter(next: Status | "") {
    if (next === filter) return;
    setIsLoading(true);
    setLoadError(null);
    setFilter(next);
  }

  async function updateStatus(id: string, status: Status) {
    const previous = enquiries;
    setEnquiries((list) => list.map((e) => (e.id === id ? { ...e, status } : e)));
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Update failed");
      }
      toast.success(`Marked as ${status}`);
      if (filter && filter !== status) {
        setEnquiries((list) => list.filter((e) => e.id !== id));
      }
    } catch (err) {
      setEnquiries(previous);
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enquiries"
        description="Messages from the Contact and Admission forms on the website."
      />

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
        {[{ value: "" as const, label: "All" }, ...STATUS_OPTIONS].map((opt) => (
          <button
            key={opt.value || "all"}
            role="tab"
            aria-selected={filter === opt.value}
            onClick={() => changeFilter(opt.value)}
            className={`min-h-11 rounded-full px-4 text-sm font-medium transition-colors ${
              filter === opt.value
                ? "bg-yellow-500 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-yellow-50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><LoadingSpinner /></div>
      ) : loadError ? (
        <Card><CardContent className="py-8 text-center text-sm text-red-600">{loadError}</CardContent></Card>
      ) : enquiries.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={Inbox}
              title="No enquiries here"
              description={filter ? `Nothing with status “${filter}”.` : "New messages from the website will appear here."}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {enquiries.map((e) => (
            <Card key={e.id}>
              <CardContent className="p-4 sm:p-6 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900 break-words">{e.name}</h3>
                      <Badge variant={e.kind === "admission" ? "success" : "default"}>
                        {e.kind === "admission" ? "Admission" : "Contact"}
                      </Badge>
                      <Badge variant={STATUS_VARIANT[e.status]}>{e.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{formatDateTime(e.created_at)}</p>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="sr-only sm:not-sr-only">Status</span>
                    <select
                      value={e.status}
                      onChange={(ev) => updateStatus(e.id, ev.target.value as Status)}
                      className="min-h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm"
                    >
                      {STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </label>
                </div>

                {(e.subject || e.grade || e.board) && (
                  <p className="text-sm text-slate-700">
                    {[e.subject, e.grade && `Grade: ${e.grade}`, e.board && `Board: ${e.board}`].filter(Boolean).join(" · ")}
                  </p>
                )}
                {e.message && <p className="text-sm text-slate-600 whitespace-pre-wrap break-words">{e.message}</p>}

                <div className="flex flex-wrap gap-2 pt-1">
                  <a href={`mailto:${e.email}`} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 hover:bg-yellow-50 break-all">
                    <Mail className="h-4 w-4 shrink-0" /> {e.email}
                  </a>
                  {e.phone && (
                    <>
                      <a href={`tel:${e.phone}`} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 hover:bg-yellow-50">
                        <Phone className="h-4 w-4 shrink-0" /> {e.phone}
                      </a>
                      <a href={whatsappLink(e.phone)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-emerald-200 px-3 text-sm text-emerald-700 hover:bg-emerald-50">
                        <MessageCircle className="h-4 w-4 shrink-0" /> WhatsApp
                      </a>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
