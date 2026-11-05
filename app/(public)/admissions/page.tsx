"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { admissionSchema, type AdmissionInput, type EnquiryInput } from "@/lib/validations";
import { submitEnquiry, honeypotValue } from "@/lib/enquiries";
import { isValidSelection } from "@/lib/curriculum";
import { CurriculumSelect, EMPTY_CURRICULUM, type CurriculumValue } from "@/components/forms/curriculum-select";
import { CheckCircle } from "lucide-react";

export default function AdmissionsPage() {
  return (
    // The fallback is what search engines see in the server HTML (the form needs the URL query)
    <Suspense
      fallback={
        <section className="py-16 bg-stone-50 min-h-screen">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <AdmissionsHeading />
          </div>
        </section>
      }
    >
      <AdmissionsForm />
    </Suspense>
  );
}

function AdmissionsHeading() {
  return (
    <div className="text-center mb-10">
      <h1 className="text-4xl font-bold text-stone-900 font-display">Apply for Admission</h1>
      <p className="mt-3 text-lg text-stone-500">
        Start your journey with The Classes in Malir 15, Karachi. Fill out the form below and our team will get in touch.
      </p>
    </div>
  );
}

/** Pre-fill from links like /admissions?stage=higher_secondary&board=fbise&group=bio */
function curriculumFromParams(params: URLSearchParams): CurriculumValue {
  const value = {
    stage: params.get("stage") ?? "",
    board: params.get("board") ?? "",
    group: params.get("group") ?? "",
    subject: params.get("subject") ?? "",
  };
  return isValidSelection(value) ? value : EMPTY_CURRICULUM;
}

function AdmissionsForm() {
  const params = useSearchParams();
  const [curriculum, setCurriculum] = useState<CurriculumValue>(() => curriculumFromParams(params));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdmissionInput>({
    resolver: zodResolver(admissionSchema),
  });

  async function onSubmit(data: AdmissionInput, event?: React.BaseSyntheticEvent) {
    try {
      await submitEnquiry({
        kind: "admission",
        name: data.name,
        email: data.email,
        phone: data.phone,
        stage: (curriculum.stage || undefined) as EnquiryInput["stage"],
        board: curriculum.board || undefined,
        group_code: (curriculum.group || undefined) as EnquiryInput["group_code"],
        subject: curriculum.subject || undefined,
        grade: data.grade,
        message: data.message,
        website: honeypotValue(event),
      });
      toast.success("Application submitted! We'll contact you within 24 hours.");
      reset();
      setCurriculum(EMPTY_CURRICULUM);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <section className="py-16 bg-stone-50 min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <AdmissionsHeading />

        <Card className="border-stone-100 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-stone-900">Admission Application</CardTitle>
            <CardDescription>All fields marked with * are required.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Honeypot: hidden from people, bots fill it in */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              <Input label="Full Name *" placeholder="Enter your full name" error={errors.name?.message} {...register("name")} />
              <div className="grid sm:grid-cols-2 gap-5">
                <Input label="Email *" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
                <Input label="Phone" placeholder="+92 3XX XXXXXXX" {...register("phone")} />
              </div>
              <CurriculumSelect value={curriculum} onChange={setCurriculum} showSubject subjectLabel="Subject of interest" idPrefix="admission" />
              <Input label="Current Grade/Class" placeholder="e.g., Class 10, A1" {...register("grade")} />
              <Textarea label="Additional Message" placeholder="Tell us about your goals..." error={errors.message?.message} {...register("message")} />
              <Button type="submit" className="w-full bg-brand-500 hover:bg-brand-400 text-ink" size="lg" isLoading={isSubmitting}>
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
              <CheckCircle className="h-5 w-5 text-brand-800 flex-shrink-0" />
              {benefit}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
