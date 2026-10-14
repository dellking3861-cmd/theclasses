"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PROGRAM_LABELS } from "@/lib/constants";
import { formatCurrency } from "@/utils/format";
import {
  Brain,
  MessageSquare,
  FileCheck,
  Mic,
  Calendar,
  FileText,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const aiPrograms = [
  {
    key: "school_classes",
    description: "Structured academic foundation for Grades 1–8 covering all core subjects with interactive AI-powered tools.",
    duration: "12 months",
    fee: 12000,
    features: ["All Core Subjects", "Concept Building", "Homework Support", "Progress Tracking"],
  },
  {
    key: "web_basics",
    description: "Learn HTML, CSS, JavaScript and computational thinking from scratch with hands-on projects.",
    duration: "6 months",
    fee: 20000,
    features: ["HTML & CSS", "JavaScript Basics", "Creative Projects", "Portfolio Building"],
  },
  {
    key: "programming_fundamentals",
    description: "Build strong programming foundations with Python and JavaScript using AI-guided learning paths.",
    duration: "4 months",
    fee: 18000,
    features: ["Python & JavaScript", "Data Structures", "AI Debugging Tools", "Problem Solving"],
  },
  {
    key: "ai_web_development",
    description: "Master modern web development with AI-powered coding assistants, automated testing, and deployment tools.",
    duration: "6 months",
    fee: 25000,
    features: ["React & Next.js", "AI Code Generation", "Full-Stack Projects", "Portfolio Building"],
  },
  {
    key: "spoken_english",
    description: "Improve English fluency with AI-powered speaking practice, pronunciation feedback, and conversation simulations.",
    duration: "3 months",
    fee: 12000,
    features: ["AI Speaking Coach", "Pronunciation Analysis", "Real Conversations", "Confidence Building"],
  },
  {
    key: "freelancing",
    description: "Launch your freelancing career with AI tools for proposal writing, client management, and skill development.",
    duration: "3 months",
    fee: 15000,
    features: ["Upwork & Fiverr", "AI Proposal Writer", "Portfolio Creation", "Client Communication"],
  },
  {
    key: "entry_test_preparation",
    description: "AI-adaptive test preparation for medical and engineering entry tests with personalized study plans.",
    duration: "4 months",
    fee: 25000,
    features: ["Adaptive Testing", "AI Study Planner", "Mock Exams", "Performance Analytics"],
  },
];

const aiModules = [
  { icon: Brain, title: "AI Tutor", description: "24/7 personalized tutoring for any subject" },
  { icon: MessageSquare, title: "Quiz Generator", description: "Auto-generate practice quizzes on any topic" },
  { icon: FileCheck, title: "Homework Checker", description: "Instant feedback on assignments and homework" },
  { icon: Mic, title: "Speaking Practice", description: "AI-powered English speaking coach" },
  { icon: Calendar, title: "Study Planner", description: "Smart study schedules based on your goals" },
  { icon: FileText, title: "Note Generator", description: "AI-generated study notes from any topic" },
];

export default function AILearningProgramsPage() {
  return (
    <>
      <section className="py-24 bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            AI-Powered Education
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold">AI Learning Programs</h1>
          <p className="mt-4 text-lg text-yellow-50 max-w-2xl mx-auto">
            Future-ready programs combining expert instruction with cutting-edge AI tools
            to accelerate your learning journey.
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">AI Tools Included</h2>
          <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            Every program includes access to our suite of AI-powered learning tools.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiModules.map((mod) => (
              <div key={mod.title} className="rounded-xl border border-yellow-50 p-6 hover:border-yellow-200 hover:shadow-md transition-all card-3d">
                <div className="rounded-lg bg-yellow-25 p-3 inline-flex mb-4">
                  <mod.icon className="h-6 w-6 text-yellow-500" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{mod.title}</h3>
                <p className="text-sm text-slate-600">{mod.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#fefce8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Available Programs</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiPrograms.map((program) => (
              <Card key={program.key} hover className="card-3d border-yellow-50">
                <CardHeader>
                  <Badge variant="success" className="w-fit mb-2">AI Program</Badge>
                  <CardTitle>{PROGRAM_LABELS[program.key]}</CardTitle>
                  <CardDescription>{program.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {program.features.map((f) => (
                      <li key={f} className="text-sm text-slate-600 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-4 border-t border-yellow-50">
                    <div>
                      <p className="text-lg font-bold text-yellow-600">{formatCurrency(program.fee)}</p>
                      <p className="text-xs text-slate-500">{program.duration}</p>
                    </div>
                    <Link href="/admissions">
                      <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600">
                        Enroll <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
