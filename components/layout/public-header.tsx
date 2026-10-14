"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-200/60 bg-[#fffbf0]/85 backdrop-blur-xl shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/home" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt={APP_NAME}
              className="h-9 w-auto logo-hover"
            />
            <span className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
              {APP_NAME}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  pathname === link.href
                    ? "text-amber-700 bg-amber-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-amber-50/50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="btn-3d">Sign In</Button>
            </Link>
            <Link href="/admissions">
              <Button size="sm" className="btn-3d bg-amber-600 hover:bg-amber-700 text-white">Apply Now</Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-amber-100 text-slate-700"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-amber-100 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3 py-2.5 text-sm font-medium rounded-lg",
                  pathname === link.href
                    ? "text-amber-700 bg-amber-50"
                    : "text-slate-600 hover:bg-amber-50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2 px-3">
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full" size="sm">Sign In</Button>
              </Link>
              <Link href="/admissions" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white" size="sm">Apply Now</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
