/**
 * Curriculum catalog: boards, stages (Grades 9–10 / 11–12), groups and subjects.
 *
 * This file is the single source of truth. It is used by the UI, by API
 * validation, and to generate the database seed
 * (`node scripts/generate-curriculum-sql.mjs`). After editing it, regenerate
 * the SQL and add a migration so the database matches.
 *
 * Keep this file free of path aliases and TypeScript-only runtime syntax
 * (enums, namespaces): the generator imports it directly with Node.
 *
 * Sources (checked Nov 2026):
 * - National Curriculum Council "Inclusive Scheme of Studies 2024", as
 *   published by FBISE (implemented from SSC-I / HSSC-I 2025). This is the
 *   framework for FBISE and is being adopted by AKU-EB and the Sindh boards.
 * - Older FBISE SSC scheme (social-science elective list).
 * - BIEK "Scheme of Studies for the Higher Secondary Certificate Examinations"
 *   (biek.edu.pk): BIEK compulsory subjects and its Pre-Engineering, Science
 *   General, Commerce and Humanities groups.
 * - Board/press notices for BSEK group names.
 * - Cambridge International and Pearson Edexcel qualification listings.
 *   Cambridge/Edexcel have no formal "groups": the streams below are the
 *   recommended combinations (they mirror the Pakistani groups, which IBCC
 *   uses for equivalence).
 */

export type Stage = "secondary" | "higher_secondary";
export type GroupCode = "bio" | "eng" | "comp" | "commerce" | "arts";
export type SubjectKind = "compulsory" | "core" | "elective";

export interface CurriculumBoard {
  code: string;
  name: string;
  shortName: string;
  /** Pakistani boards share the national scheme; international ones don't. */
  family: "pakistan" | "international";
}

export interface CurriculumGroup {
  code: GroupCode;
  name: string;
  /** For groups with electives: how many to choose. */
  electivesRequired?: number;
  core: string[];
  electives?: string[];
  note?: string;
}

export interface CurriculumOffering {
  board: string;
  stage: Stage;
  /** e.g. "Matric (SSC)", "O Level", "International A Level" */
  label: string;
  compulsory: string[];
  groups: CurriculumGroup[];
  note?: string;
}

// ─── Stages ─────────────────────────────────────────────────────────────

export const STAGES: Record<Stage, { label: string; grades: string; short: string }> = {
  secondary: { label: "Matric, O Level & IGCSE", grades: "Grades 9–10", short: "Matric / O Level" },
  higher_secondary: { label: "Intermediate & A Level", grades: "Grades 11–12", short: "Inter / A Level" },
};

// ─── Boards ─────────────────────────────────────────────────────────────

export const BOARDS: CurriculumBoard[] = [
  { code: "bsek", name: "Board of Secondary Education Karachi", shortName: "BSEK", family: "pakistan" },
  { code: "biek", name: "Board of Intermediate Education Karachi", shortName: "BIEK", family: "pakistan" },
  { code: "aku_eb", name: "Aga Khan University Examination Board", shortName: "AKU-EB", family: "pakistan" },
  { code: "fbise", name: "Federal Board of Intermediate and Secondary Education", shortName: "FBISE", family: "pakistan" },
  { code: "cambridge", name: "Cambridge International", shortName: "Cambridge", family: "international" },
  { code: "edexcel", name: "Pearson Edexcel", shortName: "Edexcel", family: "international" },
];

// ─── Subjects ───────────────────────────────────────────────────────────

