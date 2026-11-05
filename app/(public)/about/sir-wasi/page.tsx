import Link from "next/link";
import { ArrowRight, BookOpenCheck, GraduationCap, PlayCircle, Sparkles, Target, Atom, Sigma, Globe } from "lucide-react";
import { CONTACT } from "@/lib/constants";
import { FOUNDER, breadcrumbJsonLd, founderJsonLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { WhatsAppIcon } from "@/components/layout/whatsapp-icon";
import { LinkedInIcon } from "@/components/layout/social-icons";

export const metadata = pageMetadata({
  title: "Sir Wasi: Maths & Physics Teacher and Founder, Malir, Karachi",
  description:
    "Meet Sir Wasi, founder of The Classes in Malir 15, Karachi. NED mechanical engineer teaching Mathematics and Physics since 2017 for BSEK, BIEK, AKU-EB, FBISE and Cambridge, and university entry tests.",
  path: "/about/sir-wasi",
  type: "profile",
  image: { url: FOUNDER.photoJpg, width: 320, height: 481, alt: "Sir Wasi, founder of The Classes" },
});

const container = "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8";

const facts = [
  { value: "2017", label: "teaching since" },
  { value: "500+", label: "students taught" },
  { value: "5×", label: "growth in enrolment" },
  { value: "80%+", label: "entry test success" },
];

const subjects = [
  {
    icon: Sigma,
    title: "Matric (Grades 9–10)",
    text: "Mathematics, Physics, Chemistry and Computer Science.",
    tags: ["BSEK", "AKU-EB", "FBISE"],
  },
  {
    icon: Atom,
    title: "Intermediate (Grades 11–12)",
    text: "Mathematics and Physics with full board exam preparation.",
    tags: ["BIEK", "AKU-EB", "FBISE"],
  },
  {
    icon: Globe,
    title: "O Level & A Level",
    text: "Mathematics, Additional Mathematics, Physics and Statistics.",
    tags: ["Cambridge", "Add Maths", "Statistics"],
  },
  {
    icon: Target,
    title: "University entry tests",
    text: "Preparation for engineering and business admission tests, with practice papers modelled on the real exams.",
    tags: ["NED", "FAST", "NUST", "IBA", "KU"],
  },
];

const journey = [
  { when: "2017 – 2018", title: "Assistant Teacher, IJK Schooling System", text: "Intermediate Mathematics and Physics, with focused practice on past-paper numericals." },
  { when: "2018 – present", title: "University test prep instructor", text: "Entry test coaching for NED, FAST, NUST, IBA and Karachi University, with an 80%+ success rate." },
  { when: "2019 – present", title: "Founder and Head of Mathematics & Physics, The Classes", text: "Built The Classes in Malir 15 and grew enrolment five times by pairing strong teaching with clear systems for tests, attendance and parent updates." },
  { when: "2023", title: "Mathematics Teacher, IJK Schooling System", text: "Grades 6–8 Mathematics, including Saturday support classes for students who needed extra help." },
  { when: "2024", title: "Physics & Mathematics Teacher, Shaheen Higher Secondary School", text: "Grades 9–10 on the BSEK syllabus with structured, interactive lesson plans." },
  { when: "2024", title: "Mathematics & Physics Teacher, The Learning Space", text: "Grades 9–10 on the AKU-EB syllabus, with custom learning material and classroom demonstrations." },
  { when: "2025 – present", title: "AI and EdTech", text: "Builds AI tools for learning, such as a study notes generator and an exam guess-paper analyser, and brings them into The Classes." },
];

export default function FounderPage() {
  return (
    <>
      <JsonLd data={founderJsonLd()} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/home" }, { name: "About", path: "/about" }, { name: "Sir Wasi", path: "/about/sir-wasi" }])} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#fbfaf6]">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-brand-200/40 blur-3xl" aria-hidden="true" />
        <div className={`${container} relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1fr_340px] lg:gap-16`}>
          <div>
            <nav aria-label="Breadcrumb" className="text-sm text-stone-500">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li><Link href="/about" className="hover:text-ink hover:underline">About</Link></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-stone-700">Sir Wasi</li>
              </ol>
            </nav>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-brand-800">Founder, The Classes</p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">
              Sir Wasi
              <span className="mt-2 block text-2xl font-semibold text-stone-600 sm:text-3xl">Muhammad Wasi</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-600">
              A mechanical engineer from NED University who has taught Mathematics and Physics since 2017. Sir Wasi
              founded The Classes in Malir 15, Karachi, in 2019, and still teaches its Mathematics and Physics batches. He has
              prepared students for BSEK, BIEK, AKU-EB, FBISE and Cambridge exams, and for university entry tests.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/admissions"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 font-semibold text-ink shadow-sm hover:bg-brand-400"
              >
                Book a free counselling session <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href={CONTACT.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-6 font-semibold text-stone-800 hover:bg-stone-50"
              >
                <WhatsAppIcon className="h-5 w-5 text-[#1fa855]" /> Message on WhatsApp
              </a>
            </div>
          </div>
          <figure className="order-first mx-auto w-full max-w-[220px] sm:max-w-[280px] lg:order-none lg:max-w-[340px]">
            <div className="overflow-hidden rounded-3xl bg-stone-200 shadow-lg ring-1 ring-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={FOUNDER.photo}
                width={320}
                height={481}
                alt="Sir Wasi (Muhammad Wasi), founder of The Classes, Karachi"
                fetchPriority="high"
                className="aspect-[2/3] h-auto w-full object-cover"
              />
            </div>
            <figcaption className="mt-3 flex items-center justify-center gap-2 text-sm text-stone-500">
              <GraduationCap className="h-4 w-4 text-brand-800" aria-hidden="true" /> B.E. Mechanical Engineering, NED University
            </figcaption>
          </figure>
        </div>
        <div className={`${container} relative pb-14`}>
          <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-stone-200 bg-white p-5 sm:grid-cols-4 sm:p-6">
            {facts.map((f) => (
              <div key={f.label} className="text-center">
                <dd className="font-display text-3xl font-bold text-ink">{f.value}</dd>
                <dt className="mt-1 text-sm text-stone-500">{f.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Teaching approach */}
      <section className="bg-white py-20">
        <div className={`${container} grid gap-10 lg:grid-cols-2 lg:gap-16`}>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-800">How he teaches</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">Understanding first, then exam technique</h2>
            <p className="mt-5 text-lg leading-relaxed text-stone-600">
              Years in the classroom showed Sir Wasi how students actually learn: they remember what they understand. Every
              topic starts from the concept, moves to worked examples and ends with past-paper practice in the style of
              the student&apos;s own board.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-stone-600">
              His engineering background shows in how The Classes runs: regular tests, tracked progress and clear reports
              for parents, so problems are caught early rather than at result time.
            </p>
          </div>
          <blockquote className="flex flex-col justify-center rounded-3xl bg-ink p-8 text-white sm:p-10">
            <p className="font-display text-2xl font-semibold leading-snug">
              &ldquo;I combine teaching experience, engineering thinking and technology to make learning more effective.&rdquo;
            </p>
            <footer className="mt-5 text-brand-500">Sir Wasi</footer>
          </blockquote>
        </div>
      </section>

      {/* Subjects */}
      <section className="bg-[#fbfaf6] py-20">
        <div className={container}>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-800">What he teaches</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">Mathematics and Physics across every major board</h2>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {subjects.map((s) => (
              <li key={s.title} className="rounded-2xl border border-stone-200 bg-white p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-800">
                  <s.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-stone-600">{s.text}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <li key={t} className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700">{t}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Journey */}
      <section className="bg-white py-20">
        <div className={container}>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-800">Teaching journey</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">From classroom to The Classes</h2>
          <ol className="mt-10 space-y-0 border-l-2 border-brand-200 pl-6 sm:pl-8">
            {journey.map((j) => (
              <li key={j.title} className="relative pb-8 last:pb-0">
                <span className="absolute -left-[33px] top-1.5 h-4 w-4 rounded-full border-4 border-white bg-brand-500 ring-1 ring-brand-300 sm:-left-[41px]" aria-hidden="true" />
                <p className="text-sm font-semibold text-brand-800">{j.when}</p>
                <h3 className="mt-1 font-display text-lg font-semibold text-ink">{j.title}</h3>
                <p className="mt-1 max-w-3xl text-stone-600">{j.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Vision + links */}
      <section className="bg-[#fbfaf6] py-20">
        <div className={`${container} grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16`}>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-800">Vision</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">Technology that supports teachers</h2>
            <p className="mt-5 text-lg leading-relaxed text-stone-600">
              &ldquo;My vision is a future where every student has access to personalised learning that adapts to their
              needs. Through The Classes, I&apos;m building a place where technology amplifies human teaching rather than
              replacing it, and where data helps teachers understand and nurture each student&apos;s potential.&rdquo;
            </p>
            <p className="mt-4 flex items-center gap-2 text-stone-600">
              <Sparkles className="h-4 w-4 text-brand-800" aria-hidden="true" />
              Students get recorded lectures, online tests and progress reports alongside their classes.
            </p>
          </div>
          <div className="rounded-3xl border border-stone-200 bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-ink">Learn with Sir Wasi online</h2>
            <ul className="mt-4 space-y-2">
              <li>
                <a href={FOUNDER.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-stone-50">
                  <PlayCircle className="h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
                  <span><span className="block font-medium text-stone-800">UstaadG on YouTube</span><span className="block text-sm text-stone-500">Free lessons, including Sindh Board Maths for Class 9 and 10</span></span>
                </a>
              </li>
              <li>
                <a href={FOUNDER.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-stone-50">
                  <LinkedInIcon className="h-5 w-5 shrink-0 text-[#0a66c2]" />
                  <span><span className="block font-medium text-stone-800">LinkedIn</span><span className="block text-sm text-stone-500">Professional background</span></span>
                </a>
              </li>
              <li>
                <a href={FOUNDER.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-stone-50">
                  <BookOpenCheck className="h-5 w-5 shrink-0 text-brand-800" aria-hidden="true" />
                  <span><span className="block font-medium text-stone-800">Portfolio</span><span className="block text-sm text-stone-500">Projects in AI and education</span></span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20">
        <div className={`${container} text-center`}>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">Study Maths and Physics with Sir Wasi</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-stone-600">
            Visit our campus at {CONTACT.address}, or send an enquiry and we&apos;ll call you back.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/admissions" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 font-semibold text-ink hover:bg-brand-400">
              Apply for admission <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/contact" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-stone-300 px-6 font-semibold text-stone-800 hover:bg-stone-50">
              Get directions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
