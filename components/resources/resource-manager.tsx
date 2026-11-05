"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { PageHeader, Badge, EmptyState, LoadingSpinner } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { CurriculumSelect, EMPTY_CURRICULUM, type CurriculumValue } from "@/components/forms/curriculum-select";
import { BOARDS, describeSelection, subjectLabel } from "@/lib/curriculum";
import {
  FILE_KINDS,
  KIND_LABELS,
  MAX_PDF_BYTES,
  RESOURCE_COLUMNS,
  STORAGE_BUCKET,
  formatBytes,
  parseYouTubeId,
  youtubeThumbnail,
  youtubeWatchUrl,
  type ResourceKind,
  type ResourceVisibility,
  type StudyResource,
} from "@/lib/study-resources";
import { Eye, EyeOff, FileText, Globe, Lock, Pencil, Plus, Search, Trash2, Upload, Video } from "lucide-react";

type Tab = "lecture" | "files";

interface FormState {
  id: string | null;
  kind: ResourceKind;
  title: string;
  description: string;
  curriculum: CurriculumValue;
  year: string;
  youtubeUrl: string;
  file: File | null;
  visibility: ResourceVisibility;
  is_published: boolean;
}

const blankForm = (kind: ResourceKind): FormState => ({
  id: null,
  kind,
  title: "",
  description: "",
  curriculum: EMPTY_CURRICULUM,
  year: "",
  youtubeUrl: "",
  file: null,
  visibility: "students",
  is_published: true,
});

const selectClass =
  "flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent";

