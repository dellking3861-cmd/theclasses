"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BookOpen,
  Brain,
  Users,
  BarChart3,
  Video,
  Shield,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Globe,
  Award,
  FlaskConical,
  Atom,
  Dna,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Hybrid Learning",
    description: "Seamlessly blend physical classroom sessions with online resources for maximum flexibility.",
  },
  {
    icon: Brain,
    title: "AI-Powered Tools",
    description: "Personal AI tutor, smart quiz generation, and intelligent homework checking at your fingertips.",
  },
  {
    icon: Users,
    title: "Expert Faculty",
    description: "Learn from experienced teachers specializing in AKU-EB, Sindh Board, and Cambridge curricula.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track progress with detailed analytics, attendance reports, and exam performance insights.",
  },
  {
    icon: Video,
    title: "Recorded Lectures",
    description: "Access high-quality recorded lectures anytime, anywhere. Never miss a class again.",
  },
  {
    icon: Shield,
    title: "Parent Monitoring",
    description: "Dedicated parent portal for real-time attendance, grades, and fee payment tracking.",
  },
];

const categories = [
  { name: "AKU-EB", count: "12 Courses", color: "bg-yellow-400" },
  { name: "Sindh Board", count: "10 Courses", color: "bg-emerald-500" },
  { name: "Cambridge O Level", count: "8 Courses", color: "bg-purple-500" },
  { name: "Cambridge A Level", count: "6 Courses", color: "bg-indigo-500" },
  { name: "AI Programs", count: "5 Programs", color: "bg-yellow-500" },
  { name: "Entry Test Prep", count: "4 Programs", color: "bg-orange-500" },
];

const testimonials = [];

const faculty = [
  { name: "Sir Wasi", subject: "Founder & Lead Instructor", experience: "7+ years", qualification: "BSc Mechanical Engineering, NED University" },
];

const stats = [
  { value: "7+", label: "Years of Teaching" },
  { value: "500+", label: "Students Taught" },
  { value: "4.7★", label: "Google Rating" },
  { value: "7", label: "Subject Areas" },
];

const scienceIcons = [FlaskConical, Atom, Dna, GraduationCap];

