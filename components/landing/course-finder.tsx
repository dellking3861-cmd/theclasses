"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { CurriculumSelect, EMPTY_CURRICULUM, type CurriculumValue } from "@/components/forms/curriculum-select";
import { getGroup, subjectsForGroup } from "@/lib/curriculum";

/** Hero widget: pick level, board and group, then see subjects or enquire. */
export function CourseFinder() {
  const [value, setValue] = useState<CurriculumValue>(EMPTY_CURRICULUM);
  const group = getGroup(value.board, value.stage, value.group);
  const subjects = group ? subjectsForGroup(value.board, value.stage, value.group).filter((s) => s.kind === "core") : [];
  const ready = Boolean(value.stage && value.board);

  const query = new URLSearchParams();
  if (value.stage) query.set("stage", value.stage);
  if (value.board) query.set("board", value.board);
  const enquiry = new URLSearchParams(query);
  if (value.group) enquiry.set("group", value.group);

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xl shadow-stone-900/5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-800">
          <Search className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">Find your course</h2>
          <p className="text-sm text-stone-500">Choose your level, board and group</p>
        </div>
      </div>

      <CurriculumSelect value={value} onChange={setValue} idPrefix="finder" className="sm:grid-cols-1" />

      <div className="mt-4 min-h-[3.25rem] rounded-xl bg-stone-50 px-4 py-3 text-sm text-stone-600" aria-live="polite">
        {group ? (
          <>
            <span className="font-medium text-ink">{group.name}:</span>{" "}
            {subjects.length ? subjects.map((s) => s.label).join(", ") : `choose ${group.electivesRequired} electives`}
          </>
        ) : ready ? (
          "Pick a group to see its main subjects."
        ) : (
          "We teach BSEK, BIEK, AKU-EB, FBISE, Cambridge and Edexcel."
        )}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Link
          href={ready ? `/courses?${query}` : "/courses"}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 text-sm font-semibold text-stone-800 hover:bg-stone-50"
        >
          View all subjects
        </Link>
        <Link
          href={ready ? `/admissions?${enquiry}` : "/admissions"}
          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-brand-500 text-sm font-semibold text-ink hover:bg-brand-400"
        >
          Enquire now <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
