import type { EnquiryInput } from "@/lib/validations";

/** Reads the hidden honeypot field from the submitted form, if any. */
export function honeypotValue(event?: { target?: unknown }): string {
  const form = event?.target;
  if (form instanceof HTMLFormElement) {
    return String(new FormData(form).get("website") ?? "");
  }
  return "";
}

/** Posts a public enquiry. Throws with a user-facing message on failure. */
export async function submitEnquiry(payload: EnquiryInput): Promise<void> {
  let response: Response;
  try {
    response = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Network error. Please check your connection and try again.");
  }
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.error || "Something went wrong. Please try again.");
  }
}
