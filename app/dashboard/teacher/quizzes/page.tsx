"use client";

import { PageHeader } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Brain, Sparkles } from "lucide-react";
import { SUBJECT_LABELS } from "@/lib/constants";

const subjectOptions = Object.entries(SUBJECT_LABELS).map(([value, label]) => ({ value, label }));
const difficultyOptions = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export default function TeacherQuizGeneratorPage() {
  return (
    <div>
      <PageHeader title="AI Quiz Generator" description="Generate quizzes automatically with AI" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-600" />
            Generate Quiz
            <Sparkles className="h-4 w-4 text-amber-500" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select label="Subject" placeholder="Select subject" options={subjectOptions} />
          <Input label="Topic" placeholder="e.g., Quadratic Equations" />
          <Select label="Difficulty" options={difficultyOptions} />
          <Input label="Number of Questions" type="number" defaultValue="10" />
          <Button className="w-full sm:w-auto">Generate Quiz with AI</Button>
          <p className="text-xs text-slate-500">AI quiz generation requires API configuration. See environment setup.</p>
        </CardContent>
      </Card>
    </div>
  );
}
