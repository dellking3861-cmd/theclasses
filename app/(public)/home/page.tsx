import {
  HeroSection,
  BoardsStrip,
  PathwaysSection,
  TeachingSection,
  VisitSection,
  AdmissionSection,
} from "@/components/landing/sections";
import { getBusinessProfile } from "@/lib/google-business";
import { CONTACT } from "@/lib/constants";

// Google Business Profile data (rating, reviews) refreshes every 6 hours
export const revalidate = 21600;

export default async function HomePage() {
  const profile = await getBusinessProfile();
  // Structured data so search engines link the site to the Maps listing and social pages
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "The Classes",
    image: "/images/campus-front-1440.webp",
    telephone: CONTACT.phoneHref.replace("tel:", ""),
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "R-156 Salman Garden, Near Jamia Millia Road, Malir 15",
      addressLocality: "Karachi",
      addressCountry: "PK",
    },
    hasMap: CONTACT.mapsHref,
    sameAs: [CONTACT.facebookHref, CONTACT.instagramHref, CONTACT.mapsHref],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <HeroSection profile={profile} />
      <BoardsStrip />
      <PathwaysSection />
      <TeachingSection />
      <VisitSection profile={profile} />
      <AdmissionSection />
    </>
  );
}
