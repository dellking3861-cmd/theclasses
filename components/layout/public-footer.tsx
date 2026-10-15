import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { Mail, Phone, MapPin } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link href="/home" className="flex items-center gap-2.5">
              <img src="/logo.png" alt={APP_NAME} className="h-8 w-auto" />
              <span className="text-lg font-bold text-stone-900 font-display">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-stone-500 leading-relaxed">
              Pakistan&apos;s premier hybrid education platform combining physical coaching
              centers with online learning, AI-powered tools, and comprehensive student management.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-stone-900 mb-4 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2.5">
              {["Home", "Subjects", "Programs", "About", "Blog", "Contact"].map((label) => (
                <li key={label}>
                  <Link
                    href={
                      label === "Home" ? "/home"
                      : label === "Subjects" ? "/courses"
                      : label === "Programs" ? "/ai-learning-programs"
                      : label === "About" ? "/about"
                      : label === "Blog" ? "/blog"
                      : "/contact"
                    }
                    className="text-sm text-stone-500 hover:text-amber-700 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-stone-900 mb-4 uppercase tracking-wider">Programs</h4>
            <ul className="space-y-2.5">
              {[
                { label: "School Classes (Grades 1–8)", href: "/courses?board=sindh_board" },
                { label: "Secondary & Intermediate", href: "/courses" },
                { label: "O/A Levels", href: "/courses?board=cambridge_o" },
                { label: "Board Exam Prep", href: "/courses?board=aku_eb" },
                { label: "AI Programs", href: "/ai-learning-programs" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-stone-500 hover:text-amber-700 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-stone-900 mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-stone-500">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-600" />
                R-156 Salman Garden, Near Jamia Millia Road, Malir 15, Karachi
              </li>
              <li className="flex items-center gap-2.5 text-sm text-stone-500">
                <Phone className="h-4 w-4 flex-shrink-0 text-amber-600" />
                +92 336 3861205
              </li>
              <li className="flex items-center gap-2.5 text-sm text-stone-500">
                <Mail className="h-4 w-4 flex-shrink-0 text-amber-600" />
                wasikherro@gmail.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-stone-400">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-stone-400 hover:text-amber-700 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-stone-400 hover:text-amber-700 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
