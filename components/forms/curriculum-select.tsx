"use client";

import { cn } from "@/utils/cn";
import {
  STAGES,
  STAGE_CODES,
  boardsForStage,
  getOffering,
  stagesForBoard,
  subjectsForGroup,
  subjectsForOffering,
  type Stage,
} from "@/lib/curriculum";

export interface CurriculumValue {
  stage: string;
  board: string;
  group: string;
  subject: string;
}

export const EMPTY_CURRICULUM: CurriculumValue = { stage: "", board: "", group: "", subject: "" };

interface CurriculumSelectProps {
  value: CurriculumValue;
  onChange: (value: CurriculumValue) => void;
  /** Show the Subject picker (courses need one; students/enquiries don't have to). */
  showSubject?: boolean;
  subjectLabel?: string;
  /** Mark level + board as required in the labels. */
  required?: boolean;
  errors?: Partial<Record<keyof CurriculumValue, string>>;
  idPrefix?: string;
  className?: string;
}

const selectClass =
  "flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

/**
 * Cascading Level → Board → Group → Subject picker driven by lib/curriculum.ts.
 * Changing a parent clears children that are no longer valid.
 */
export function CurriculumSelect({
  value,
  onChange,
  showSubject = false,
  subjectLabel = "Subject",
  required = false,
  errors = {},
  idPrefix = "curriculum",
  className,
}: CurriculumSelectProps) {
  const req = required ? " *" : "";
  const boards = boardsForStage(value.stage as Stage);
  const offering = getOffering(value.board, value.stage);
  const groups = offering?.groups ?? [];
  const subjects = value.group
    ? subjectsForGroup(value.board, value.stage, value.group)
    : subjectsForOffering(value.board, value.stage).map((s) => ({ ...s, kind: undefined }));

  function setStage(stage: string) {
    const boardStillValid = boardsForStage(stage as Stage).some((b) => b.code === value.board);
    onChange({ stage, board: boardStillValid ? value.board : "", group: boardStillValid ? value.group : "", subject: boardStillValid ? value.subject : "" });
  }

  function setBoard(board: string) {
    // BSEK only runs Grades 9–10 and BIEK only 11–12, so picking one fixes the level.
    const stages = stagesForBoard(board);
    const stage = value.stage && stages.includes(value.stage as Stage) ? value.stage : stages.length === 1 ? stages[0] : value.stage;
    const sameOffering = board === value.board && stage === value.stage;
    onChange({ stage, board, group: sameOffering ? value.group : "", subject: sameOffering ? value.subject : "" });
  }

  function setGroup(group: string) {
    const subjectStillValid = !value.subject || subjectsForGroup(value.board, value.stage, group).some((s) => s.code === value.subject);
    onChange({ ...value, group, subject: subjectStillValid ? value.subject : "" });
  }

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2", className)}>
      <Field id={`${idPrefix}-stage`} label={`Level${req}`} error={errors.stage}>
        <select id={`${idPrefix}-stage`} className={selectClass} value={value.stage} onChange={(e) => setStage(e.target.value)}>
          <option value="">Select level</option>
          {STAGE_CODES.map((s) => (
            <option key={s} value={s}>{STAGES[s].label} ({STAGES[s].grades})</option>
          ))}
        </select>
      </Field>

      <Field id={`${idPrefix}-board`} label={`Board${req}`} error={errors.board}>
        <select id={`${idPrefix}-board`} className={selectClass} value={value.board} onChange={(e) => setBoard(e.target.value)}>
          <option value="">Select board</option>
          {boards.map((b) => {
            const label = value.stage ? getOffering(b.code, value.stage)?.label : stagesForBoard(b.code).map((s) => getOffering(b.code, s)?.label).join(" / ");
            return <option key={b.code} value={b.code}>{b.shortName} — {label}</option>;
          })}
        </select>
      </Field>

      <Field id={`${idPrefix}-group`} label="Group" error={errors.group}>
        <select id={`${idPrefix}-group`} className={selectClass} value={value.group} onChange={(e) => setGroup(e.target.value)} disabled={!offering}>
          <option value="">{offering ? "Select group" : "Choose level and board first"}</option>
          {groups.map((g) => (
            <option key={g.code} value={g.code}>{g.name}</option>
          ))}
        </select>
      </Field>

      {showSubject && (
        <Field id={`${idPrefix}-subject`} label={subjectLabel} error={errors.subject}>
          <select id={`${idPrefix}-subject`} className={selectClass} value={value.subject} onChange={(e) => onChange({ ...value, subject: e.target.value })} disabled={!offering}>
            <option value="">{offering ? "Select subject" : "Choose level and board first"}</option>
            {subjects.map((s) => (
              <option key={s.code} value={s.code}>
                {s.label}{s.kind === "compulsory" ? " (compulsory)" : s.kind === "elective" ? " (elective)" : ""}
              </option>
            ))}
          </select>
        </Field>
      )}
    </div>
  );
}
