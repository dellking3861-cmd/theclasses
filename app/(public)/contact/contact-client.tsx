"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { submitEnquiry, honeypotValue } from "@/lib/enquiries";
import { Mail, Phone, MapPin, Clock, MessageSquare, Navigation } from "lucide-react";
import { CONTACT } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/layout/whatsapp-icon";

export function ContactClient({ hours }: { hours: string[] }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactInput, event?: React.BaseSyntheticEvent) {
    try {
      await submitEnquiry({
        kind: "contact",
        name: data.name,
        email: data.email,
        phone: data.phone,
        grade: data.subject,
        subject: `Enquiry for ${data.subject}`,
        message: data.message,
        website: honeypotValue(event),
      });
      toast.success("Message sent! We'll respond within 24 hours.");
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <section className="min-h-screen bg-[#fbfaf6]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-ink font-display">Contact us</h1>
          <p className="mt-3 text-lg text-stone-500">We&apos;d love to hear from you. Reach out anytime.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Info + Map */}
          <div className="space-y-8">
            <ul className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: MapPin, title: "Visit us", content: CONTACT.address, href: CONTACT.mapsHref, external: true },
                { icon: Phone, title: "Call us", content: CONTACT.phoneDisplay, href: CONTACT.phoneHref },
                { icon: Mail, title: "Email us", content: CONTACT.email, href: `mailto:${CONTACT.email}` },
                { icon: Clock, title: "Hours", content: hours.join("\n") },
              ].map((item) => {
                const body = (
                  <>
                    <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100">
                      <item.icon className="h-5 w-5 text-brand-800" aria-hidden="true" />
                    </span>
                    <span className="block text-sm font-semibold text-stone-900">{item.title}</span>
                    <span className="mt-1 block whitespace-pre-line break-words text-sm leading-relaxed text-stone-600">{item.content}</span>
                  </>
                );
                return (
                  <li key={item.title}>
                    {item.href ? (
                      <a
                        href={item.href}
                        {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="block h-full rounded-xl border border-stone-200 bg-white p-5 transition-colors hover:border-brand-400"
                      >
                        {body}
                      </a>
                    ) : (
                      <div className="h-full rounded-xl border border-stone-200 bg-white p-5">{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="overflow-hidden rounded-2xl border border-stone-200">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(CONTACT.address)}&output=embed`}
                width="100%"
                height="280"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Map showing The Classes campus in Malir 15, Karachi"
              />
            </div>
          </div>

          {/* Right: Enquiry form */}
          <div className="space-y-6">
            <Card className="border-stone-100 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-brand-100 p-2.5">
                    <MessageSquare className="h-5 w-5 text-brand-800" />
                  </div>
                  <CardTitle className="font-display text-stone-900">Admission Enquiry</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  {/* Honeypot: hidden from people, bots fill it in */}
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input label="Full Name *" error={errors.name?.message} {...register("name")} />
                    <Input label="Phone *" error={errors.phone?.message} {...register("phone")} />
                  </div>
                  <Input label="Email *" type="email" error={errors.email?.message} {...register("email")} />
                  <Input label="Student's Class/Grade *" placeholder="e.g., Class 10, O Level, A1" error={errors.subject?.message} {...register("subject")} />
                  <Textarea label="Message *" error={errors.message?.message} {...register("message")} rows={4} />
                  <Button type="submit" className="bg-brand-500 hover:bg-brand-400 w-full text-ink" isLoading={isSubmitting}>
                    Submit Enquiry
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid gap-2 sm:grid-cols-3">
              <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white text-sm font-semibold text-stone-800 hover:bg-stone-50">
                <WhatsAppIcon className="h-5 w-5 text-[#1fa855]" /> WhatsApp
              </a>
              <a href={CONTACT.phoneHref} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white text-sm font-semibold text-stone-800 hover:bg-stone-50">
                <Phone className="h-4 w-4" aria-hidden="true" /> Call now
              </a>
              <a href={CONTACT.mapsHref} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white text-sm font-semibold text-stone-800 hover:bg-stone-50">
                <Navigation className="h-4 w-4" aria-hidden="true" /> Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
