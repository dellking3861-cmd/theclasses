"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Brain,
  Users,
  BarChart3,
  Video,
  Shield,
  ArrowRight,
  GraduationCap,
  Globe,
  Award,
  Sparkles,
  FlaskConical,
  Atom,
  Dna,
  CheckCircle2,
  Play,
} from "lucide-react";

// ─── Hero Section ───────────────────────────────────────────────────────────

const heroCards = [
  { icon: GraduationCap, title: "Live Classes", desc: "Interactive sessions daily" },
  { icon: Brain, title: "AI Tutor", desc: "24/7 personalized help" },
  { icon: Globe, title: "Global Standards", desc: "Cambridge & Board aligned" },
];

const heroStats = [
  { value: "7+", label: "Years of Teaching" },
  { value: "500+", label: "Students Taught" },
  { value: "4.7★", label: "Google Rating" },
  { value: "7", label: "Subject Areas" },
];

export function HeroSection() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    setTilt({ x, y });
  }

  return (
    <section className="relative overflow-hidden bg-stone-50">
      {/* Decorative floating icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[FlaskConical, Atom, Dna, GraduationCap].map((Icon, i) => (
          <div
            key={i}
            className="absolute text-amber-300 opacity-[0.08]"
            style={{
              top: `${15 + i * 20}%`,
              right: `${5 + i * 8}%`,
              fontSize: `${48 + i * 12}px`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            <Icon />
          </div>
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left copy */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-700 mb-6">
              <Sparkles className="h-4 w-4" />
              Pakistan&apos;s #1 Hybrid Education Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 leading-[1.1] tracking-tight font-display">
              The Future of
              <br />
              <span className="gradient-text animate-shimmer">Learning Starts</span>
              <br />
              Here
            </h1>
            <p className="mt-6 text-lg text-stone-500 leading-relaxed max-w-xl">
              Experience world-class education combining physical coaching centers,
              online learning, and AI-powered tools. From AKU-EB to Cambridge, we prepare
              you for success.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/admissions">
                <Button size="lg" className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white btn-hover font-display">
                  Start Your Journey
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-stone-300 text-stone-700 hover:bg-stone-100 hover:border-stone-400 font-display">
                  Explore Subjects
                </Button>
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-stone-900 font-display">{stat.value}</p>
                  <p className="text-sm text-stone-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right interactive card */}
          <div
            className="relative hidden lg:block"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          >
            <div
              className="relative rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-8 shadow-2xl shadow-amber-400/20"
              style={{
                transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: "transform 0.1s ease-out",
              }}
            >
              <div className="space-y-4">
                {heroCards.map((card, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20"
                  >
                    <div className="rounded-lg bg-white/20 p-2.5">
                      <card.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{card.title}</p>
                      <p className="text-amber-100 text-sm">{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -inset-4 bg-amber-300/20 rounded-3xl blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Trust / Teaching Section ──────────────────────────────────────────────

const trustFeatures = [
  { icon: Shield, title: "Verified Faculty", desc: "Experienced teachers specializing in AKU-EB, Sindh Board, and Cambridge curricula." },
  { icon: Brain, title: "AI-Powered Tools", desc: "Personal AI tutor, smart quiz generation, and intelligent homework checking." },
  { icon: Video, title: "Recorded Lectures", desc: "Access high-quality recorded lectures anytime, anywhere. Never miss a class." },
  { icon: BarChart3, title: "Performance Tracking", desc: "Detailed analytics, attendance reports, and exam performance insights." },
  { icon: Users, title: "Parent Dashboard", desc: "Real-time attendance, grades, and progress tracking for parents." },
  { icon: BookOpen, title: "Hybrid Learning", desc: "Seamlessly blend physical classroom sessions with online resources." },
];

export function TrustSection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 font-display">
            Trusted by Students & Parents Across Karachi
          </h2>
          <p className="mt-4 text-lg text-stone-500">
            A comprehensive platform designed for modern education in Pakistan.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {trustFeatures.map((feature, i) => (
            <div
              key={feature.title}
              className="group rounded-2xl bg-stone-50 p-8 border border-stone-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center rounded-xl bg-amber-100 p-3 mb-5 group-hover:bg-amber-200 transition-colors">
                <feature.icon className="h-6 w-6 text-amber-700" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2 font-display">{feature.title}</h3>
              <p className="text-stone-500 leading-relaxed text-sm">{(feature as { desc: string; description?: string }).description ?? (feature as { desc: string }).desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Subjects Grid ─────────────────────────────────────────────────────────

const subjects = [
  { name: "Mathematics", icon: "∑", href: "/courses?subject=mathematics" },
  { name: "Physics", icon: "⚛", href: "/courses?subject=physics" },
  { name: "Chemistry", icon: "⬡", href: "/courses?subject=chemistry" },
  { name: "Biology", icon: "❋", href: "/courses?subject=bio" },
  { name: "Computer Science", icon: "</>", href: "/courses?subject=cs" },
  { name: "Exam Prep", icon: "✦", href: "/courses" },
];

export function SubjectsSection() {
  return (
    <section className="py-24 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="info" className="mb-4 text-xs uppercase tracking-wider">Our Subjects</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 font-display">
            Subjects We Cover
          </h2>
          <p className="mt-4 text-lg text-stone-500">
            Comprehensive programs across all major boards and exam systems.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, i) => (
            <Link
              key={subject.name}
              href={subject.href}
              className="group relative overflow-hidden rounded-2xl bg-white p-8 border border-stone-100 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl font-display text-amber-500 group-hover:text-amber-600 transition-colors">
                  {subject.icon}
                </span>
                <ArrowRight className="h-5 w-5 text-stone-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 font-display group-hover:text-amber-700 transition-colors">
                {subject.name}
              </h3>
              <p className="text-sm text-stone-400 mt-1">All boards • Available now</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Programs Grid ─────────────────────────────────────────────────────────

const programs = [
  { name: "School Classes", desc: "Foundation courses for Grades 1–8 with structured curriculum", href: "/courses" },
  { name: "Secondary Level", desc: "Classes 9–10 preparation for Sindh Board & FBISE", href: "/courses" },
  { name: "Intermediate", desc: "FUERS & HSSC prep across all subjects", href: "/courses" },
  { name: "O / A Levels", desc: "Cambridge International curriculum coaching", href: "/courses?board=cambridge_o" },
  { name: "Board Exam Prep", desc: "AKU-EB, BSEK, BIEK exam-focused preparation", href: "/courses?board=aku_eb" },
  { name: "International Curricula", desc: "Curated programs aligned with global standards", href: "/ai-learning-programs" },
];

export function ProgramsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="info" className="mb-4 text-xs uppercase tracking-wider">Programs</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 font-display">
            Programs for Every Stage
          </h2>
          <p className="mt-4 text-lg text-stone-500">
            From primary foundation to international certification.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, i) => (
            <Link
              key={program.name}
              href={program.href}
              className="group rounded-2xl bg-stone-50 p-8 border border-stone-100 hover:border-amber-200 hover:bg-amber-50/40 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-stone-900 font-display group-hover:text-amber-700 transition-colors">
                    {program.name}
                  </h3>
                  <p className="text-sm text-stone-500 mt-2 leading-relaxed">{program.desc}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-stone-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why Choose Us ─────────────────────────────────────────────────────────

const reasons = [
  { title: "Proven Track Record", desc: "7+ years of teaching experience with consistent results across all boards." },
  { title: "Hybrid Flexibility", desc: "Attend physically at our Malir campus or access resources online anytime." },
  { title: "AI-Enhanced Learning", desc: "Modern AI tools for personalized study plans and instant doubt clearing." },
  { title: "Small Batch Sizes", desc: "Focused attention with limited seats per class for better outcomes." },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-24 bg-stone-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 mb-6 text-xs uppercase tracking-wider">Why Choose Us</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-display leading-tight">
              Why Students & Parents
              <br />
              <span className="text-amber-400">Trust The Classes</span>
            </h2>
            <p className="mt-6 text-lg text-stone-400 leading-relaxed">
              We combine traditional coaching excellence with modern technology
              to deliver an unmatched educational experience.
            </p>
            <Link href="/about" className="inline-block mt-8">
              <Button variant="outline" className="border-stone-600 text-white hover:bg-stone-800 hover:border-stone-500 font-display">
                Learn More About Us
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {reasons.map((reason) => (
              <div key={reason.title} className="rounded-xl bg-stone-800/60 p-6 border border-stone-700/50">
                <CheckCircle2 className="h-5 w-5 text-amber-400 mb-3" />
                <h3 className="font-semibold text-white font-display mb-1">{reason.title}</h3>
                <p className="text-sm text-stone-400 leading-relaxed">{reason.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── AI / Modern Learning Section ──────────────────────────────────────────

const aiFeatures = [
  { icon: Brain, title: "AI-Powered Tutor", desc: "Get instant help with homework, concepts, and practice problems." },
  { icon: BarChart3, title: "Smart Analytics", desc: "Track progress, identify weak areas, and improve with data-driven insights." },
  { icon: Video, title: "Recorded Sessions", desc: "Missed a class? Catch up anytime with our complete lecture archive." },
  { icon: Globe, title: "Global Resources", desc: "Access curated materials from top institutions worldwide." },
];

export function AISection() {
  return (
    <section className="py-24 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="info" className="mb-4 text-xs uppercase tracking-wider">Modern Learning</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 font-display">
            AI-Enhanced Education
          </h2>
          <p className="mt-4 text-lg text-stone-500">
            Leveraging technology to make learning more personal, effective, and accessible.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiFeatures.map((feature) => (
            <div key={feature.title} className="rounded-2xl bg-white p-8 border border-stone-100 hover:border-amber-200 hover:shadow-md hover:shadow-amber-50 transition-all duration-300 text-center">
              <div className="inline-flex items-center justify-center rounded-xl bg-amber-100 p-3 mb-5">
                <feature.icon className="h-6 w-6 text-amber-700" />
              </div>
              <h3 className="text-base font-semibold text-stone-900 font-display mb-2">{feature.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Results Section (placeholder per reference) ───────────────────────────

export function ResultsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <Badge variant="info" className="mb-4 text-xs uppercase tracking-wider">Results</Badge>
        <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 font-display">
          Our Students&apos; Success Stories
        </h2>
        <p className="mt-4 text-lg text-stone-500 max-w-2xl mx-auto">
          Consistent results across AKU-EB, Cambridge, and Sindh Board examinations.
        </p>
        <div className="mt-12 grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            { value: "95%+", label: "Pass Rate" },
            { value: "A* Grade", label: "Top Scorer" },
            { value: "100+", label: "Distinctions" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-bold text-amber-600 font-display">{stat.value}</p>
              <p className="text-sm text-stone-500 mt-2 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials Section ──────────────────────────────────────────────────

export function TestimonialsSection() {
  const reviews = [
    { rating: 5, text: "Very good coaching institute. Sir Wasi explains concepts clearly and students get good results.", date: "2025" },
    { rating: 5, text: "My son's grades improved significantly after joining. Highly recommended for O Level students.", date: "2025" },
    { rating: 4, text: "Best coaching for mathematics in the area. Regular tests and doubt clearing sessions.", date: "2024" },
  ];

  return (
    <section className="py-24 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="info" className="mb-4 text-xs uppercase tracking-wider">Testimonials</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 font-display">
            What Our Community Says
          </h2>
          <p className="mt-4 text-lg text-stone-500">
            Google reviews from real students and parents.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {reviews.map((review, i) => (
            <div key={i} className="rounded-2xl bg-white p-8 border border-stone-100 hover:border-amber-200 transition-colors">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Award
                    key={j}
                    className={`h-4 w-4 ${j < review.rating ? "text-amber-400 fill-amber-400" : "text-stone-200"}`}
                  />
                ))}
              </div>
              <p className="text-stone-600 leading-relaxed text-sm mb-6">&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs">G</div>
                <div>
                  <p className="font-semibold text-stone-900 text-sm">Google Review</p>
                  <p className="text-xs text-stone-400">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Admissions CTA ────────────────────────────────────────────────────────

export function CTASection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-stone-900 px-8 py-16 sm:px-16 sm:py-20 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-transparent" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
              Ready to Begin Your Journey?
            </h2>
            <p className="mt-4 text-lg text-stone-400 max-w-2xl mx-auto">
              Admissions are now open for the new session. Secure your spot today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/admissions">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white btn-hover font-display">
                  Apply for Admission
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-stone-600 text-white hover:bg-stone-800 hover:border-stone-500 font-display">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Legacy exports (keep for backwards compat until all imports update) ──
export const FeaturesSection = TrustSection;
export const CourseCategoriesSection = SubjectsSection;
