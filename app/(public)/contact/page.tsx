"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react";

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
    toast.success("Message sent! We&apos;ll respond within 24 hours.");
    reset();
  }

  return (
    <section className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-stone-900 font-display">Contact Us</h1>
          <p className="mt-3 text-lg text-stone-500">We&apos;d love to hear from you. Reach out anytime.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Info + Map */}
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: MapPin, title: "Visit Us", content: "R-156 Salman Garden, Malir 15, Karachi" },
                { icon: Phone, title: "Call Us", content: "+92 336 3861205" },
                { icon: Mail, title: "Email Us", content: "wasikherro@gmail.com" },
                { icon: Clock, title: "Hours", content: "Mon–Sat: 9 AM – 6 PM" },
              ].map((item) => (
                <div key={item.title} className="rounded-xl bg-white p-5 border border-stone-100">
                  <div className="rounded-lg bg-amber-100 w-10 h-10 flex items-center justify-center mb-3">
                    <item.icon className="h-5 w-5 text-amber-700" />
                  </div>
                  <h3 className="font-semibold text-stone-900 text-sm">{item.title}</h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>

            {/* Google Maps iframe */}
            <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3695.123456789!2d67.456!3d24.890!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDUzJzI0LjAiTiA2N8KwMjcnMjEuNiIk!5e0!3m2!1sen!2spk!4v1700000000000"
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="The Classes location map"
              />
            </div>
          </div>

          {/* Right: Enquiry form */}
          <div className="space-y-6">
            <Card className="border-stone-100 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-amber-100 p-2.5">
                    <MessageSquare className="h-5 w-5 text-amber-700" />
                  </div>
                  <CardTitle className="font-display text-stone-900">Admission Enquiry</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input label="Full Name *" error={errors.name?.message} {...register("name")} />
                    <Input label="Phone *" error={errors.phone?.message} {...register("phone")} />
                  </div>
                  <Input label="Email *" type="email" error={errors.email?.message} {...register("email")} />
                  <Input label="Student's Class/Grade *" {...register("subject")} />
                  <Textarea label="Message *" error={errors.message?.message} {...register("message")} rows={4} />
                  <Button type="submit" className="bg-amber-600 hover:bg-amber-700 w-full btn-hover" isLoading={isSubmitting}>
                    Submit Enquiry
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Social links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-stone-400">Follow us</span>
              <div className="h-px flex-1 bg-stone-200" />
              {["Facebook", "Instagram", "WhatsApp"].map((platform) => (
                <button key={platform} className="text-sm text-stone-500 hover:text-amber-600 transition-colors">
                  {platform}
                </button>
              ))}
              <div className="h-px flex-1 bg-stone-200" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
