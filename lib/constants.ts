export const APP_NAME = "The Classes";
export const APP_DESCRIPTION =
  "Pakistan's premier hybrid education platform combining physical coaching centers with online learning, AI-powered tools, and comprehensive student management.";

export const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
  PARENT: "parent",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const BOARDS = {
  AKU_EB: "aku_eb",
  SINDH_BOARD: "sindh_board",
  CAMBRIDGE_O: "cambridge_o",
  CAMBRIDGE_A: "cambridge_a",
} as const;

export const BOARD_LABELS: Record<string, string> = {
  aku_eb: "AKU-EB",
  sindh_board: "Sindh Board",
  cambridge_o: "Cambridge O Level",
  cambridge_a: "Cambridge A Level",
};

export const SUBJECTS = {
  MATHEMATICS: "mathematics",
  PHYSICS: "physics",
  CHEMISTRY: "chemistry",
  BIOLOGY: "biology",
  COMPUTER_SCIENCE: "computer_science",
  ENGLISH: "english",
} as const;

export const SUBJECT_LABELS: Record<string, string> = {
  mathematics: "Mathematics",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  computer_science: "Computer Science",
  english: "English",
};

export const PROGRAMS = {
  AI_WEB_DEVELOPMENT: "ai_web_development",
  SPOKEN_ENGLISH: "spoken_english",
  PROGRAMMING_FUNDAMENTALS: "programming_fundamentals",
  FREELANCING: "freelancing",
  ENTRY_TEST_PREPARATION: "entry_test_preparation",
} as const;

export const PROGRAM_LABELS: Record<string, string> = {
  ai_web_development: "AI Web Development",
  spoken_english: "Spoken English",
  programming_fundamentals: "Programming Fundamentals",
  freelancing: "Freelancing Course",
  entry_test_preparation: "Entry Test Preparation",
};

export const ROLE_DASHBOARD_PATHS: Record<UserRole, string> = {
  admin: "/dashboard/admin",
  teacher: "/dashboard/teacher",
  student: "/dashboard/student",
  parent: "/dashboard/parent",
};

export const NAV_LINKS = [
  { href: "/home", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/admissions", label: "Admissions" },
  { href: "/ai-learning-programs", label: "AI Programs" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "jazzcash", label: "JazzCash" },
  { value: "easypaisa", label: "EasyPaisa" },
  { value: "card", label: "Card" },
  { value: "online", label: "Online" },
] as const;
