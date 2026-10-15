"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { BOARD_LABELS, SUBJECT_LABELS } from "@/lib/constants";
import { CheckCircle } from "lucide-react";

const boardOptions = Object.entries(BOARD_LABELS).map(([value, label]) => ({ value, label }));
const subjectOptions = Object.entries(SUBJECT_LABELS).map(([value, label]) => ({ value, label }));

export default function AdmissionsPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput & { board?: string; subject?: string; grade?: string }>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactInput) {
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Application submitted successfully! We'll contact you within 24 hours.");
    reset();
  }

  return (
    <section className="py-16 bg-stone-50 min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-stone-900 font-display">Apply for Admission</h1>
          <p className="mt-3 text-lg text-stone-500">
            Start your journey with The Classes. Fill out the form below and our team will get in touch.
          </p>
        </div>

        <Card className="border-stone-100 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-stone-900">Admission Application</CardTitle>
            <CardDescription>All fields marked with * are required.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input label="Full Name *" placeholder="Enter your full name" error={errors.name?.message} {...register("name")} />
              <div className="grid sm:grid-cols-2 gap-5">
                <Input label="Email *" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
                <Input label="Phone" placeholder="+92 3XX XXXXXXX" {...register("phone")} />
              </div>
              <Select label="Board" placeholder="Select board" options={boardOptions} {...register("board" as keyof ContactInput)} />
              <Select label="Subject" placeholder="Select subject" options={subjectOptions} {...register("subject" as keyof ContactInput)} />
              <Input label="Current Grade/Class" placeholder="e.g., Class 10, A1" {...register("grade" as keyof ContactInput)} />
              <Input label="Subject of Inquiry *" placeholder="Admission inquiry" error={errors.subject?.message} {...register("subject")} />
              <Textarea label="Additional Message" placeholder="Tell us about your goals..." error={errors.message?.message} {...register("message")} />
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 btn-hover" size="lg" isLoading={isSubmitting}>
                Submit Application
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-10 grid sm:grid-cols-3 gap-6">
          {[
            "Free counseling session",
            "Flexible payment plans",
            "Scholarship opportunities",
          ].map((benefit) => (
            <div key={benefit} className="flex items-center gap-2 text-sm text-stone-600">
              <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
              {benefit}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
