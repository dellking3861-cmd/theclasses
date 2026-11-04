import Link from "next/link";
import { APP_NAME, CONTACT } from "@/lib/constants";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/layout/whatsapp-icon";

const columns = [
  {
    title: "Courses",
    links: [
      { label: "Matric (Grades 9–10)", href: "/courses?stage=secondary&board=bsek" },
      { label: "Intermediate (Grades 11–12)", href: "/courses?stage=higher_secondary&board=biek" },
      { label: "O Level & IGCSE", href: "/courses?stage=secondary&board=cambridge" },
      { label: "A Level", href: "/courses?stage=higher_secondary&board=cambridge" },
      { label: "School Classes (Grades 1–8)", href: "/courses?stage=programs" },
    ],
  },
  {
    title: "The Classes",
    links: [
      { label: "About us", href: "/about" },
      { label: "Admissions", href: "/admissions" },
      { label: "Skills programs", href: "/ai-learning-programs" },
      { label: "Blog", href: "/blog" },
      { label: "Student & parent login", href: "/login" },
    ],
  },
];

export function PublicFooter() {
  return (
    <footer className="bg-ink text-stone-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div className="space-y-4">
            <Link href="/home" className="inline-block">
              <span className="block font-display text-2xl font-bold tracking-tight text-white">
                THE <span className="text-brand-500">CLASSES</span>
              </span>
              <span className="block text-[11px] font-medium uppercase tracking-[0.3em] text-stone-400">Education System</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-stone-400">
              Board-focused coaching in Karachi for Matric, Intermediate, O Level, IGCSE and A Level, with recorded
              lectures and progress reports online.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="mb-4 text-sm font-semibold text-white">{col.title}</h2>
              <ul className="space-y-1">
                {col.links.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="inline-flex min-h-9 items-center text-sm text-stone-400 transition-colors hover:text-brand-400">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="mb-4 text-sm font-semibold text-white">Visit or contact us</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={CONTACT.mapsHref} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 text-stone-400 hover:text-white">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                  <span>
                    {CONTACT.address}
                    <ArrowUpRight className="ml-1 inline h-3.5 w-3.5 opacity-60 group-hover:opacity-100" aria-label="opens Google Maps" />
                  </span>
                </a>
              </li>
              <li>
                <a href={CONTACT.phoneHref} className="flex items-center gap-3 text-stone-400 hover:text-white">
                  <Phone className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-stone-400 hover:text-white">
                  <WhatsAppIcon className="h-4 w-4 shrink-0 text-brand-500" />
                  WhatsApp us
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 break-all text-stone-400 hover:text-white">
                  <Mail className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-stone-500">
          &copy; {new Date().getFullYear()} {APP_NAME} Education System. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
