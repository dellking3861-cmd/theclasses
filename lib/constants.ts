export const APP_NAME = "The Classes";
export const APP_DESCRIPTION =
  "Pakistan's premier hybrid education platform combining physical coaching centers with online learning, AI-powered tools, and comprehensive student management.";

export const CONTACT = {
  phoneDisplay: "+92 336 3861205",
  phoneHref: "tel:+923363861205",
  whatsappHref: "https://wa.me/923363861205",
  email: "wasikherro@gmail.com",
  address: "R-156 Salman Garden, Near Jamia Millia Road, Malir 15, Karachi",
  addressShort: "Malir 15, Karachi",
  mapsHref: "https://www.google.com/maps/search/?api=1&query=The+Classes+R-156+Salman+Garden+Malir+15+Karachi",
  reviewsHref: "https://search.google.com/local/reviews?placeid=ChIJ0cltXEQ7sz4RfP0TVsb4el4",
  /** Used only if Google Business Profile hours can't be fetched */
  hoursFallback: ["Monday to Saturday: 4:00 – 8:30 PM", "Sunday: Closed"],
} as const;

export const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
  PARENT: "parent",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

// Boards, levels, groups and subjects live in lib/curriculum.ts.

export const PROGRAMS = {
  AI_WEB_DEVELOPMENT: "ai_web_development",
  SPOKEN_ENGLISH: "spoken_english",
  PROGRAMMING_FUNDAMENTALS: "programming_fundamentals",
  FREELANCING: "freelancing",
  ENTRY_TEST_PREPARATION: "entry_test_preparation",
  SCHOOL_CLASSES: "school_classes",
  WEB_BASICS: "web_basics",
} as const;

export const PROGRAM_LABELS: Record<string, string> = {
  ai_web_development: "AI Web Development",
  spoken_english: "Spoken English",
  programming_fundamentals: "Programming Fundamentals",
  freelancing: "Freelancing Course",
  entry_test_preparation: "Entry Test Preparation",
  school_classes: "School Foundation (Grades 1–8)",
  web_basics: "Web Basics & Programming",
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
