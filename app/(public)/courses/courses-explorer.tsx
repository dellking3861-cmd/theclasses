"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PROGRAM_LABELS } from "@/lib/constants";
import {
  STAGES,
  STAGE_CODES,
  boardsForStage,
  getOffering,
  stagesForBoard,
  subjectLabel,
  type CurriculumGroup,
  type GroupCode,
  type Stage,
} from "@/lib/curriculum";
import { ArrowRight, Microscope, Monitor, Palette, Clock, Info } from "lucide-react";

type Tab = Stage | "programs";

const GROUP_ICON: Record<GroupCode, typeof Microscope> = { bio: Microscope, comp: Monitor, arts: Palette };
const GROUP_ACCENT: Record<GroupCode, string> = {
  bio: "bg-emerald-50 text-emerald-700",
  comp: "bg-sky-50 text-sky-700",
  arts: "bg-rose-50 text-rose-700",
};

const programs = [
  { program: "web_basics", duration: 6, description: "Learn HTML, CSS, JavaScript and computational thinking from scratch." },
  { program: "school_classes", duration: 12, description: "Structured academic support for young learners across all subjects with AI tools." },
  { program: "entry_test_preparation", duration: 4, description: "Intensive preparation for medical and engineering university entry tests." },
];

// Old links used the retired board codes
const LEGACY_BOARD: Record<string, { board: string; stage: Stage }> = {
  sindh_board: { board: "bsek", stage: "secondary" },
  cambridge_o: { board: "cambridge", stage: "secondary" },
  cambridge_a: { board: "cambridge", stage: "higher_secondary" },
};

function SubjectPill({ code, highlight }: { code: string; highlight?: boolean }) {
  return (
    <li
      className={`rounded-full border px-3 py-1 text-sm ${
        highlight ? "border-amber-400 bg-amber-50 text-amber-800 font-medium" : "border-stone-200 bg-white text-stone-700"
      }`}
    >
      {subjectLabel(code)}
    </li>
  );
}

function GroupCard({ group, board, stage, highlight }: { group: CurriculumGroup; board: string; stage: Stage; highlight?: string }) {
  const Icon = GROUP_ICON[group.code];
  return (
    <Card className="border-stone-100 bg-white flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className={`rounded-xl p-2.5 ${GROUP_ACCENT[group.code]}`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <CardTitle className="font-display text-stone-900 text-lg">{group.name}</CardTitle>
        </div>
        {group.note && <CardDescription className="text-stone-500 mt-2">{group.note}</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        {group.core.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">Group subjects</p>
            <ul className="flex flex-wrap gap-2">
              {group.core.map((c) => <SubjectPill key={c} code={c} highlight={c === highlight} />)}
            </ul>
          </div>
        )}
        {group.electives && group.electives.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
              Electives{group.electivesRequired ? ` · choose ${group.electivesRequired}` : ""}
            </p>
            <ul className="flex flex-wrap gap-2">
              {group.electives.map((c) => <SubjectPill key={c} code={c} highlight={c === highlight} />)}
            </ul>
          </div>
        )}
        <Link
          href={`/admissions?stage=${stage}&board=${board}&group=${group.code}`}
          className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-stone-200 px-4 text-sm font-medium text-stone-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition-colors"
        >
          Enquire about this group <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </CardContent>
    </Card>
  );
}

export interface CoursesQuery {
  stage?: string;
  board?: string;
  subject?: string;
}

/**
 * Receives the URL query from the server page (not useSearchParams) so the
 * curriculum is rendered into the HTML for search engines. Navigation uses
 * router.replace, which re-renders the server page with the new query.
 */
