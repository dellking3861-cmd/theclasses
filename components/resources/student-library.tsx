"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { PageHeader, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { describeSelection, subjectLabel } from "@/lib/curriculum";
import {
  FILE_KINDS,
  KIND_LABELS,
  STORAGE_BUCKET,
  formatBytes,
  matchesStudent,
  youtubeEmbedUrl,
  youtubeThumbnail,
  youtubeWatchUrl,
  type ResourceKind,
  type StudyResource,
} from "@/lib/study-resources";
import { Download, ExternalLink, FileText, PlayCircle, Search, Video } from "lucide-react";

export interface StudentProfile {
  stage: string | null;
  board: string | null;
  group_code: string | null;
}

const selectClass =
  "flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent";

function safeFileName(title: string) {
  return `${title.replace(/[^\w\s.-]/g, "").trim().replace(/\s+/g, "-").slice(0, 80) || "document"}.pdf`;
}

export function StudentLibrary({
  mode,
  items,
  profile,
}: {
  mode: "lectures" | "files";
  items: StudyResource[];
  profile: StudentProfile | null;
}) {
  const supabase = useMemo(() => createClient(), []);
  const hasClass = Boolean(profile?.board || profile?.stage);
  const [scope, setScope] = useState<"mine" | "all">(hasClass ? "mine" : "all");
  const [subject, setSubject] = useState("");
  const [kind, setKind] = useState<ResourceKind | "">("");
  const [query, setQuery] = useState("");
  const [playing, setPlaying] = useState<StudyResource | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const inScope = items.filter((r) => scope === "all" || matchesStudent(r, profile));
  const subjects = Array.from(new Set(inScope.map((r) => r.subject).filter((s): s is string => Boolean(s)))).sort((a, b) =>
    subjectLabel(a).localeCompare(subjectLabel(b))
  );
  const shown = inScope.filter(
    (r) =>
      (!subject || r.subject === subject) &&
      (!kind || r.kind === kind) &&
      (!query || `${r.title} ${r.description ?? ""}`.toLowerCase().includes(query.toLowerCase()))
  );

  async function openPdf(r: StudyResource, download: boolean) {
    if (!r.file_path) return;
    setBusy(r.id);
    // Open the tab synchronously so pop-up blockers allow it
    const win = download ? null : window.open("", "_blank");
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(r.file_path, 600, download ? { download: safeFileName(r.title) } : undefined);
    setBusy(null);
    if (error || !data) {
      win?.close();
      toast.error("Could not open this file. Please try again.");
      return;
    }
    if (win) win.location.assign(data.signedUrl);
    else window.location.assign(data.signedUrl);
  }

  const classLabel = profile ? describeSelection(profile.board, profile.stage, profile.group_code) : "";

  return (
    <div className="space-y-6">
      <PageHeader
        title={mode === "lectures" ? "Recorded Lectures" : "Notes & Past Papers"}
        description={
          mode === "lectures"
            ? "Watch recorded lectures for your class, any time."
            : "Read or download notes, past papers and worksheets for your class."
        }
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {hasClass ? (
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
            {([
              ["mine", classLabel ? `My class: ${classLabel}` : "My class"],
              ["all", "Everything"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={scope === value}
                onClick={() => {
                  setScope(value);
                  setSubject("");
                }}
                className={`rounded-lg px-3 py-2 text-left text-sm font-medium ${scope === value ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}
              >
                {label}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Showing everything. Ask the office to set your board and class to see only yours.</p>
        )}
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative block">
            <span className="sr-only">Search</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className={`${selectClass} pl-9 sm:w-56`} />
          </label>
          <select aria-label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} className={`${selectClass} sm:w-48`}>
            <option value="">All subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>{subjectLabel(s)}</option>
            ))}
          </select>
          {mode === "files" && (
            <select aria-label="Type" value={kind} onChange={(e) => setKind(e.target.value as ResourceKind | "")} className={`${selectClass} sm:w-44`}>
              <option value="">All types</option>
              {FILE_KINDS.map((k) => (
                <option key={k} value={k}>{KIND_LABELS[k]}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {shown.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={mode === "lectures" ? Video : FileText}
              title={mode === "lectures" ? "No lectures yet" : "Nothing here yet"}
              description={
                scope === "mine" && items.length > inScope.length
                  ? "Nothing for your class yet. Switch to Everything to see all materials."
                  : "Your teachers will add materials here soon."
              }
            />
          </CardContent>
        </Card>
      ) : mode === "lectures" ? (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => setPlaying(r)}
                className="group block w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <span className="relative block aspect-video bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={youtubeThumbnail(r.youtube_id!)} alt="" loading="lazy" className="h-full w-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/25">
                    <PlayCircle className="h-14 w-14 text-white drop-shadow-lg" aria-hidden="true" />
                  </span>
                </span>
                <span className="block p-4">
                  <span className="block font-medium text-slate-900">{r.title}</span>
                  <span className="mt-1 block text-sm text-slate-500">
                    {[r.subject && subjectLabel(r.subject), describeSelection(r.board, r.stage, r.group_code)].filter(Boolean).join(" · ") || "All classes"}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <ul className="divide-y divide-slate-100">
            {shown.map((r) => (
              <li key={r.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                    <FileText className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900">{r.title}</p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {[KIND_LABELS[r.kind], r.subject && subjectLabel(r.subject), r.year, describeSelection(r.board, r.stage, r.group_code), formatBytes(r.file_size)]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    {r.description && <p className="mt-1 line-clamp-2 text-sm text-slate-600">{r.description}</p>}
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="outline" size="sm" onClick={() => openPdf(r, false)} disabled={busy === r.id}>
                    <ExternalLink className="h-4 w-4" aria-hidden="true" /> View
                  </Button>
                  <Button size="sm" onClick={() => openPdf(r, true)} disabled={busy === r.id}>
                    <Download className="h-4 w-4" aria-hidden="true" /> Download
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {playing?.youtube_id && (
        <Dialog open onOpenChange={(o) => !o && setPlaying(null)} title={playing.title} className="max-w-4xl">
          <div className="space-y-4">
            <div className="-mx-1 aspect-video overflow-hidden rounded-xl bg-black">
              <iframe
                src={`${youtubeEmbedUrl(playing.youtube_id)}&autoplay=1`}
                title={playing.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            {playing.description && <p className="whitespace-pre-line text-sm text-slate-600">{playing.description}</p>}
            <a
              href={youtubeWatchUrl(playing.youtube_id)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:underline"
            >
              Watch on YouTube <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </Dialog>
      )}
    </div>
  );
}
