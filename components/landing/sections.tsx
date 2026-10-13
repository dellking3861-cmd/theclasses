import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  { name: "AKU-EB", count: "12 Courses", color: "bg-blue-500" },
  { name: "Sindh Board", count: "10 Courses", color: "bg-emerald-500" },
  { name: "Cambridge O Level", count: "8 Courses", color: "bg-purple-500" },
  { name: "Cambridge A Level", count: "6 Courses", color: "bg-indigo-500" },
  { name: "AI Programs", count: "5 Programs", color: "bg-violet-500" },
  { name: "Entry Test Prep", count: "4 Programs", color: "bg-amber-500" },
];

const testimonials = [
  {
    name: "Ayesha Khan",
    role: "Cambridge A Level Student",
    content: "The Classes transformed my approach to learning. The AI tutor helped me understand complex physics concepts that I struggled with for months.",
    rating: 5,
  },
  {
    name: "Ahmed Hassan",
    role: "Parent",
    content: "The parent dashboard gives me complete visibility into my son's progress. I can track attendance, fees, and exam results all in one place.",
    rating: 5,
  },
  {
    name: "Fatima Ali",
    role: "AKU-EB Student",
    content: "Best coaching center in Karachi. The hybrid model means I never miss a lecture, and the teachers are incredibly supportive.",
    rating: 5,
  },
];

const faculty = [
  { name: "Dr. Sarah Ahmed", subject: "Mathematics", experience: "15 years", qualification: "PhD Mathematics" },
  { name: "Prof. Hassan Raza", subject: "Physics", experience: "12 years", qualification: "MSc Physics" },
  { name: "Ms. Zainab Malik", subject: "Chemistry", experience: "10 years", qualification: "MSc Chemistry" },
  { name: "Mr. Usman Farooq", subject: "Computer Science", experience: "8 years", qualification: "MS CS" },
];

const stats = [
  { value: "5,000+", label: "Students Enrolled" },
  { value: "50+", label: "Expert Teachers" },
  { value: "95%", label: "Success Rate" },
  { value: "3", label: "Campus Locations" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-50/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 mb-6">
              <Sparkles className="h-4 w-4" />
              Pakistan&apos;s #1 Hybrid Education Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
              Future of Learning{" "}
              <span className="gradient-text">Starts Here</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
              Experience world-class education combining physical coaching centers,
              online learning, and AI-powered tools. From AKU-EB to Cambridge, we prepare
              you for success.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/admissions">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Your Journey
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
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

          <div className="relative hidden lg:block animate-float">
            <div className="relative rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 shadow-2xl shadow-indigo-500/20">
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <GraduationCap className="h-8 w-8 text-white" />
                  <div>
                    <p className="text-white font-semibold">Live Classes</p>
                    <p className="text-indigo-200 text-sm">Interactive sessions daily</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <Brain className="h-8 w-8 text-white" />
                  <div>
                    <p className="text-white font-semibold">AI Tutor</p>
                    <p className="text-indigo-200 text-sm">24/7 personalized help</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <Globe className="h-8 w-8 text-white" />
                  <div>
                    <p className="text-white font-semibold">Global Standards</p>
                    <p className="text-indigo-200 text-sm">Cambridge & Board aligned</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section className="py-24 bg-slate-50">
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
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl bg-white p-8 shadow-sm border border-slate-200/60 hover:shadow-lg hover:border-indigo-200 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center rounded-xl bg-indigo-50 p-3 mb-5 group-hover:bg-indigo-100 transition-colors">
                <feature.icon className="h-6 w-6 text-indigo-600" />
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
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href="/courses"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${cat.color} rounded-l-2xl`} />
              <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-sm text-slate-500 mt-1">{cat.count}</p>
              <ArrowRight className="absolute bottom-6 right-6 h-5 w-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Student Success Stories</h2>
          <p className="mt-4 text-lg text-slate-600">
            Hear from students and parents who trust The Classes.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl bg-white p-8 shadow-sm border border-slate-200/60">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Award key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 leading-relaxed mb-6">&ldquo;{t.content}&rdquo;</p>
              <div>
                <p className="font-semibold text-slate-900">{t.name}</p>
                <p className="text-sm text-slate-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
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
          {faculty.map((member) => (
            <div key={member.name} className="text-center group">
              <div className="mx-auto h-24 w-24 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <span className="text-2xl font-bold text-indigo-600">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900">{member.name}</h3>
              <p className="text-sm text-indigo-600 font-medium mt-1">{member.subject}</p>
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
    { title: "Proven Track Record", desc: "95% of our students achieve their target grades in board exams." },
    { title: "Hybrid Flexibility", desc: "Attend physically or online — your choice, same quality education." },
    { title: "AI-Enhanced Learning", desc: "Cutting-edge AI tools for personalized study plans and instant help." },
    { title: "Affordable Excellence", desc: "Premium education at competitive fees with flexible payment options." },
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
              <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
                Learn More About Us
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {reasons.map((reason) => (
              <div key={reason.title} className="rounded-xl bg-slate-800/50 p-6 border border-slate-700/50">
                <h3 className="font-semibold text-white mb-2">{reason.title}</h3>
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
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 px-8 py-16 sm:px-16 sm:py-20 text-center">
          <div className="absolute inset-0 grid-pattern opacity-10" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to Transform Your Learning?
            </h2>
            <p className="mt-4 text-lg text-indigo-100 max-w-2xl mx-auto">
              Join thousands of successful students. Admissions are now open for the new session.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/admissions">
                <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 w-full sm:w-auto">
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
