import { Star, ArrowUpRight } from "lucide-react";
import { CONTACT } from "@/lib/constants";

/** Asks students/parents for a Google review (opens Google's review box). */
export function ReviewPrompt({ audience }: { audience: "student" | "parent" }) {
  return (
    <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-brand-200 bg-brand-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex items-start gap-4">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 ring-1 ring-brand-200">
          <Star className="h-5 w-5 fill-brand-500 text-brand-500" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-semibold text-slate-900">
            {audience === "parent" ? "Happy with your child's progress?" : "Enjoying your classes?"}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            A short Google review helps other {audience === "parent" ? "parents" : "students"} find The Classes. It takes less than a minute.
          </p>
        </div>
      </div>
      <a
        href={CONTACT.writeReviewHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 text-sm font-semibold text-ink hover:bg-brand-400"
      >
        Write a Google review <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  );
}
