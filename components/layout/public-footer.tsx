import Link from "next/link";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";
import { Mail, Phone, MapPin } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-amber-200/60 bg-[#fff8e7]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link href="/home" className="flex items-center gap-2.5">
              <img src="/logo.png" alt={APP_NAME} className="h-8 w-auto" />
              <span className="text-lg font-bold text-slate-900">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed">
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
                    className="text-sm text-slate-600 hover:text-amber-700 transition-colors"
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
              <li><Link href="/courses?board=aku_eb" className="text-sm text-slate-600 hover:text-amber-700 transition-colors">AKU-EB</Link></li>
              <li><Link href="/courses?board=sindh_board" className="text-sm text-slate-600 hover:text-amber-700 transition-colors">Sindh Board</Link></li>
              <li><Link href="/courses?board=cambridge_o" className="text-sm text-slate-600 hover:text-amber-700 transition-colors">Cambridge O Level</Link></li>
              <li><Link href="/courses?board=cambridge_a" className="text-sm text-slate-600 hover:text-amber-700 transition-colors">Cambridge A Level</Link></li>
              <li><Link href="/ai-learning-programs" className="text-sm text-slate-600 hover:text-amber-700 transition-colors">AI Programs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-slate-600">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-600" />
                Gulshan-e-Iqbal, Karachi, Pakistan
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-600">
                <Phone className="h-4 w-4 flex-shrink-0 text-amber-600" />
                +92-21-34876543
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-600">
                <Mail className="h-4 w-4 flex-shrink-0 text-amber-600" />
                info@theclasses.pk
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-amber-200/60 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-slate-500 hover:text-amber-700 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-slate-500 hover:text-amber-700 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
