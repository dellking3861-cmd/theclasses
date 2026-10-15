"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/home", label: "Home" },
    { href: "/courses", label: "Subjects" },
    { href: "/ai-learning-programs", label: "Programs" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/90 backdrop-blur-lg shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/home" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt={APP_NAME}
              className="h-9 w-auto"
            />
            <span className="text-lg font-bold tracking-tight text-stone-900 font-display">
              {APP_NAME}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  pathname === link.href
                    ? "text-amber-700 bg-amber-50"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm" className="border-stone-300 text-stone-700 hover:bg-stone-50 hover:border-stone-400">
                Login
              </Button>
            </Link>
            <Link href="/admissions">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white btn-hover">
                Enquire for Admission
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-stone-100 text-stone-700"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-stone-100 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3 py-2.5 text-sm font-medium rounded-lg",
                  pathname === link.href
                    ? "text-amber-700 bg-amber-50"
                    : "text-stone-600 hover:bg-stone-50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2 px-3">
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full border-stone-300 text-stone-700 hover:bg-stone-50" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/admissions" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white" size="sm">
                  Enquire for Admission
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