export const SUBJECTS: Record<string, string> = {
  // Compulsory / languages
  english: "English",
  urdu: "Urdu",
  sindhi: "Sindhi (Asan Sindhi / Urdu Salees)",
  islamiyat: "Islamiyat / Ethics (for non-Muslims)",
  translation_of_quran: "Translation of the Holy Quran",
  pakistan_studies: "Pakistan Studies",
  // Mathematics & sciences
  mathematics: "Mathematics",
  additional_mathematics: "Additional Mathematics",
  further_mathematics: "Further Mathematics",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  general_science: "General Science",
  computer_science: "Computer Science",
  information_technology: "Information Technology",
  statistics: "Statistics",
  environmental_management: "Environmental Management",
  // Humanities, social sciences & commerce
  economics: "Economics",
  accounting: "Accounting",
  business_studies: "Business Studies",
  commerce: "Commerce",
  business_mathematics: "Business Mathematics",
  commercial_geography: "Commercial Geography",
  banking: "Banking",
  civics: "Civics",
  education: "Education",
  geography: "Geography",
  history: "History",
  general_history: "General History",
  islamic_history: "Islamic History",
  islamic_studies: "Islamic Studies",
  sociology: "Sociology",
  psychology: "Psychology",
  philosophy: "Philosophy",
  law: "Law",
  english_literature: "English Literature",
  english_general_paper: "English General Paper",
  urdu_elective: "Urdu (Elective)",
  english_elective: "English (Elective)",
  sindhi_elective: "Sindhi (Elective)",
  arabic: "Arabic",
  persian: "Persian",
  fine_arts: "Art, Model Drawing & Fine Arts",
  home_economics: "Home Economics",
  physiology_hygiene: "Physiology & Hygiene",
  health_physical_education: "Health & Physical Education",
};

// Shared lists for the Pakistani boards (national scheme of studies)
const PK_SECONDARY_COMPULSORY = ["english", "urdu", "islamiyat", "translation_of_quran", "pakistan_studies", "mathematics"];
const PK_HIGHER_COMPULSORY = ["english", "urdu", "islamiyat", "translation_of_quran", "pakistan_studies"];

const PK_SECONDARY_ARTS_ELECTIVES = [
  "computer_science", "economics", "civics", "education", "geography", "islamic_history",
  "islamic_studies", "statistics", "business_studies", "english_literature", "arabic",
  "home_economics", "physiology_hygiene", "fine_arts", "health_physical_education",
];
const PK_HIGHER_ARTS_ELECTIVES = [
  "economics", "psychology", "sociology", "civics", "education", "islamic_history",
  "islamic_studies", "english_literature", "urdu_elective", "philosophy", "statistics",
  "geography", "computer_science", "fine_arts", "health_physical_education",
];

const PK_SECONDARY_GROUPS: CurriculumGroup[] = [
  { code: "bio", name: "Science (Biology)", core: ["physics", "chemistry", "biology"] },
  { code: "comp", name: "Science (Computer)", core: ["physics", "chemistry", "computer_science"],
    note: "Computer Science is examined as “Computer Science & Entrepreneurship” under the 2024 scheme." },
  { code: "arts", name: "Arts / Humanities", core: ["general_science"], electivesRequired: 2, electives: PK_SECONDARY_ARTS_ELECTIVES,
    note: "Choose any two electives. Exact elective options vary by board and school." },
];

const PK_HIGHER_GROUPS: CurriculumGroup[] = [
  { code: "bio", name: "Pre-Medical", core: ["physics", "chemistry", "biology"] },
  { code: "eng", name: "Pre-Engineering", core: ["physics", "chemistry", "mathematics"] },
  { code: "comp", name: "Computer Science (ICS)", core: ["computer_science", "mathematics"], electivesRequired: 1, electives: ["physics", "statistics", "economics"],
    note: "Also called Science General. Computer Science and Mathematics with Physics, Statistics or Economics." },
  { code: "commerce", name: "Commerce", core: ["accounting", "commerce", "economics"],
    note: "Under the 2024 national scheme these are examined as Banking, Accounting & Finance; Business & Commerce; and Economics. Students on the older scheme also take Business Mathematics, Statistics and Banking." },
  { code: "arts", name: "Humanities (Arts)", core: [], electivesRequired: 3, electives: PK_HIGHER_ARTS_ELECTIVES,
    note: "Choose any three electives. Exact elective options vary by board and college." },
];

