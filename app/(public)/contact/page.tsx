import type { Metadata } from "next";
import { ContactClient } from "./contact-client";
import { getBusinessProfile } from "@/lib/google-business";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: `Visit The Classes in ${CONTACT.addressShort}, call ${CONTACT.phoneDisplay} or send an admission enquiry.`,
};

// Opening hours come from the Google Business Profile (refreshed every 6 hours)
export const revalidate = 21600;

/** Compresses "Monday: 4:00 – 8:30 PM" ×6 into "Monday – Saturday: 4:00 – 8:30 PM". */
function compactHours(lines: string[]): string[] {
  const parsed = lines.map((l) => {
    const i = l.indexOf(":");
    return { day: l.slice(0, i), time: l.slice(i + 1).trim() };
  });
  const out: string[] = [];
  for (let i = 0; i < parsed.length; ) {
    let j = i;
    while (j + 1 < parsed.length && parsed[j + 1].time === parsed[i].time) j++;
    out.push(`${parsed[i].day}${j > i ? ` – ${parsed[j].day}` : ""}: ${parsed[i].time}`);
    i = j + 1;
  }
  return out;
}

export default async function ContactPage() {
  const profile = await getBusinessProfile();
  const hours = profile?.openingHours.length ? compactHours(profile.openingHours) : [...CONTACT.hoursFallback];
  return <ContactClient hours={hours} />;
}
