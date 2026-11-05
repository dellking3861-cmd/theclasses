import type { Metadata } from "next";
import { ContactClient } from "./contact-client";
import { compactHours, getBusinessProfile } from "@/lib/google-business";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: `Visit The Classes in ${CONTACT.addressShort}, call ${CONTACT.phoneDisplay} or send an admission enquiry.`,
};

// Opening hours come from the Google Business Profile (refreshed every 6 hours)
export const revalidate = 21600;

export default async function ContactPage() {
  const profile = await getBusinessProfile();
  const hours = profile?.openingHours.length ? compactHours(profile.openingHours) : [...CONTACT.hoursFallback];
  return <ContactClient hours={hours} />;
}
