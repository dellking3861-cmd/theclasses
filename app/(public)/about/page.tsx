import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Heart, Lightbulb, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about The Classes — Pakistan's premier hybrid education platform.",
};

const values = [
  { icon: Target, title: "Excellence", description: "We strive for the highest standards in education delivery and student outcomes." },
  { icon: Heart, title: "Care", description: "Every student receives personalized attention and support throughout their journey." },
  { icon: Lightbulb, title: "Innovation", description: "We embrace technology and AI to enhance the learning experience." },
  { icon: Users, title: "Community", description: "Building a supportive community of learners, teachers, and parents." },
];

export default function AboutPage() {
  return (
    <>
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-slate-900">About The Classes</h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              Founded in Karachi, The Classes is Pakistan&apos;s leading hybrid education platform
              that bridges the gap between traditional coaching centers and modern online learning.
              We serve students across AKU-EB, Sindh Board, Cambridge O/A Level, and specialized
              programs including AI Web Development and Entry Test Preparation.
            </p>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              With three campus locations and a comprehensive digital platform, we&apos;ve helped
              over 5,000 students achieve their academic goals. Our mission is to make quality
              education accessible, engaging, and effective for every student in Pakistan.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#fff8e7]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center card-3d rounded-2xl bg-white p-8 border border-amber-100">
                <div className="mx-auto inline-flex items-center justify-center rounded-xl bg-amber-50 p-4 mb-4">
                  <value.icon className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-sm text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Join Our Community</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Whether you&apos;re a student, parent, or educator, there&apos;s a place for you at The Classes.
          </p>
          <Link href="/admissions">
            <Button size="lg" className="btn-3d bg-amber-600 hover:bg-amber-700">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
