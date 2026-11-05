/** Shared types and helpers for study resources (YouTube lectures and PDFs). */

export type ResourceKind = "lecture" | "notes" | "past_paper" | "worksheet" | "solution";
export type ResourceVisibility = "students" | "public";

export interface StudyResource {
  id: string;
  kind: ResourceKind;
  title: string;
  description: string | null;
  stage: string | null;
  board: string | null;
  group_code: string | null;
  subject: string | null;
  year: number | null;
  youtube_id: string | null;
  file_path: string | null;
  file_size: number | null;
  visibility: ResourceVisibility;
  is_published: boolean;
  uploaded_by: string | null;
  created_at: string;
}

export const RESOURCE_COLUMNS =
  "id, kind, title, description, stage, board, group_code, subject, year, youtube_id, file_path, file_size, visibility, is_published, uploaded_by, created_at";

export const KIND_LABELS: Record<ResourceKind, string> = {
  lecture: "Video lecture",
  notes: "Notes",
  past_paper: "Past paper",
  worksheet: "Worksheet",
  solution: "Solved paper",
};

export const FILE_KINDS: ResourceKind[] = ["notes", "past_paper", "worksheet", "solution"];

export const STORAGE_BUCKET = "study-resources";
export const MAX_PDF_BYTES = 25 * 1024 * 1024;

/** Extracts the 11-character id from any common YouTube link (or a bare id). */
export function parseYouTubeId(input: string): string | null {
  const s = input.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  let url: URL;
  try {
    url = new URL(s.startsWith("http") ? s : `https://${s}`);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www\.|m\.|music\.)/, "");
  let id: string | null = null;
  if (host === "youtu.be") id = url.pathname.slice(1).split("/")[0];
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") id = url.searchParams.get("v");
    else {
      const m = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/);
      id = m?.[1] ?? null;
    }
  }
  return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}

export const youtubeThumbnail = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const youtubeEmbedUrl = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
export const youtubeWatchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export function formatBytes(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** True when a resource is meant for a student's level / board / group (untagged fields match everything). */
export function matchesStudent(
  r: Pick<StudyResource, "stage" | "board" | "group_code">,
  p: { stage: string | null; board: string | null; group_code: string | null } | null
): boolean {
  if (!p) return true;
  return (
    (!r.stage || !p.stage || r.stage === p.stage) &&
    (!r.board || !p.board || r.board === p.board) &&
    (!r.group_code || !p.group_code || r.group_code === p.group_code)
  );
}
