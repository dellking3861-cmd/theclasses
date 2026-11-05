import { CONTACT, FOUNDED_YEAR, SERVICE_AREAS, SITE_URL } from "@/lib/constants";

/** Absolute URL on this site. */
export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const ORG_ID = `${SITE_URL}/#organization`;
export const FOUNDER_ID = `${SITE_URL}/about/sir-wasi#person`;

export const FOUNDER = {
  name: "Muhammad Wasi",
  knownAs: "Sir Wasi",
  jobTitle: "Founder and Head of Mathematics & Physics",
  photo: "/images/sir-wasi.webp",
  photoJpg: "/images/sir-wasi.jpg",
  alumniOf: "NED University of Engineering & Technology",
  degree: "B.E. Mechanical Engineering",
  linkedin: "https://www.linkedin.com/in/wasikherro3861",
  portfolio: "https://wasi-kherro-portfolio.vercel.app/",
  youtube: "https://youtube.com/@imustaadg",
  youtubePlaylist: "https://youtube.com/playlist?list=PLEBCTF0JQzpc",
} as const;

/** schema.org data describing the campus. Rendered on every public page. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": ORG_ID,
    name: "The Classes",
    alternateName: "The Classes Education System",
    foundingDate: String(FOUNDED_YEAR),
    description:
      "Coaching centre in Malir 15, Karachi for Matric, Intermediate, O Level, IGCSE and A Level (BSEK, BIEK, AKU-EB, FBISE, Cambridge, Edexcel).",
    url: absoluteUrl("/home"),
    logo: absoluteUrl("/logo.png"),
    image: [absoluteUrl("/images/campus-front-1440.webp"), absoluteUrl("/images/og-campus.jpg")],
    telephone: CONTACT.phoneHref.replace("tel:", ""),
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "R-156 Salman Garden, Near Jamia Millia Road, Malir 15",
      addressLocality: "Karachi",
      addressRegion: "Sindh",
      addressCountry: "PK",
    },
    hasMap: CONTACT.mapsHref,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "16:00",
        closes: "20:30",
      },
    ],
    areaServed: SERVICE_AREAS.map((name) => ({ "@type": "Place", name: `${name}, Karachi` })),
    founder: { "@id": FOUNDER_ID },
    sameAs: [CONTACT.facebookHref, CONTACT.instagramHref, CONTACT.mapsHref],
  };
}

export function founderJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: FOUNDER.name,
    alternateName: FOUNDER.knownAs,
    jobTitle: FOUNDER.jobTitle,
    image: absoluteUrl(FOUNDER.photoJpg),
    url: absoluteUrl("/about/sir-wasi"),
    worksFor: { "@id": ORG_ID },
    alumniOf: { "@type": "CollegeOrUniversity", name: FOUNDER.alumniOf },
    knowsAbout: ["Mathematics", "Physics", "Statistics", "Additional Mathematics", "University entrance test preparation", "AI in education"],
    sameAs: [FOUNDER.linkedin, FOUNDER.portfolio, FOUNDER.youtube],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

/** Safe for embedding inside a <script> tag. */
export const jsonLdString = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

const DEFAULT_OG_IMAGE = { url: "/images/og-campus.jpg", width: 1200, height: 630, alt: "The Classes campus, Malir 15, Karachi" };

/**
 * Per-page metadata with a canonical URL. Page-level openGraph replaces the
 * root one entirely, so the shared fields are repeated here.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: { url: string; width: number; height: number; alt: string };
  type?: "website" | "profile" | "article";
}) {
  return {
    // Titles that already name the brand skip the "| The Classes" template
    title: title.includes("The Classes") ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "The Classes",
      locale: "en_PK",
      type,
      images: [image ?? DEFAULT_OG_IMAGE],
    },
  };
}