// BIEK publishes its own HSC scheme (older than the 2024 national scheme)
const BIEK_GROUPS: CurriculumGroup[] = [
  { code: "bio", name: "Pre-Medical", core: ["physics", "chemistry", "biology"],
    note: "Biology is examined as Zoology and Botany." },
  { code: "eng", name: "Pre-Engineering", core: ["physics", "chemistry", "mathematics"] },
  { code: "comp", name: "Computer Science (Science General)", core: ["computer_science", "mathematics"], electivesRequired: 1, electives: ["physics", "statistics", "economics"],
    note: "Science General: three of Physics, Computer Science, Mathematics, Economics and Statistics. Physics must be taken with Mathematics." },
  { code: "commerce", name: "Commerce",
    core: ["accounting", "commerce", "economics", "business_mathematics", "commercial_geography", "statistics", "banking"],
    note: "Part I: Principles of Accounting, Principles of Commerce, Principles of Economics, Business Mathematics. Part II: Principles of Accounting, Commercial Geography, Statistics, Banking." },
  { code: "arts", name: "Humanities (Arts)", core: [], electivesRequired: 3,
    electives: [
      "civics", "sociology", "statistics",
      "education", "geography", "islamic_history",
      "economics", "general_history", "islamic_studies", "psychology",
      "urdu_elective", "english_elective", "sindhi_elective", "arabic", "persian", "mathematics",
      "computer_science", "fine_arts", "health_physical_education",
    ],
    note: "Choose three, at most one from each of BIEK’s subject sets (A: Civics, Sociology, Statistics · B: Education, Geography, Islamic History · C: Economics, General History, Islamic Studies, Psychology · D: languages, Mathematics · E: Computer Science, Fine Arts, Health & PE)." },
];

const SINDH_NOTE = "In Sindh, students also take Sindhi: Urdu speakers take Asan Sindhi, Sindhi speakers take Urdu Salees.";
const BIEK_NOTE = "Islamiyat is replaced by Civics for non-Muslim students. Sindhi-medium students may take a Sindhi paper in place of Urdu Paper II.";

const INTL_STREAM_NOTE = "Cambridge and Edexcel have no formal groups. These are our recommended subject combinations, matching the Pakistani groups that IBCC uses for equivalence.";

// ─── Offerings ──────────────────────────────────────────────────────────

