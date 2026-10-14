"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactInput) {
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll respond within 24 hours.");
    reset();
  }

  return (
    <section className="py-16 bg-[#fefce8] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900">Contact Us</h1>
          <p className="mt-3 text-lg text-slate-600">We&apos;d love to hear from you. Reach out anytime.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            {[
              { icon: MapPin, title: "Visit Us", content: "R-156 Salman Garden, Near Jamia Millia Road, Malir 15, Karachi" },
              { icon: Phone, title: "Call Us", content: "+92 336 3861205" },
              { icon: Mail, title: "Email Us", content: "admissions@theclasses.edu.pk" },
              { icon: Clock, title: "Hours", content: "Mon–Sat: 9:00 AM – 6:00 PM" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="rounded-lg bg-yellow-25 p-3">
                  <item.icon className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{item.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2">
            <Card className="border-yellow-50">
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input label="Name *" error={errors.name?.message} {...register("name")} />
                    <Input label="Email *" type="email" error={errors.email?.message} {...register("email")} />
                  </div>
                  <Input label="Phone" {...register("phone")} />
                  <Input label="Subject *" error={errors.subject?.message} {...register("subject")} />
                  <Textarea label="Message *" error={errors.message?.message} {...register("message")} />
                  <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600" isLoading={isSubmitting}>Send Message</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