export function HeroSection() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    setTilt({ x, y });
  }

  return (
    <section className="relative overflow-hidden bg-[#fffbeb]">
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-yellow-25/60 to-transparent" />

      {/* Floating science icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {scienceIcons.map((Icon, i) => (
          <div
            key={i}
            className="absolute opacity-5 text-yellow-500"
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
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-25 px-4 py-1.5 text-sm font-medium text-yellow-600 mb-6">
              <Sparkles className="h-4 w-4" />
              Pakistan&apos;s #1 Hybrid Education Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
              Future of Learning{" "}
              <span className="gradient-text animate-shimmer">Starts Here</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
              Experience world-class education combining physical coaching centers,
              online learning, and AI-powered tools. From AKU-EB to Cambridge, we prepare
              you for success.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/admissions">
                <Button size="lg" className="w-full sm:w-auto btn-3d bg-yellow-500 hover:bg-yellow-600 text-white">
                  Start Your Journey
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-yellow-200 text-yellow-700 hover:bg-yellow-25">
                  Explore Courses
                </Button>
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative hidden lg:block"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          >
            <div
              className="relative rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-700 p-8 shadow-2xl shadow-yellow-400/25"
              style={{
                transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: "transform 0.1s ease-out",
              }}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                  <GraduationCap className="h-8 w-8 text-yellow-100" />
                  <div>
                    <p className="text-white font-semibold">Live Classes</p>
                    <p className="text-yellow-50 text-sm">Interactive sessions daily</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                  <Brain className="h-8 w-8 text-yellow-100" />
                  <div>
                    <p className="text-white font-semibold">AI Tutor</p>
                    <p className="text-yellow-50 text-sm">24/7 personalized help</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                  <Globe className="h-8 w-8 text-yellow-100" />
                  <div>
                    <p className="text-white font-semibold">Global Standards</p>
                    <p className="text-yellow-50 text-sm">Cambridge & Board aligned</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-yellow-300/20 rounded-3xl blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section className="py-24 bg-[#fefce8]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Everything You Need to Succeed
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            A comprehensive platform designed for modern education in Pakistan.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group card-3d rounded-2xl bg-white p-8 shadow-sm border border-yellow-50"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center rounded-xl bg-yellow-25 p-3 mb-5 group-hover:bg-yellow-50 transition-colors">
                <feature.icon className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CourseCategoriesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Course Categories</h2>
          <p className="mt-4 text-lg text-slate-600">
            Comprehensive programs for every board and career path.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <Link
              key={cat.name}
              href="/courses"
              className="group relative overflow-hidden rounded-2xl border border-yellow-50 p-6 hover:shadow-lg hover:border-yellow-100 transition-all duration-300 card-3d"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${cat.color} rounded-l-2xl`} />
              <h3 className="text-lg font-semibold text-slate-900 group-hover:text-yellow-600 transition-colors pl-3">
                {cat.name}
              </h3>
              <p className="text-sm text-slate-500 mt-1 pl-3">{cat.count}</p>
              <ArrowRight className="absolute bottom-6 right-6 h-5 w-5 text-yellow-200 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const googleMapsUrl = "https://share.google/5yBewcTJ3L661jeO5";
  const [data, setData] = useState<{ rating: number; totalReviews: number; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useState(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  });

  const rating = data?.rating ?? 4.4;
  const totalReviews = data?.totalReviews ?? 14;

  return (
    <section className="py-24 bg-[#fefce8]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">What Our Community Says</h2>
          <p className="mt-4 text-lg text-slate-600">
            Google reviews from real students and parents.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-6 mb-12">
              <div className="flex items-center gap-3">
                <span className="text-5xl font-bold text-slate-900">{rating}</span>
                <div className="flex flex-col items-start">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Award
                        key={i}
                        className={`h-5 w-5 ${i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-yellow-100"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-500 mt-1">{totalReviews} Google reviews</span>
                </div>
              </div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white border border-yellow-200 px-6 py-3 hover:border-yellow-400 hover:shadow-md transition-all text-sm font-medium text-slate-700"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Write a Review on Google
              </a>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { rating: 5, text: "Very good coaching institute. Sir Wasi explains concepts clearly and students get good results.", date: "2025" },
                { rating: 5, text: "My son's grades improved significantly after joining. Highly recommended for O Level students.", date: "2025" },
                { rating: 4, text: "Best coaching for mathematics in the area. Regular tests and doubt clearing sessions.", date: "2024" },
              ].map((review, i) => (
                <div key={i} className="rounded-2xl bg-white p-6 shadow-sm border border-yellow-50 card-3d">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Award key={j} className={`h-4 w-4 ${j < review.rating ? "text-yellow-400 fill-yellow-400" : "text-yellow-100"}`} />
                    ))}
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm mb-4">&ldquo;{review.text}&rdquo;</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-xs">G</div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">Google Review</p>
                      <p className="text-xs text-slate-400">{review.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-900">Rate Us on Google</p>
                <p className="text-sm text-slate-500">Read &amp; leave a review</p>
              </div>
              <ArrowRight className="h-5 w-5 text-yellow-500 ml-2" />
            </a>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Award
                    key={i}
                    className={`h-6 w-6 ${i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-yellow-100"}`}
                  />
                ))}
                <span className="ml-2 text-xl font-bold text-slate-900">{rating.toFixed(1)}</span>
                <span className="text-slate-500">({totalReviews} reviews)</span>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {reviews.slice(0, 3).map((review, i) => (
                <div key={i} className="rounded-2xl bg-white p-6 shadow-sm border border-yellow-50 card-3d">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Award key={j} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm mb-4">&ldquo;{review.text}&rdquo;</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-xs">
                      {review.author.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{review.author}</p>
                      <p className="text-xs text-slate-400">{new Date(review.time * 1000).toLocaleDateString("en-PK", { month: "short", year: "numeric" })}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export function FacultySection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Meet Our Faculty</h2>
          <p className="mt-4 text-lg text-slate-600">
            Learn from the best educators in Pakistan.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {faculty.map((member, i) => (
            <div key={member.name} className="text-center group card-3d">
              <div className="mx-auto h-24 w-24 rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <span className="text-2xl font-bold text-yellow-600">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900">{member.name}</h3>
              <p className="text-sm text-yellow-500 font-medium mt-1">{member.subject}</p>
              <p className="text-xs text-slate-500 mt-1">{member.qualification}</p>
              <p className="text-xs text-slate-400 mt-0.5">{member.experience} experience</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyChooseUsSection() {
  const reasons = [
    { title: "Proven Track Record", desc: "7+ years of teaching experience with consistent results." },
    { title: "Hybrid Flexibility", desc: "Attend physically at our Malir campus or access online resources." },
    { title: "AI-Enhanced Learning", desc: "Modern AI tools for personalized study plans and instant help." },
    { title: "Affordable Excellence", desc: "Quality education at competitive fees with flexible payment options." },
  ];

  return (
    <section className="py-24 bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold">Why Choose The Classes?</h2>
            <p className="mt-4 text-lg text-slate-400 leading-relaxed">
              We combine traditional coaching excellence with modern technology
              to deliver an unmatched educational experience.
            </p>
            <Link href="/about" className="inline-block mt-8">
              <Button variant="outline" className="border-yellow-400/50 text-white hover:bg-yellow-800/30 hover:border-yellow-400">
                Learn More About Us
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {reasons.map((reason, i) => (
              <div key={reason.title} className="rounded-xl bg-slate-800/50 p-6 border border-slate-700/50 card-3d">
                <h3 className="font-semibold text-yellow-300 mb-2">{reason.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{reason.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-24 bg-[#fffbeb]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-800 px-8 py-16 sm:px-16 sm:py-20 text-center shadow-2xl shadow-yellow-400/20">
          <div className="absolute inset-0 grid-pattern opacity-10" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to Transform Your Learning?
            </h2>
            <p className="mt-4 text-lg text-yellow-50 max-w-2xl mx-auto">
              Join thousands of successful students. Admissions are now open for the new session.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/admissions">
                <Button size="lg" className="btn-3d bg-white text-yellow-600 hover:bg-yellow-25 w-full sm:w-auto">
                  Apply for Admission
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
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
