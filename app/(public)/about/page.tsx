import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Heart, Lightbulb, Users } from "lucide-react";

export const metadata = pageMetadata({
  title: "About The Classes, Coaching Centre in Malir, Karachi",
  description:
    "The Classes is a coaching centre in Malir 15, Karachi founded by Sir Wasi (NED mechanical engineer). Matric, Intermediate, O Level and A Level for all major boards.",
  path: "/about",
});

const values = [
  { icon: Target, title: "Excellence", description: "Highest standards in education delivery and student outcomes." },
  { icon: Heart, title: "Care", description: "Every student receives personalized attention throughout their journey." },
  { icon: Lightbulb, title: "Innovation", description: "Embracing AI and technology to enhance the learning experience." },
  { icon: Users, title: "Community", description: "Building a supportive community of learners, teachers, and parents." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-24 bg-stone-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-800 mb-6">
              Est. 2017 &middot; Karachi, Pakistan
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 font-display leading-tight">
              About <span className="gradient-text">The Classes</span>
            </h1>
            <p className="mt-6 text-lg text-stone-500 leading-relaxed">
              The Classes Education System was founded by{" "}
              <Link href="/about/sir-wasi" className="font-semibold text-stone-900 underline decoration-brand-400 underline-offset-4 hover:decoration-brand-600">Sir Wasi</Link>,
              a Mechanical Engineer from NED University who has been teaching since 2017. Our approach combines strong conceptual
              foundations with exam-oriented preparation — we teach students to understand, not just memorize.
            </p>
            <p className="mt-4 text-lg text-stone-500 leading-relaxed">
              With our campus at R-156 Salman Garden, Malir 15, Karachi, we serve students across grades 1–12,
              Cambridge O/A Levels, and all major Pakistani examination boards including BSEK, FBISE, and AKU-EB.
            </p>
          </div>
          <figure className="overflow-hidden rounded-3xl bg-stone-100 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/campus-front-800.webp"
              srcSet="/images/campus-front-800.webp 800w, /images/campus-front-1440.webp 1440w"
              sizes="(min-width: 1024px) 560px, 100vw"
              width={1440}
              height={1084}
              alt="Front of The Classes campus in Salman Garden, Malir 15, Karachi"
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          </figure>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-stone-900 font-display mb-12">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="mx-auto inline-flex items-center justify-center rounded-xl bg-brand-100 p-4 mb-4">
                  <value.icon className="h-6 w-6 text-brand-800" />
                </div>
                <h3 className="font-semibold text-stone-900 mb-2 font-display">{value.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-24 bg-stone-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-stone-900 font-display mb-6">What We Offer</h2>
              <div className="space-y-4">
                {[
                  "School classes for Grades 1–12 with structured curriculum",
                  "Cambridge O Level and A Level preparation",
                  "Karachi Board (BSEK/BIEK), FBISE, and AKU-EB exam prep",
                  "AI study tools (coming soon)",
                  "Web Basics and Programming fundamentals",
                  "Small-group and classroom-focused learning",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="rounded-full bg-brand-100 p-1 mt-0.5 shrink-0">
                      <svg className="h-3 w-3 text-brand-800" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                    <span className="text-stone-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-stone-900 p-10 text-white">
              <p className="text-2xl font-bold leading-snug font-display">
                &ldquo;We prepare students for the way exams actually work — through understanding, not memorization.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/sir-wasi.webp" alt="" width={56} height={84} loading="lazy" className="h-14 w-14 rounded-full object-cover object-top" />
                <div>
                  <p className="text-brand-500 font-medium">Sir Wasi, Founder</p>
                  <Link href="/about/sir-wasi" className="mt-1 inline-flex items-center gap-1 text-sm text-stone-300 hover:text-white hover:underline">
                    Read his story <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-stone-900 font-display mb-4">Join Us Today</h2>
          <p className="text-lg text-stone-500 mb-8 max-w-2xl mx-auto">
            Whether you&apos;re a student, parent, or educator, there&apos;s a place for you at The Classes.
          </p>
          <Link href="/admissions">
            <Button size="lg" className="bg-brand-500 hover:bg-brand-400 font-display text-ink">
              Apply Now <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
