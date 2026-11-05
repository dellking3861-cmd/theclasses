import type { Metadata } from "next";
import { ContactClient } from "./contact-client";
import { compactHours, getBusinessProfile } from "@/lib/google-business";
import { CONTACT } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact & Directions: Malir 15, Karachi",
  description: `Visit The Classes at ${CONTACT.address}. Call or WhatsApp ${CONTACT.phoneDisplay}, get directions or send an admission enquiry.`,
  path: "/contact",
});

// Opening hours come from the Google Business Profile (refreshed every 6 hours)
export const revalidate = 21600;

export default async function ContactPage() {
  const profile = await getBusinessProfile();
  const hours = profile?.openingHours.length ? compactHours(profile.openingHours) : [...CONTACT.hoursFallback];
  return <ContactClient hours={hours} />;
}
