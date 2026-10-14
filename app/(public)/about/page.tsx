import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Heart, Lightbulb, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about The Classes — Pakistan's premier hybrid education platform.",
};

const values = [
  { icon: Target, title: "Excellence", description: "We strive for the highest standards in education delivery and student outcomes." },
  { icon: Heart, title: "Care", description: "Every student receives personalized attention and support throughout their journey." },
  { icon: Lightbulb, title: "Innovation", description: "We embrace technology and AI to enhance the learning experience." },
  { icon: Users, title: "Community", description: "Building a supportive community of learners, teachers, and parents." },
];

export default function AboutPage() {
  return (
    <>
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-25 px-4 py-1.5 text-sm font-medium text-yellow-600 mb-6">
              Est. 2017 · Karachi, Pakistan
            </div>
            <h1 className="text-4xl font-bold text-slate-900">About The Classes</h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              The Classes Education System was founded by <strong>Sir Wasi</strong>,
              a Mechanical Engineer from NED University of Engineering & Technology
              who has been teaching since 2017. Our approach combines strong conceptual
              foundations with exam-oriented preparation — we teach students to understand,
              not just memorize.
            </p>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              With our campus located at R-156 Salman Garden, Malir 15, Karachi, we serve
              students across grades 1–12, Cambridge O/A Levels, and all major Pakistani
              examination boards including BSEK, FBISE, and AKU-EB. We are building a strong
              interest in AI-powered education and modern EdTech to make quality learning
              accessible to every student.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#fefce8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center card-3d rounded-2xl bg-white p-8 border border-yellow-50">
                <div className="mx-auto inline-flex items-center justify-center rounded-xl bg-yellow-25 p-4 mb-4">
                  <value.icon className="h-6 w-6 text-yellow-500" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-sm text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">What We Offer</h2>
              <div className="space-y-4">
                {[
                  "School classes for Grades 1–12 with structured curriculum",
                  "Cambridge O Level and A Level preparation",
                  "Karachi Board (BSEK/BIEK), FBISE, and AKU-EB exam prep",
                  "AI-powered learning tools and resources",
                  "Web Basics and Programming fundamentals",
                  "Small-group and classroom-focused learning",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="rounded-full bg-yellow-50 p-1 mt-0.5">
                      <svg className="h-3 w-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 p-10 text-white shadow-xl">
              <p className="text-2xl font-bold leading-snug">
                &ldquo;We prepare students for the way exams actually work — through understanding, not memorization.&rdquo;
              </p>
              <p className="mt-4 text-yellow-50 font-medium">— Sir Wasi, Founder</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#fefce8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Join Us Today</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Whether you&apos;re a student, parent, or educator, there&apos;s a place for you at The Classes.
          </p>
          <Link href="/admissions">
            <Button size="lg" className="btn-3d bg-yellow-500 hover:bg-yellow-600">
              Apply Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