export function CoursesExplorer({ query }: { query: CoursesQuery }) {
  const router = useRouter();

  // Resolve tab/board from the URL (supports old ?board=cambridge_o links)
  const rawBoard = query.board ?? "";
  const legacy = LEGACY_BOARD[rawBoard];
  const rawStage = query.stage ?? legacy?.stage ?? "";
  const tab: Tab = rawStage === "programs" ? "programs" : STAGE_CODES.includes(rawStage as Stage) ? (rawStage as Stage) : (stagesForBoard(legacy?.board ?? rawBoard)[0] ?? "secondary");
  const stage: Stage = tab === "programs" ? "secondary" : tab;
  const boards = boardsForStage(stage);
  const requestedBoard = legacy?.board ?? rawBoard;
  const board = boards.some((b) => b.code === requestedBoard) ? requestedBoard : boards[0].code;
  const offering = getOffering(board, stage);
  const highlight = query.subject || undefined;

  function go(next: { stage?: Tab; board?: string }) {
    const sp = new URLSearchParams();
    const s = next.stage ?? tab;
    sp.set("stage", s);
    if (s !== "programs" && next.board) sp.set("board", next.board);
    router.replace(`/courses?${sp.toString()}`, { scroll: false });
  }

  const tabs: { value: Tab; label: string; sub: string }[] = [
    ...STAGE_CODES.map((s) => ({ value: s as Tab, label: STAGES[s].label, sub: STAGES[s].grades })),
    { value: "programs", label: "Special Programs", sub: "Skills & test prep" },
  ];

  return (
    <section className="py-12 sm:py-16 bg-stone-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 font-display">Our Courses</h1>
          <p className="mt-3 text-base sm:text-lg text-stone-500">
            Matric, O Level and IGCSE for Grades 9–10; Intermediate and A Level for Grades 11–12. Biology, Computer and Arts groups for every board.
          </p>
        </div>

        {/* Level tabs */}
        <div role="tablist" aria-label="Level" className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
          {tabs.map((t) => (
            <button
              key={t.value}
              role="tab"
              aria-selected={tab === t.value}
              onClick={() => go({ stage: t.value })}
              className={`min-h-14 rounded-xl px-4 py-3 text-left transition-colors border ${
                tab === t.value ? "bg-amber-600 border-amber-600 text-white" : "bg-white border-stone-200 text-stone-700 hover:bg-stone-100"
              }`}
            >
              <span className="block font-semibold">{t.label}</span>
              <span className={`block text-xs ${tab === t.value ? "text-amber-100" : "text-stone-400"}`}>{t.sub}</span>
            </button>
          ))}
        </div>

        {tab === "programs" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((p) => (
              <Card key={p.program} className="border-stone-100 bg-white">
                <CardHeader>
                  <Badge variant="success">Program</Badge>
                  <CardTitle className="mt-3 font-display text-stone-900">{PROGRAM_LABELS[p.program]}</CardTitle>
                  <CardDescription className="text-stone-500">{p.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="flex items-center gap-1 text-sm text-stone-400 mb-4"><Clock className="h-4 w-4" aria-hidden="true" /> {p.duration} months</p>
                  <Link href="/admissions" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-stone-200 px-4 text-sm font-medium text-stone-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700">
                    Enquire <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Board chips */}
            <div role="tablist" aria-label="Board" className="flex flex-wrap gap-2 mb-8">
              {boards.map((b) => (
                <button
                  key={b.code}
                  role="tab"
                  aria-selected={board === b.code}
                  onClick={() => go({ stage, board: b.code })}
                  className={`min-h-11 rounded-full px-4 text-sm font-medium border transition-colors ${
                    board === b.code ? "bg-stone-900 border-stone-900 text-white" : "bg-white border-stone-200 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  {b.shortName} <span className={board === b.code ? "text-stone-300" : "text-stone-400"}>· {getOffering(b.code, stage)?.label}</span>
                </button>
              ))}
            </div>

            {offering && (
              <>
                <div className="mb-6 rounded-2xl border border-stone-100 bg-white p-5 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
                    {boards.find((b) => b.code === board)?.name} — {offering.label}
                  </h2>
                  <p className="text-sm text-stone-500 mt-1">{STAGES[stage].grades}</p>
                  {offering.compulsory.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">Compulsory for every group</p>
                      <ul className="flex flex-wrap gap-2">
                        {offering.compulsory.map((c) => <SubjectPill key={c} code={c} highlight={c === highlight} />)}
                      </ul>
                    </div>
                  )}
                  {offering.note && (
                    <p className="mt-4 flex gap-2 text-sm text-stone-500">
                      <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" aria-hidden="true" /> {offering.note}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {offering.groups.map((g) => (
                    <GroupCard key={g.code} group={g} board={board} stage={stage} highlight={highlight} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
