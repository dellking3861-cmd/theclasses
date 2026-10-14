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
  { id: "1", title: "Mathematics — Karachi Board", slug: "mathematics-bsek", course_type: "board" as const, board: "sindh_board", subject: "mathematics", program: null, fee_amount: 15000, duration_months: 12, description: "Comprehensive Mathematics for Grades 9–12 aligned with BSEK curriculum.", is_published: true },
  { id: "2", title: "Physics — Cambridge O Level", slug: "physics-cambridge-o", course_type: "board" as const, board: "cambridge_o", subject: "physics", program: null, fee_amount: 18000, duration_months: 12, description: "Master Physics concepts for Cambridge O Level examinations.", is_published: true },
  { id: "3", title: "Chemistry — Karachi Board", slug: "chemistry-bsek", course_type: "board" as const, board: "sindh_board", subject: "chemistry", program: null, fee_amount: 14000, duration_months: 12, description: "Complete Chemistry preparation for Sindh Board students.", is_published: true },
  { id: "4", title: "Biology — AKU-EB", slug: "biology-aku-eb", course_type: "board" as const, board: "aku_eb", subject: "biology", program: null, fee_amount: 16000, duration_months: 12, description: "AKU-EB aligned Biology with lab-focused conceptual learning.", is_published: true },
  { id: "5", title: "English — Cambridge A Level", slug: "english-cambridge-a", course_type: "board" as const, board: "cambridge_a", subject: "english", program: null, fee_amount: 17000, duration_months: 12, description: "Advanced English Language and Literature for A Level students.", is_published: true },
  { id: "6", title: "Web Basics & Programming", slug: "web-basics-programming", course_type: "special_program" as const, board: null, subject: null, program: "web_basics", fee_amount: 20000, duration_months: 6, description: "Learn HTML, CSS, JavaScript and computational thinking from scratch.", is_published: true },
  { id: "7", title: "School Foundation (Grades 1–8)", slug: "school-foundation", course_type: "special_program" as const, board: null, subject: null, program: "school_classes", fee_amount: 12000, duration_months: 12, description: "Structured academic support for young learners across all subjects with AI tools.", is_published: true },
  { id: "8", title: "Physics — Karachi Board", slug: "physics-bsek", course_type: "board" as const, board: "sindh_board", subject: "physics", program: null, fee_amount: 15000, duration_months: 12, description: "Full Physics coverage for Sindh Board intermediate and matric students.", is_published: true },
  { id: "9", title: "Mathematics — Cambridge O Level", slug: "math-cambridge-o", course_type: "board" as const, board: "cambridge_o", subject: "mathematics", program: null, fee_amount: 18000, duration_months: 12, description: "IGCSE Mathematics with focus on problem-solving and exam technique.", is_published: true },
  { id: "10", title: "Entry Test Preparation", slug: "entry-test-prep", course_type: "special_program" as const, board: null, subject: null, program: "entry_test_preparation", fee_amount: 25000, duration_months: 4, description: "Intensive preparation for medical and engineering university entry tests.", is_published: true },
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
    <section className="py-16 bg-[#fefce8] min-h-screen">
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
                  ? "bg-yellow-500 text-white"
                  : "bg-white text-slate-600 hover:bg-yellow-25 border border-yellow-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <Card key={course.id} hover className="card-3d border-yellow-50">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <Badge variant={course.course_type === "board" ? "info" : "success"}>
                    {course.course_type === "board" ? "Board" : "Program"}
                  </Badge>
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
                  <Button variant="outline" className="w-full border-yellow-200 text-yellow-700 hover:bg-yellow-25">
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