export const OFFERINGS: CurriculumOffering[] = [
  // Grades 9–10
  { board: "bsek", stage: "secondary", label: "Matric (SSC)",
    compulsory: [...PK_SECONDARY_COMPULSORY, "sindhi"], groups: PK_SECONDARY_GROUPS, note: SINDH_NOTE },
  { board: "aku_eb", stage: "secondary", label: "Matric (SSC)",
    compulsory: PK_SECONDARY_COMPULSORY, groups: PK_SECONDARY_GROUPS, note: SINDH_NOTE },
  { board: "fbise", stage: "secondary", label: "Matric (SSC)",
    compulsory: PK_SECONDARY_COMPULSORY, groups: PK_SECONDARY_GROUPS },
  { board: "cambridge", stage: "secondary", label: "O Level",
    compulsory: ["english", "urdu", "islamiyat", "pakistan_studies", "mathematics"],
    groups: [
      { code: "bio", name: "Science – Biology stream", core: ["physics", "chemistry", "biology"] },
      { code: "comp", name: "Science – Computer stream", core: ["physics", "chemistry", "computer_science"] },
      { code: "arts", name: "Arts & Humanities stream", core: [], electivesRequired: 3,
        electives: ["economics", "business_studies", "accounting", "commerce", "sociology", "english_literature", "geography", "history", "statistics", "additional_mathematics", "environmental_management"],
        note: "Choose any three." },
    ],
    note: INTL_STREAM_NOTE },
  { board: "edexcel", stage: "secondary", label: "International GCSE",
    compulsory: ["english", "mathematics", "urdu", "islamiyat", "pakistan_studies"],
    groups: [
      { code: "bio", name: "Science – Biology stream", core: ["physics", "chemistry", "biology"] },
      { code: "comp", name: "Science – Computer stream", core: ["physics", "chemistry", "computer_science"] },
      { code: "arts", name: "Arts & Humanities stream", core: [], electivesRequired: 3,
        electives: ["economics", "business_studies", "accounting", "commerce", "english_literature", "geography", "history", "information_technology", "further_mathematics"],
        note: "Choose any three." },
    ],
    note: `${INTL_STREAM_NOTE} Urdu and Islamiyat are usually taken as Cambridge O Level papers alongside the IGCSEs.` },

  // Grades 11–12
  { board: "biek", stage: "higher_secondary", label: "Intermediate (HSC)",
    compulsory: ["english", "urdu", "islamiyat", "pakistan_studies"], groups: BIEK_GROUPS, note: BIEK_NOTE },
  { board: "aku_eb", stage: "higher_secondary", label: "Intermediate (HSSC)",
    compulsory: PK_HIGHER_COMPULSORY, groups: PK_HIGHER_GROUPS, note: SINDH_NOTE },
  { board: "fbise", stage: "higher_secondary", label: "Intermediate (HSSC)",
    compulsory: PK_HIGHER_COMPULSORY, groups: PK_HIGHER_GROUPS },
  { board: "cambridge", stage: "higher_secondary", label: "A Level",
    compulsory: [],
    groups: [
      { code: "bio", name: "Science – Biology stream (Pre-Medical)", core: ["physics", "chemistry", "biology"] },
      { code: "eng", name: "Science – Engineering stream (Pre-Engineering)", core: ["mathematics", "physics", "chemistry"],
        note: "Further Mathematics is a useful fourth subject for engineering." },
      { code: "comp", name: "Science – Computer stream", core: ["mathematics", "computer_science"], electivesRequired: 1, electives: ["physics", "further_mathematics", "information_technology", "economics"] },
      { code: "commerce", name: "Commerce stream", core: ["accounting", "economics", "business_studies"] },
      { code: "arts", name: "Arts & Humanities stream", core: [], electivesRequired: 3,
        electives: ["economics", "accounting", "business_studies", "sociology", "psychology", "law", "english_literature", "english_general_paper", "history", "geography", "urdu", "mathematics"],
        note: "Choose any three." },
    ],
    note: INTL_STREAM_NOTE },
  { board: "edexcel", stage: "higher_secondary", label: "International A Level",
    compulsory: [],
    groups: [
      { code: "bio", name: "Science – Biology stream (Pre-Medical)", core: ["physics", "chemistry", "biology"] },
      { code: "eng", name: "Science – Engineering stream (Pre-Engineering)", core: ["mathematics", "physics", "chemistry"],
        note: "Further Mathematics is a useful fourth subject for engineering." },
      { code: "comp", name: "Science – Computer stream", core: ["mathematics", "computer_science"], electivesRequired: 1, electives: ["physics", "further_mathematics", "information_technology", "economics"],
        note: "Edexcel International A Level Computer Science was first taught in September 2026. Information Technology remains available." },
      { code: "commerce", name: "Commerce stream", core: ["accounting", "economics", "business_studies"] },
      { code: "arts", name: "Arts & Humanities stream", core: [], electivesRequired: 3,
        electives: ["economics", "accounting", "business_studies", "psychology", "english_literature", "history", "geography", "mathematics"],
        note: "Choose any three." },
    ],
    note: INTL_STREAM_NOTE },
];

// ─── Helpers ────────────────────────────────────────────────────────────

export const STAGE_CODES = Object.keys(STAGES) as Stage[];
export const GROUP_CODES = ["bio", "eng", "comp", "commerce", "arts"] as const satisfies readonly GroupCode[];
export const BOARD_CODES = BOARDS.map((b) => b.code);
export const SUBJECT_CODES = Object.keys(SUBJECTS);

export function getBoard(code: string | null | undefined): CurriculumBoard | undefined {
  return BOARDS.find((b) => b.code === code);
}

