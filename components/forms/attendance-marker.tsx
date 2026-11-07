"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { adminApi, ALL } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Status = "present" | "absent" | "late" | "excused";
const STATUSES: Status[] = ["present", "absent", "late", "excused"];

const selectClass =
  "flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent";

// Today in Karachi, as YYYY-MM-DD
const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Karachi" }).format(new Date());

/** Pick a course and a date, set each enrolled student's status, save. Re-saving a day updates it. */
export function AttendanceMarker() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
  const [courseId, setCourseId] = useState("");
  const [date, setDate] = useState(today);
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [marks, setMarks] = useState<Record<string, Status>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.getCourses(ALL).then((r) => setCourses(r.data || [])).catch(() => toast.error("Could not load courses"));
  }, []);

  useEffect(() => {
    if (!courseId || !date) return;
    let active = true;
    Promise.all([
      supabase.from("enrollments").select("student_id, student:students(user:users(full_name))").eq("course_id", courseId).eq("status", "active"),
      supabase.from("attendance").select("student_id, status").eq("course_id", courseId).eq("date", date),
    ]).then(([enr, att]) => {
      if (!active) return;
      setLoading(false);
      if (enr.error || att.error) return toast.error((enr.error ?? att.error)!.message);
      const list = (enr.data ?? []).map((e) => {
        const student = e.student as unknown as { user?: { full_name?: string } } | null;
        return { id: e.student_id as string, name: student?.user?.full_name || "Unnamed student" };
      });
      list.sort((a, b) => a.name.localeCompare(b.name));
      setStudents(list);
      const saved = Object.fromEntries((att.data ?? []).map((a) => [a.student_id, a.status as Status]));
      setMarks(Object.fromEntries(list.map((s) => [s.id, saved[s.id] ?? "present"])));
    });
    return () => {
      active = false;
    };
  }, [supabase, courseId, date]);

  async function save() {
    setSaving(true);
    const { data: auth } = await supabase.auth.getUser();
    const { error } = await supabase.from("attendance").upsert(
      students.map((s) => ({ student_id: s.id, course_id: courseId, date, status: marks[s.id], marked_by: auth.user?.id ?? null })),
      { onConflict: "student_id,course_id,date" }
    );
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(`Attendance saved for ${students.length} student${students.length === 1 ? "" : "s"}`);
    router.refresh();
  }

  return (
    <Card className="mb-6">
      <CardContent className="space-y-4 p-5 sm:p-6">
        <h2 className="font-semibold text-slate-900">Mark attendance</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            Course
            <select className={selectClass} value={courseId} onChange={(e) => { setCourseId(e.target.value); setLoading(Boolean(e.target.value)); }}>
              <option value="">Select course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            Date
            <input type="date" className={selectClass} value={date} max={today()} onChange={(e) => { setDate(e.target.value); setLoading(Boolean(courseId)); }} />
          </label>
        </div>

        {courseId && !loading && students.length === 0 && (
          <p className="text-sm text-slate-500">No students are enrolled in this course. Enrol them from the Students page (edit a student, tick the course).</p>
        )}

        {students.length > 0 && (
          <>
            <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
              {students.map((s) => (
                <li key={s.id} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm font-medium text-slate-900">{s.name}</span>
                  <div className="flex flex-wrap gap-1" role="radiogroup" aria-label={`Attendance for ${s.name}`}>
                    {STATUSES.map((st) => (
                      <button
                        key={st}
                        type="button"
                        role="radio"
                        aria-checked={marks[s.id] === st}
                        onClick={() => setMarks({ ...marks, [s.id]: st })}
                        className={`min-h-9 rounded-lg border px-3 text-sm capitalize ${marks[s.id] === st ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
            <Button onClick={save} isLoading={saving}>Save attendance</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
