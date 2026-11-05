"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/utils/cn";
import { APP_NAME, CONTACT } from "@/lib/constants";
import { Menu, Phone, X, ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/layout/whatsapp-icon";

const navLinks = [
  { href: "/courses", label: "Courses" },
  { href: "/ai-learning-programs", label: "Programs" },
  { href: "/admissions", label: "Admissions" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-[72px]">
          <Link href="/home" className="flex shrink-0 items-center" aria-label={`${APP_NAME} home`}>
            {/* Trimmed wordmark (the original logo.png is mostly whitespace) */}
            <Image src="/logo-wordmark.png" alt={APP_NAME} width={387} height={191} priority className="h-11 w-auto lg:h-12" />
          </Link>

          <nav aria-label="Main" className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(pathname, link.href) ? "page" : undefined}
                className={cn(
                  "relative px-3.5 py-2 text-[15px] font-medium transition-colors",
                  isActive(pathname, link.href) ? "text-ink" : "text-stone-600 hover:text-ink"
                )}
              >
                {link.label}
                {isActive(pathname, link.href) && (
                  <span className="absolute inset-x-3.5 -bottom-[17px] h-0.5 rounded-full bg-brand-500" aria-hidden="true" />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <a
              href={CONTACT.phoneHref}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
            >
              <Phone className="h-4 w-4 text-brand-700" aria-hidden="true" />
              {CONTACT.phoneDisplay}
            </a>
            <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100">
              Log in
            </Link>
            <Link
              href="/admissions"
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-brand-500 px-4 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-brand-400"
            >
              Apply now <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <a
              href={CONTACT.phoneHref}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-stone-700 hover:bg-stone-100"
              aria-label={`Call ${CONTACT.phoneDisplay}`}
            >
              <Phone className="h-5 w-5" />
            </a>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-stone-700 hover:bg-stone-100"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-menu" className="border-t border-stone-200 bg-white lg:hidden">
          <nav aria-label="Main" className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            {[{ href: "/home", label: "Home" }, ...navLinks, { href: "/blog", label: "Blog" }].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive(pathname, link.href) ? "page" : undefined}
                className={cn(
                  "flex min-h-12 items-center rounded-lg px-3 text-base font-medium",
                  isActive(pathname, link.href) ? "bg-brand-50 text-ink" : "text-stone-700 hover:bg-stone-50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-stone-100 pt-4">
              <Link
                href="/admissions"
                onClick={() => setMobileOpen(false)}
                className="col-span-2 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-500 font-semibold text-ink"
              >
                Apply for admission <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href={CONTACT.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-stone-300 font-medium text-stone-800"
              >
                <WhatsAppIcon className="h-5 w-5 text-[#1fa855]" /> WhatsApp
              </a>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-12 items-center justify-center rounded-xl border border-stone-300 font-medium text-stone-800"
              >
                Log in
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
