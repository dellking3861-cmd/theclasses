import Link from "next/link";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link href="/home" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              Pakistan&apos;s premier hybrid education platform combining physical coaching
              centers with online learning and AI-powered tools.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-4">Programs</h4>
            <ul className="space-y-2.5">
              <li><Link href="/courses?board=aku_eb" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">AKU-EB</Link></li>
              <li><Link href="/courses?board=sindh_board" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">Sindh Board</Link></li>
              <li><Link href="/courses?board=cambridge_o" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">Cambridge O Level</Link></li>
              <li><Link href="/courses?board=cambridge_a" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">Cambridge A Level</Link></li>
              <li><Link href="/ai-learning-programs" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">AI Programs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-slate-500">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                Gulshan-e-Iqbal, Karachi, Pakistan
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-500">
                <Phone className="h-4 w-4 flex-shrink-0" />
                +92-21-34876543
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-500">
                <Mail className="h-4 w-4 flex-shrink-0" />
                info@theclasses.pk
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-slate-500 hover:text-indigo-600">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-slate-500 hover:text-indigo-600">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
