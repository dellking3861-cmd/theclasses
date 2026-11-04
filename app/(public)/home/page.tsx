import {
  HeroSection,
  BoardsStrip,
  PathwaysSection,
  TeachingSection,
  ReviewsSection,
  AdmissionSection,
} from "@/components/landing/sections";
import { getBusinessProfile } from "@/lib/google-business";

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
      <ReviewsSection profile={profile} />
      <AdmissionSection />
    </>
  );
}