export function ResourceManager({
  role,
  userId,
  initialTab = "lecture",
}: {
  role: "admin" | "teacher";
  userId: string;
  initialTab?: Tab;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState<StudyResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [boardFilter, setBoardFilter] = useState("");
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [videoCheck, setVideoCheck] = useState<{ state: "idle" | "checking" | "ok" | "error"; message?: string }>({ state: "idle" });

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("study_resources").select(RESOURCE_COLUMNS).order("created_at", { ascending: false }).limit(500);
    if (error) toast.error(error.message);
    setItems((data ?? []) as StudyResource[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    let active = true;
    supabase
      .from("study_resources")
      .select(RESOURCE_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(500)
      .then(({ data, error }) => {
        if (!active) return;
        if (error) toast.error(error.message);
        setItems((data ?? []) as StudyResource[]);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [supabase]);

  const visible = items.filter((r) => {
    if (tab === "lecture" ? r.kind !== "lecture" : r.kind === "lecture") return false;
    if (boardFilter && r.board !== boardFilter) return false;
    if (query && !`${r.title} ${subjectLabel(r.subject)}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const canEdit = (r: StudyResource) => role === "admin" || r.uploaded_by === userId;

  function openNew() {
    setVideoCheck({ state: "idle" });
    setForm(blankForm(tab === "lecture" ? "lecture" : "notes"));
  }

  function openEdit(r: StudyResource) {
    setVideoCheck({ state: r.youtube_id ? "ok" : "idle" });
    setForm({
      id: r.id,
      kind: r.kind,
      title: r.title,
      description: r.description ?? "",
      curriculum: { stage: r.stage ?? "", board: r.board ?? "", group: r.group_code ?? "", subject: r.subject ?? "" },
      year: r.year ? String(r.year) : "",
      youtubeUrl: r.youtube_id ? youtubeWatchUrl(r.youtube_id) : "",
      file: null,
      visibility: r.visibility,
      is_published: r.is_published,
    });
  }

  async function checkVideo(url: string) {
    if (!url.trim()) return setVideoCheck({ state: "idle" });
    if (!parseYouTubeId(url)) return setVideoCheck({ state: "error", message: "That doesn't look like a YouTube link." });
    setVideoCheck({ state: "checking" });
    try {
      const res = await fetch(`/api/youtube/oembed?url=${encodeURIComponent(url)}`);
      const json = await res.json();
      if (!res.ok) return setVideoCheck({ state: "error", message: json.error });
      setVideoCheck({ state: "ok", message: json.channel ? `From ${json.channel}` : undefined });
      // Fill the title from YouTube if the teacher hasn't typed one
      setForm((f) => (f && !f.title.trim() && json.title ? { ...f, title: String(json.title).slice(0, 200) } : f));
    } catch {
      setVideoCheck({ state: "ok" });
    }
  }

  async function save() {
    if (!form) return;
    const isLecture = form.kind === "lecture";
    const youtubeId = isLecture ? parseYouTubeId(form.youtubeUrl) : null;
    if (isLecture && !youtubeId) return toast.error("Paste a valid YouTube link.");
    if (!isLecture && !form.id && !form.file) return toast.error("Choose a PDF to upload.");
    if (form.file && form.file.type !== "application/pdf") return toast.error("Only PDF files can be uploaded.");
    if (form.file && form.file.size > MAX_PDF_BYTES) return toast.error("PDFs must be 25 MB or smaller.");
    const title = form.title.trim() || form.file?.name.replace(/\.pdf$/i, "") || "";
    if (!title) return toast.error("Add a title.");
    const year = form.year ? Number(form.year) : null;
    if (year !== null && (!Number.isInteger(year) || year < 1990 || year > 2100)) return toast.error("Enter a valid year.");

    const c = form.curriculum;
    const fields = {
      kind: form.kind,
      title: title.slice(0, 200),
      description: form.description.trim() || null,
      stage: c.stage || null,
      board: c.board || null,
      group_code: c.board && c.stage ? c.group || null : null,
      subject: c.subject || null,
      year,
      visibility: form.visibility,
      is_published: form.is_published,
    };

    setSaving(true);
    let uploadedPath: string | null = null;
    try {
      if (form.file) {
        uploadedPath = `${userId}/${crypto.randomUUID()}.pdf`;
        const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(uploadedPath, form.file, {
          contentType: "application/pdf",
          cacheControl: "3600",
        });
        if (error) throw new Error(`Upload failed: ${error.message}`);
      }

      if (form.id) {
        const old = items.find((i) => i.id === form.id);
        const patch = {
          ...fields,
          ...(isLecture ? { youtube_id: youtubeId } : {}),
          ...(uploadedPath ? { file_path: uploadedPath, file_size: form.file!.size } : {}),
        };
        const { error, count } = await supabase.from("study_resources").update(patch, { count: "exact" }).eq("id", form.id);
        if (error) throw new Error(error.message);
        if (!count) throw new Error("You can only edit items you uploaded.");
        // Replaced the PDF: remove the old file
        if (uploadedPath && old?.file_path) await supabase.storage.from(STORAGE_BUCKET).remove([old.file_path]);
        toast.success("Saved");
      } else {
        const { error } = await supabase.from("study_resources").insert({
          ...fields,
          youtube_id: youtubeId,
          file_path: uploadedPath,
          file_size: form.file?.size ?? null,
          uploaded_by: userId,
        });
        if (error) throw new Error(error.message);
        toast.success(isLecture ? "Lecture added" : "PDF uploaded");
      }
      uploadedPath = null;
      setForm(null);
      await load();
    } catch (err) {
      // Don't leave an orphaned file behind if saving the details failed
      if (uploadedPath) await supabase.storage.from(STORAGE_BUCKET).remove([uploadedPath]);
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(r: StudyResource) {
    const { error } = await supabase.from("study_resources").update({ is_published: !r.is_published }).eq("id", r.id);
    if (error) return toast.error(error.message);
    setItems((list) => list.map((i) => (i.id === r.id ? { ...i, is_published: !r.is_published } : i)));
  }

  async function remove(r: StudyResource) {
    if (!window.confirm(`Delete "${r.title}"? Students will no longer see it.`)) return;
    const { error } = await supabase.from("study_resources").delete().eq("id", r.id);
    if (error) return toast.error(error.message);
    if (r.file_path) await supabase.storage.from(STORAGE_BUCKET).remove([r.file_path]);
    setItems((list) => list.filter((i) => i.id !== r.id));
    toast.success("Deleted");
  }

  async function openFile(r: StudyResource) {
    if (!r.file_path) return;
    const win = window.open("", "_blank");
    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).createSignedUrl(r.file_path, 600);
    if (error || !data) {
      win?.close();
      return toast.error(error?.message ?? "Could not open file");
    }
    if (win) win.location.assign(data.signedUrl);
    else window.location.assign(data.signedUrl);
  }

  const lectureCount = items.filter((i) => i.kind === "lecture").length;
  const fileCount = items.length - lectureCount;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Study Materials"
        description="Add YouTube lectures and upload PDF notes and past papers, tagged by level, board and subject."
        action={
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" aria-hidden="true" /> {tab === "lecture" ? "Add lecture" : "Upload PDF"}
          </Button>
        }
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1" role="tablist">
          {([
            ["lecture", `Video lectures (${lectureCount})`, Video],
            ["files", `PDFs (${fileCount})`, FileText],
          ] as const).map(([value, label, Icon]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              onClick={() => setTab(value)}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${tab === value ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" /> {label}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative block">
            <span className="sr-only">Search</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title or subject" className={`${selectClass} pl-9 sm:w-64`} />
          </label>
          <select aria-label="Filter by board" value={boardFilter} onChange={(e) => setBoardFilter(e.target.value)} className={`${selectClass} sm:w-48`}>
            <option value="">All boards</option>
            {BOARDS.map((b) => (
              <option key={b.code} value={b.code}>{b.shortName}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner /></div>
      ) : visible.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={tab === "lecture" ? Video : Upload}
              title={tab === "lecture" ? "No lectures yet" : "No PDFs yet"}
              description={tab === "lecture" ? "Paste a YouTube link to add a recorded lecture." : "Upload notes, past papers or worksheets as PDF."}
              action={<Button onClick={openNew}><Plus className="h-4 w-4" aria-hidden="true" /> {tab === "lecture" ? "Add lecture" : "Upload PDF"}</Button>}
            />
          </CardContent>
        </Card>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((r) => (
            <li key={r.id}>
              <Card className="flex h-full flex-col overflow-hidden">
                {r.youtube_id ? (
                  <a href={youtubeWatchUrl(r.youtube_id)} target="_blank" rel="noopener noreferrer" className="block aspect-video bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={youtubeThumbnail(r.youtube_id)} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </a>
                ) : null}
                <CardContent className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="info">{KIND_LABELS[r.kind]}</Badge>
                    {!r.is_published && <Badge variant="warning">Hidden</Badge>}
                    {r.visibility === "public" ? (
                      <Badge variant="success"><Globe className="mr-1 h-3 w-3" aria-hidden="true" />Public</Badge>
                    ) : (
                      <Badge><Lock className="mr-1 h-3 w-3" aria-hidden="true" />Students</Badge>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{r.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {[describeSelection(r.board, r.stage, r.group_code) || "All levels", r.subject && subjectLabel(r.subject), r.year, formatBytes(r.file_size)]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {r.file_path && (
                      <Button variant="outline" size="sm" onClick={() => openFile(r)}>
                        <FileText className="h-4 w-4" aria-hidden="true" /> Open
                      </Button>
                    )}
                    {canEdit(r) && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => openEdit(r)} aria-label={`Edit ${r.title}`}>
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => togglePublished(r)} aria-label={r.is_published ? "Hide from students" : "Show to students"} title={r.is_published ? "Hide from students" : "Show to students"}>
                          {r.is_published ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => remove(r)} aria-label={`Delete ${r.title}`} className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {form && (
        <Dialog
          open
          onOpenChange={(o) => !o && !saving && setForm(null)}
          title={form.id ? "Edit study material" : form.kind === "lecture" ? "Add a YouTube lecture" : "Upload a PDF"}
          description={form.kind === "lecture" ? "The video stays on YouTube; students watch it inside the portal." : "PDFs up to 25 MB."}
          className="max-w-2xl"
        >
          <div className="space-y-5">
            {!form.id && (
              <div className="space-y-1.5">
                <label htmlFor="res-kind" className="block text-sm font-medium text-slate-700">Type</label>
                <select
                  id="res-kind"
                  className={selectClass}
                  value={form.kind}
                  onChange={(e) => setForm({ ...form, kind: e.target.value as ResourceKind, file: null, youtubeUrl: "" })}
                >
                  <option value="lecture">{KIND_LABELS.lecture} (YouTube link)</option>
                  {FILE_KINDS.map((k) => (
                    <option key={k} value={k}>{KIND_LABELS[k]} (PDF)</option>
                  ))}
                </select>
              </div>
            )}

            {form.kind === "lecture" ? (
              <div className="space-y-2">
                <Input
                  id="res-youtube"
                  label="YouTube link *"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={form.youtubeUrl}
                  onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                  onBlur={(e) => checkVideo(e.target.value)}
                  hint="Public or Unlisted videos work. Private videos can't be played."
                />
                {videoCheck.state === "checking" && <p className="text-sm text-slate-500">Checking video…</p>}
                {videoCheck.state === "error" && <p className="text-sm text-red-600">{videoCheck.message}</p>}
                {parseYouTubeId(form.youtubeUrl) && videoCheck.state !== "error" && (
                  <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={youtubeThumbnail(parseYouTubeId(form.youtubeUrl)!)} alt="" className="h-14 w-24 rounded object-cover" />
                    <span className="text-sm text-slate-600">{videoCheck.message ?? "YouTube video"}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                <label htmlFor="res-file" className="block text-sm font-medium text-slate-700">
                  PDF file {form.id ? "(leave empty to keep the current file)" : "*"}
                </label>
                <input
                  id="res-file"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(e) => setForm({ ...form, file: e.target.files?.[0] ?? null })}
                  className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:bg-slate-700"
                />
                {form.file && (
                  <p className={`text-xs ${form.file.size > MAX_PDF_BYTES ? "text-red-600" : "text-slate-500"}`}>
                    {form.file.name} · {formatBytes(form.file.size)}
                  </p>
                )}
              </div>
            )}

            <Input
              id="res-title"
              label="Title"
              placeholder={form.kind === "lecture" ? "Filled in from YouTube" : "e.g. Chapter 3: Quadratic Equations"}
              value={form.title}
              maxLength={200}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">Who is it for?</p>
              <CurriculumSelect
                idPrefix="res"
                showSubject
                value={form.curriculum}
                onChange={(curriculum) => setForm({ ...form, curriculum })}
              />
              <p className="mt-2 text-xs text-slate-500">Leave blank to show it to every level and board.</p>
            </div>

            {form.kind !== "lecture" && (
              <Input
                id="res-year"
                label={form.kind === "past_paper" || form.kind === "solution" ? "Exam year" : "Year (optional)"}
                inputMode="numeric"
                placeholder="e.g. 2024"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value.replace(/\D/g, "").slice(0, 4) })}
              />
            )}

            <Textarea
              id="res-description"
              label="Description (optional)"
              rows={3}
              maxLength={2000}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-slate-700">Visibility</legend>
              {([
                ["students", "Students only", "Only signed-in students, parents and staff can see it."],
                ["public", "Public", "Anyone can see it, including on the public website later. Good for free resources."],
              ] as const).map(([value, label, help]) => (
                <label key={value} className={`flex cursor-pointer gap-3 rounded-lg border p-3 ${form.visibility === value ? "border-brand-500 bg-brand-50" : "border-slate-200"}`}>
                  <input type="radio" name="res-visibility" className="mt-1" checked={form.visibility === value} onChange={() => setForm({ ...form, visibility: value })} />
                  <span>
                    <span className="block text-sm font-medium text-slate-800">{label}</span>
                    <span className="block text-xs text-slate-500">{help}</span>
                  </span>
                </label>
              ))}
            </fieldset>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
              Show to students now (untick to save as hidden)
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setForm(null)} disabled={saving}>Cancel</Button>
            <Button onClick={save} isLoading={saving}>{form.id ? "Save changes" : form.kind === "lecture" ? "Add lecture" : "Upload"}</Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
}
