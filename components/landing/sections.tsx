import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  MapPin,
  MessageSquareText,
  Phone,
  PlayCircle,
  Sparkles,
  Star,
  Users,
  UserRoundCheck,
  CalendarCheck,
} from "lucide-react";
import { CONTACT } from "@/lib/constants";
import type { BusinessProfile } from "@/lib/google-business";
import { BOARDS, getOffering } from "@/lib/curriculum";
import { CourseFinder } from "@/components/landing/course-finder";
import { WhatsAppIcon } from "@/components/layout/whatsapp-icon";

const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

function SectionHeading({ eyebrow, title, intro, center = false }: { eyebrow: string; title: string; intro?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-800">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h2>
      {intro && <p className="mt-4 text-lg leading-relaxed text-stone-600">{intro}</p>}
    </div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────

export function HeroSection({ profile }: { profile: BusinessProfile | null }) {
  const heroFacts: { value: string; label: string; href?: string }[] = [
    { value: "7+", label: "years of teaching" },
    { value: "500+", label: "students taught" },
  ];
  if (profile?.rating) {
    heroFacts.push({
      value: `${profile.rating.toFixed(1)}★`,
      label: `${profile.reviewCount} Google reviews`,
      href: profile.mapsUri ?? CONTACT.reviewsHref,
    });
  }
  return (
    <section className="relative overflow-hidden bg-[#fbfaf6]">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-brand-200/40 blur-3xl" aria-hidden="true" />
      <div className={`${container} relative grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:py-24`}>
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3.5 py-1.5 text-sm font-medium text-stone-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            Admissions open · {CONTACT.addressShort}
          </p>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.6rem]">
            Board exam coaching that builds{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10">real understanding</span>
              <span className="absolute inset-x-0 bottom-1 -z-0 h-3 rounded bg-brand-300/70 sm:h-4" aria-hidden="true" />
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600">
            Matric, Intermediate, O Level, IGCSE and A Level for BSEK, BIEK, AKU-EB, FBISE, Cambridge and Edexcel.
            Small batches and regular tests on campus, with recorded lectures and progress reports online.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admissions"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 font-semibold text-ink shadow-sm transition-colors hover:bg-brand-400"
            >
              Apply for admission <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={CONTACT.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-6 font-semibold text-stone-800 transition-colors hover:bg-stone-50"
            >
              <WhatsAppIcon className="h-5 w-5 text-[#1fa855]" /> Ask on WhatsApp
            </a>
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-stone-200 pt-6">
            {heroFacts.map((f) => (
              <div key={f.label}>
                <dt className="sr-only">{f.label}</dt>
                <dd className="font-display text-2xl font-bold text-ink sm:text-3xl">
                  {f.href ? (
                    <a href={f.href} target="_blank" rel="noopener noreferrer" className="hover:underline">{f.value}</a>
                  ) : f.value}
                </dd>
                <dd className="mt-1 text-sm text-stone-500">{f.label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <CourseFinder />
      </div>
    </section>
  );
}

// ─── Boards strip ────────────────────────────────────────────────────────

export function BoardsStrip() {
  return (
    <section aria-label="Boards we teach" className="border-y border-stone-200 bg-white">
      <div className={`${container} flex flex-col items-center gap-4 py-6 sm:flex-row sm:justify-between`}>
        <p className="text-sm font-medium text-stone-500">Exam preparation for</p>
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {BOARDS.map((b) => (
            <li key={b.code} className="font-display text-lg font-semibold tracking-tight text-stone-700" title={b.name}>
              {b.shortName}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ─── Pathways ────────────────────────────────────────────────────────────

const pathways = [
  {
    stage: "secondary" as const,
    title: "Grades 9–10",
    subtitle: "Matric · O Level · IGCSE",
    boardCodes: ["bsek", "aku_eb", "fbise", "cambridge", "edexcel"],
    exampleBoard: "bsek",
  },
  {
    stage: "higher_secondary" as const,
    title: "Grades 11–12",
    subtitle: "Intermediate · A Level",
    boardCodes: ["biek", "aku_eb", "fbise", "cambridge", "edexcel"],
    exampleBoard: "biek",
  },
];

const programs = [
  { title: "School classes", text: "Grades 1–8 across all core subjects.", href: "/courses?stage=programs" },
  { title: "Entry test preparation", text: "Medical and engineering university entry tests.", href: "/courses?stage=programs" },
  { title: "Skills programs", text: "Web development, programming and spoken English.", href: "/ai-learning-programs" },
];

export function PathwaysSection() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className={container}>
        <SectionHeading
          eyebrow="Courses"
          title="A clear path for every grade and board"
          intro="Choose your level and board to see the exact subjects for your group."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {pathways.map((p) => {
            const groups = getOffering(p.exampleBoard, p.stage)?.groups ?? [];
            return (
              <Link
                key={p.stage}
                href={`/courses?stage=${p.stage}&board=${p.exampleBoard}`}
                className="group flex flex-col rounded-2xl border border-stone-200 bg-[#fbfaf6] p-6 transition-colors hover:border-brand-400 sm:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-ink">{p.title}</h3>
                    <p className="mt-1 text-stone-600">{p.subtitle}</p>
                  </div>
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-ink ring-1 ring-stone-200 transition-colors group-hover:bg-brand-500 group-hover:ring-brand-500">
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Groups</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {groups.map((g) => (
                      <li key={g.code} className="rounded-full border border-stone-200 bg-white px-3 py-1 text-sm text-stone-700">
                        {g.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Boards</p>
                  <p className="mt-2 text-sm text-stone-700">
                    {p.boardCodes.map((c) => BOARDS.find((b) => b.code === c)?.shortName).join(" · ")}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {programs.map((p) => (
            <Link key={p.title} href={p.href} className="group rounded-2xl border border-stone-200 p-5 transition-colors hover:border-brand-400">
              <h3 className="flex items-center justify-between font-display text-lg font-semibold text-ink">
                {p.title}
                <ArrowRight className="h-4 w-4 text-stone-400 transition-transform group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
              </h3>
              <p className="mt-1 text-sm text-stone-600">{p.text}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How we teach ────────────────────────────────────────────────────────

const teaching = [
  { icon: Users, title: "Small batches", text: "Limited seats per class, so every student gets attention and can ask questions." },
  { icon: UserRoundCheck, title: "Board-specialist teachers", text: "Teachers who know the BSEK, BIEK, AKU-EB, FBISE, Cambridge and Edexcel papers." },
  { icon: ClipboardCheck, title: "Regular tests", text: "Frequent tests in exam format, with feedback and doubt-clearing sessions." },
  { icon: PlayCircle, title: "Recorded lectures", text: "Missed a class or need a revision? Watch the lecture again online." },
  { icon: BarChart3, title: "Progress for parents", text: "Parents can follow attendance, test results and fees in their own portal." },
  { icon: Sparkles, title: "AI study tools", text: "Practice questions and study plans powered by AI.", badge: "Coming soon" },
];

export function TeachingSection() {
  return (
    <section className="bg-[#fbfaf6] py-20 lg:py-24">
      <div className={container}>
        <SectionHeading
          eyebrow="How we teach"
          title="Classroom teaching, backed by online support"
          intro="Students learn on campus with teachers who know their board, then revise and track progress online."
        />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-3">
          {teaching.map((t) => (
            <li key={t.title} className="bg-white p-6 sm:p-7">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-800">
                <t.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 flex flex-wrap items-center gap-2 font-display text-lg font-semibold text-ink">
                {t.title}
                {t.badge && <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">{t.badge}</span>}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{t.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ─── Reviews (live from Google Business Profile) ─────────────────────

function Stars({ rating, size = "h-4 w-4" }: { rating: number; size?: string }) {
  return (
    <span className="flex" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${size} ${i < Math.round(rating) ? "fill-brand-500 text-brand-500" : "fill-stone-200 text-stone-200"}`} aria-hidden="true" />
      ))}
    </span>
  );
}

export function ReviewsSection({ profile }: { profile: BusinessProfile | null }) {
  const reviewsLink = profile?.mapsUri ?? CONTACT.reviewsHref;
  const written = profile?.reviews.filter((r) => r.text) ?? [];
  const starOnly = profile?.reviews.filter((r) => !r.text) ?? [];

  return (
    <section className="bg-white py-20 lg:py-24">
      <div className={container}>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Reviews" title="What students and parents say" />
          <a
            href={reviewsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 self-start rounded-xl border border-stone-200 px-4 py-3 hover:border-stone-300 md:self-auto"
          >
            {profile?.rating ? (
              <>
                <span className="font-display text-2xl font-bold text-ink">{profile.rating.toFixed(1)}</span>
                <span className="flex flex-col">
                  <Stars rating={profile.rating} />
                  <span className="text-xs text-stone-500">{profile.reviewCount} reviews on Google</span>
                </span>
              </>
            ) : (
              <span className="text-sm font-medium text-stone-700">Read our reviews on Google</span>
            )}
          </a>
        </div>

        {written.length > 0 && (
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {written.slice(0, 3).map((r, i) => (
              <li key={i} className="flex flex-col rounded-2xl border border-stone-200 p-6">
                <Stars rating={r.rating} />
                <blockquote className="mt-4 line-clamp-6 flex-1 leading-relaxed text-stone-700">&ldquo;{r.text}&rdquo;</blockquote>
                <p className="mt-5 text-sm text-stone-500">
                  {r.authorUri ? (
                    <a href={r.authorUri} target="_blank" rel="noopener noreferrer" className="font-medium text-stone-800 hover:underline">{r.author}</a>
                  ) : (
                    <span className="font-medium text-stone-800">{r.author}</span>
                  )}
                  {r.relativeTime && <> · {r.relativeTime}</>}
                </p>
              </li>
            ))}
          </ul>
        )}

        {written.length === 0 && starOnly.length > 0 && (
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {starOnly.slice(0, 6).map((r, i) => (
              <li key={i} className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 px-4 py-3">
                <span className="min-w-0">
                  <span className="block truncate font-medium text-stone-800">{r.author}</span>
                  {r.relativeTime && <span className="block text-xs text-stone-500">{r.relativeTime}</span>}
                </span>
                <Stars rating={r.rating} />
              </li>
            ))}
          </ul>
        )}

        <p className="mt-6 flex items-center gap-2 text-sm text-stone-500">
          <MessageSquareText className="h-4 w-4" aria-hidden="true" />
          Reviews and ratings from Google.{" "}
          <a href={reviewsLink} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-800 hover:underline">
            See all on Google Maps
          </a>
        </p>
      </div>
    </section>
  );
}

// ─── Admission steps + final call to action ──────────────────────────────

const steps = [
  { icon: MessageSquareText, title: "Send an enquiry", text: "Fill in the short form or message us on WhatsApp." },
  { icon: CalendarCheck, title: "Free counselling", text: "We help you pick the right group, board and batch." },
  { icon: GraduationCap, title: "Join your batch", text: "Start classes on campus with online access from day one." },
];

export function AdmissionSection() {
  return (
    <section className="bg-[#fbfaf6] py-20 lg:py-24">
      <div className={container}>
        <SectionHeading eyebrow="Admissions" title="Joining takes three simple steps" center />
        <ol className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-2xl border border-stone-200 bg-white p-6 text-center">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-ink px-2.5 py-0.5 text-xs font-semibold text-white">
                Step {i + 1}
              </span>
              <span className="mx-auto mt-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-800">
                <s.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm text-stone-600">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 overflow-hidden rounded-3xl bg-ink px-6 py-12 text-center sm:px-12 lg:py-16">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Admissions are open for the new session
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-stone-300">
            Talk to us about your board, group and timings. We usually reply within a day.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/admissions" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 font-semibold text-ink hover:bg-brand-400">
              Apply for admission <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a href={CONTACT.phoneHref} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 px-6 font-semibold text-white hover:bg-white/10">
              <Phone className="h-4 w-4" aria-hidden="true" /> {CONTACT.phoneDisplay}
            </a>
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-sm text-stone-400">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" /> {CONTACT.address}
          </p>
          <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-stone-300">
            {["Free counselling session", "Flexible payment plans", "Scholarship opportunities"].map((b) => (
              <li key={b} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-500" aria-hidden="true" /> {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