export function boardLabel(code: string | null | undefined): string {
  return getBoard(code)?.shortName ?? "";
}

export function subjectLabel(code: string | null | undefined): string {
  return (code && SUBJECTS[code]) || code || "";
}

export function getOfferings(stage?: Stage | ""): CurriculumOffering[] {
  return stage ? OFFERINGS.filter((o) => o.stage === stage) : OFFERINGS;
}

export function getOffering(board: string | null | undefined, stage: string | null | undefined): CurriculumOffering | undefined {
  return OFFERINGS.find((o) => o.board === board && o.stage === stage);
}

/** Boards that run a given stage, in display order. */
export function boardsForStage(stage: Stage | "" | null | undefined): CurriculumBoard[] {
  if (!stage) return BOARDS;
  return BOARDS.filter((b) => OFFERINGS.some((o) => o.board === b.code && o.stage === stage));
}

/** Stages a board runs (AKU-EB/FBISE/Cambridge/Edexcel run both; BSEK and BIEK one each). */
export function stagesForBoard(board: string | null | undefined): Stage[] {
  return OFFERINGS.filter((o) => o.board === board).map((o) => o.stage);
}

export function getGroup(board: string | null | undefined, stage: string | null | undefined, group: string | null | undefined): CurriculumGroup | undefined {
  return getOffering(board, stage)?.groups.find((g) => g.code === group);
}

/** e.g. "AKU-EB Intermediate (HSSC) · Pre-Medical" */
export function describeSelection(board?: string | null, stage?: string | null, group?: string | null): string {
  const offering = getOffering(board, stage);
  const parts = [
    [boardLabel(board), offering?.label].filter(Boolean).join(" "),
    getGroup(board, stage, group)?.name,
  ].filter(Boolean);
  return parts.join(" · ");
}

/** Every subject in a group, tagged with how it's taken. */
export function subjectsForGroup(board: string | null | undefined, stage: string | null | undefined, group: string | null | undefined): { code: string; label: string; kind: SubjectKind }[] {
  const offering = getOffering(board, stage);
  const g = offering?.groups.find((x) => x.code === group);
  if (!offering || !g) return [];
  const seen = new Set<string>();
  const out: { code: string; label: string; kind: SubjectKind }[] = [];
  const add = (codes: string[], kind: SubjectKind) => {
    for (const code of codes) {
      if (seen.has(code)) continue;
      seen.add(code);
      out.push({ code, label: subjectLabel(code), kind });
    }
  };
  add(offering.compulsory, "compulsory");
  add(g.core, "core");
  add(g.electives ?? [], "elective");
  return out;
}

/** Subjects offered anywhere in a board/stage (all groups). */
export function subjectsForOffering(board: string | null | undefined, stage: string | null | undefined): { code: string; label: string }[] {
  const offering = getOffering(board, stage);
  if (!offering) return [];
  const codes = new Set<string>(offering.compulsory);
  offering.groups.forEach((g) => [...g.core, ...(g.electives ?? [])].forEach((c) => codes.add(c)));
  return [...codes].map((code) => ({ code, label: subjectLabel(code) }));
}

/** Is this board/stage/group/subject combination valid? Empty parts are allowed. */
export function isValidSelection(sel: { board?: string | null; stage?: string | null; group?: string | null; subject?: string | null }): boolean {
  const { board, stage, group, subject } = sel;
  if (board && !getBoard(board)) return false;
  if (stage && !STAGE_CODES.includes(stage as Stage)) return false;
  if (board && stage && !getOffering(board, stage)) return false;
  if (group) {
    if (!board || !stage || !getGroup(board, stage, group)) return false;
  }
  if (subject) {
    if (!SUBJECTS[subject]) return false;
    if (board && stage && group) return subjectsForGroup(board, stage, group).some((s) => s.code === subject);
    if (board && stage) return subjectsForOffering(board, stage).some((s) => s.code === subject);
  }
  return true;
}
