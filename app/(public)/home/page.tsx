import {
  HeroSection,
  BoardsStrip,
  PathwaysSection,
  TeachingSection,
  FreeLessonsBand,
  VisitSection,
  FaqSection,
  AdmissionSection,
} from "@/components/landing/sections";
import { getBusinessProfile } from "@/lib/google-business";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "The Classes | Matric, Inter, O & A Level Coaching in Malir 15, Karachi",
  description:
    "Coaching centre in Malir 15, Karachi for Matric, Intermediate, O Level, IGCSE and A Level. BSEK, BIEK, AKU-EB, FBISE, Cambridge and Edexcel. Small batches, regular tests and free counselling.",
  path: "/home",
});

// Google Business Profile data (rating, reviews) refreshes every 6 hours
export const revalidate = 21600;

export default async function HomePage() {
  const profile = await getBusinessProfile();
  return (
    <>
      <HeroSection profile={profile} />
      <BoardsStrip />
      <PathwaysSection />
      <TeachingSection />
      <FreeLessonsBand />
      <VisitSection profile={profile} />
      <FaqSection />
      <AdmissionSection />
    </>
  );
}
