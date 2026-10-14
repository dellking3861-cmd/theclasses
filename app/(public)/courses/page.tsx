"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BOARD_LABELS, SUBJECT_LABELS, PROGRAM_LABELS } from "@/lib/constants";
import { formatCurrency } from "@/utils/format";
import { Clock, Users, ArrowRight } from "lucide-react";

const sampleCourses = [
  { id: "1", title: "Mathematics — AKU-EB", slug: "mathematics-aku-eb", course_type: "board" as const, board: "aku_eb", subject: "mathematics", program: null, fee_amount: 15000, duration_months: 12, description: "Comprehensive Mathematics course aligned with AKU-EB curriculum.", is_published: true },
  { id: "2", title: "Physics — Cambridge O Level", slug: "physics-cambridge-o", course_type: "board" as const, board: "cambridge_o", subject: "physics", program: null, fee_amount: 18000, duration_months: 12, description: "Master Physics concepts for Cambridge O Level examinations.", is_published: true },
  { id: "3", title: "Chemistry — Sindh Board", slug: "chemistry-sindh-board", course_type: "board" as const, board: "sindh_board", subject: "chemistry", program: null, fee_amount: 14000, duration_months: 12, description: "Complete Chemistry preparation for Sindh Board students.", is_published: true },
  { id: "4", title: "AI Web Development", slug: "ai-web-development", course_type: "special_program" as const, board: null, subject: null, program: "ai_web_development", fee_amount: 25000, duration_months: 6, description: "Learn modern web development with AI integration tools.", is_published: true },
  { id: "5", title: "Entry Test Preparation", slug: "entry-test-preparation", course_type: "special_program" as const, board: null, subject: null, program: "entry_test_preparation", fee_amount: 20000, duration_months: 4, description: "Intensive preparation for medical and engineering entry tests.", is_published: true },
  { id: "6", title: "Computer Science — Cambridge A Level", slug: "cs-cambridge-a", course_type: "board" as const, board: "cambridge_a", subject: "computer_science", program: null, fee_amount: 22000, duration_months: 12, description: "Advanced Computer Science for Cambridge A Level students.", is_published: true },
];

const filters = [
  { value: "all", label: "All Courses" },
  { value: "board", label: "Board Courses" },
  { value: "special_program", label: "Special Programs" },
];

export default function CoursesPage() {
  const [filter, setFilter] = useState("all");

  const filtered = sampleCourses.filter(
    (c) => filter === "all" || c.course_type === filter
  );

  function getCourseLabel(course: typeof sampleCourses[0]) {
    if (course.course_type === "board") {
      const board = course.board ? BOARD_LABELS[course.board] : "";
      const subject = course.subject ? SUBJECT_LABELS[course.subject] : "";
      return `${subject} — ${board}`;
    }
    return course.program ? PROGRAM_LABELS[course.program] : course.title;
  }

  return (
    <section className="py-16 bg-[#fff8e7] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">Our Courses</h1>
          <p className="mt-3 text-lg text-slate-600">
            Explore our comprehensive range of board courses and special programs.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f.value
                  ? "bg-amber-600 text-white"
                  : "bg-white text-slate-600 hover:bg-amber-50 border border-amber-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <Card key={course.id} hover className="card-3d border-amber-100">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <Badge variant={course.course_type === "board" ? "info" : "success"}>
                    {course.course_type === "board" ? "Board" : "Program"}
                  </Badge>
                  <span className="text-lg font-bold text-amber-700">
                    {formatCurrency(course.fee_amount)}
                  </span>
                </div>
                <CardTitle className="mt-3">{getCourseLabel(course)}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> {course.duration_months} months
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" /> Open enrollment
                  </span>
                </div>
                <Link href="/admissions">
                  <Button variant="outline" className="w-full border-amber-300 text-amber-800 hover:bg-amber-50">
                    Enroll Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
