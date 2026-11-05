export const APP_NAME = "The Classes";
export const APP_DESCRIPTION =
  "Coaching centre in Malir 15, Karachi for Matric, Intermediate, O Level, IGCSE and A Level. BSEK, BIEK, AKU-EB, FBISE, Cambridge and Edexcel, with small batches, regular tests and recorded lectures.";

/** The Classes was founded in 2019; Sir Wasi has taught since 2017. */
export const FOUNDED_YEAR = 2019;
export const TEACHING_SINCE = 2017;

/** Canonical site address used for metadata, sitemap and structured data. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://theclasses.vercel.app").replace(/\/$/, "");

/** Neighbourhoods served from the Malir 15 campus (used in copy and structured data). */
export const SERVICE_AREAS = [
  "Malir 15",
  "Malir City",
  "Saudabad",
  "Kalaboard",
  "Jaffar-e-Tayyar",
  "Model Colony",
  "Malir Cantt",
  "Shah Faisal Colony",
] as const;

export const CONTACT = {
  phoneDisplay: "+92 336 3861205",
  phoneHref: "tel:+923363861205",
  whatsappHref: "https://wa.me/923363861205",
  email: "wasikherro@gmail.com",
  address: "R-156 Salman Garden, Near Jamia Millia Road, Malir 15, Karachi",
  addressShort: "Malir 15, Karachi",
  /** Opens our exact Google Maps listing (directions, photos, reviews) */
  mapsHref: "https://www.google.com/maps/search/?api=1&query=The+Classes+Malir+15+Karachi&query_place_id=ChIJ0cltXEQ7sz4RfP0TVsb4el4",
  /** Keyless Google Maps embed */
  mapEmbedSrc: "https://maps.google.com/maps?q=The%20Classes%2C%20R-156%20Salman%20Garden%2C%20Malir%2015%2C%20Karachi&z=16&output=embed",
  facebookHref: "https://www.facebook.com/theclassesedu/",
  instagramHref: "https://www.instagram.com/theclasses.edu.pk/",
  reviewsHref: "https://search.google.com/local/reviews?placeid=ChIJ0cltXEQ7sz4RfP0TVsb4el4",
  /** Opens Google's "write a review" box for the profile directly */
  writeReviewHref: "https://search.google.com/local/writereview?placeid=ChIJ0cltXEQ7sz4RfP0TVsb4el4",
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
