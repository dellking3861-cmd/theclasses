import { CONTACT } from "@/lib/constants";

export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export const SOCIAL_LINKS = [
  { label: "Facebook", href: CONTACT.facebookHref, Icon: FacebookIcon },
  { label: "Instagram", href: CONTACT.instagramHref, Icon: InstagramIcon },
] as const;

/** Round icon buttons linking to our social pages. */
export function SocialLinks({ className = "", buttonClassName }: { className?: string; buttonClassName: string }) {
  return (
    <ul className={`flex gap-2 ${className}`}>
      {SOCIAL_LINKS.map(({ label, href, Icon }) => (
        <li key={label}>
          <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`The Classes on ${label}`} className={buttonClassName}>
            <Icon className="h-5 w-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}
