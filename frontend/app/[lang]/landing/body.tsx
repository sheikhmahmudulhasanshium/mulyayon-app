"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Layers,
  LockKeyhole,
  MessageSquareText,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react"

import { usePublic } from "@/hooks/common/use-public"
import { PublicStats } from "@/types/api"
import SystemHealthIndicator from "@/components/common/SystemHealthIndicator"

interface BodyProps {
  locale: "en" | "bn"
}

const translations = {
  en: {
    badge: "Assignment & Evaluation Platform",

    heroTitle: "Let Your Work Speak.",
    heroSubtitle:
      "A focused academic workspace for managing coursework, collecting submissions, evaluating performance, and turning feedback into progress.",

    accessPortal: "Access Portal",
    learnMore: "How it works",

    workflowTitle: "One workflow. From assignment to outcome.",
    workflowSubtitle:
      "Mulyayon connects the people and steps involved in academic evaluation into one structured flow.",

    workflow: [
      {
        icon: ClipboardCheck,
        title: "Create",
        description: "Teachers define assignments, deadlines, and evaluation criteria.",
      },
      {
        icon: Send,
        title: "Submit",
        description: "Students submit their work and keep track of active coursework.",
      },
      {
        icon: CheckCircle2,
        title: "Evaluate",
        description: "Teachers review submissions, assign marks, and provide feedback.",
      },
      {
        icon: MessageSquareText,
        title: "Improve",
        description: "Students see results and feedback that help them understand their progress.",
      },
    ],

    rolesTitle: "Built around every role.",
    rolesSubtitle:
      "Each person sees the tools and information relevant to their responsibility.",

    roles: [
      {
        icon: ShieldCheck,
        title: "Admin",
        description:
          "Manage users, academic structures, assignments, and platform-level activity.",
      },
      {
        icon: Users,
        title: "Teacher",
        description:
          "Create coursework, review submissions, evaluate performance, and provide feedback.",
      },
      {
        icon: GraduationCap,
        title: "Student",
        description:
          "Discover assignments, submit work, and follow marks and feedback in one place.",
      },
    ],

    statsTitle: "Platform at a glance",
    loadingStats: "Syncing platform metrics...",

    students: "Enrolled Students",
    teachers: "Active Educators",
    courses: "Academic Classes",
    subjects: "Curriculum Subjects",

    trustTitle: "Designed for a clear academic workflow",
    trustDescription:
      "From access control to evaluation, the platform keeps responsibilities separated while keeping the overall process connected.",

    security: "Role-aware access",
    securityDescription:
      "Users see functionality appropriate to their role.",

    evaluation: "Structured evaluation",
    evaluationDescription:
      "Marks, statuses, and feedback stay connected to submissions.",

    organization: "Organized coursework",
    organizationDescription:
      "Assignments, classes, courses, and subjects stay structured.",

    finalTitle: "Ready to see your academic workflow in action?",
    finalDescription:
      "Sign in to access the workspace designed for your role.",
    finalAction: "Enter the portal",
  },

  bn: {
    badge: "Assignment ও Evaluation Platform",

    heroTitle: "কাজ হোক প্রমাণ।",
    heroSubtitle:
      "Coursework পরিচালনা, submission গ্রহণ, performance evaluation এবং feedback-এর মাধ্যমে অগ্রগতি তৈরি করার একটি সুসংগঠিত academic workspace।",

    accessPortal: "পোর্টালে প্রবেশ করুন",
    learnMore: "কীভাবে কাজ করে",

    workflowTitle: "একটি workflow। Assignment থেকে ফলাফল পর্যন্ত।",
    workflowSubtitle:
      "Academic evaluation-এর প্রতিটি গুরুত্বপূর্ণ ধাপ এবং সংশ্লিষ্ট ব্যক্তিদের একটি structured flow-এর মধ্যে নিয়ে আসে মূল্যায়ন।",

    workflow: [
      {
        icon: ClipboardCheck,
        title: "তৈরি",
        description:
          "Teacher assignment, deadline এবং evaluation criteria নির্ধারণ করেন।",
      },
      {
        icon: Send,
        title: "জমা",
        description:
          "Student নিজের coursework সম্পন্ন করে submission প্রদান করে।",
      },
      {
        icon: CheckCircle2,
        title: "মূল্যায়ন",
        description:
          "Teacher submission review করে marks এবং feedback প্রদান করেন।",
      },
      {
        icon: MessageSquareText,
        title: "অগ্রগতি",
        description:
          "Student ফলাফল ও feedback দেখে নিজের অগ্রগতি বুঝতে পারে।",
      },
    ],

    rolesTitle: "প্রতিটি রোলের জন্য তৈরি।",
    rolesSubtitle:
      "প্রত্যেকে নিজের দায়িত্ব অনুযায়ী প্রয়োজনীয় tools এবং information দেখতে পায়।",

    roles: [
      {
        icon: ShieldCheck,
        title: "Admin",
        description:
          "User, academic structure এবং platform-level activity পরিচালনা করুন।",
      },
      {
        icon: Users,
        title: "Teacher",
        description:
          "Coursework তৈরি, submission review, evaluation এবং feedback প্রদান করুন।",
      },
      {
        icon: GraduationCap,
        title: "Student",
        description:
          "Assignment দেখুন, work submit করুন এবং marks ও feedback অনুসরণ করুন।",
      },
    ],

    statsTitle: "Platform-এর এক নজরের চিত্র",
    loadingStats: "Platform metrics sync হচ্ছে...",

    students: "মোট শিক্ষার্থী",
    teachers: "সক্রিয় শিক্ষক",
    courses: "শ্রেণী / কোর্স",
    subjects: "পাঠ্য বিষয়",

    trustTitle: "একটি পরিষ্কার academic workflow-এর জন্য তৈরি",
    trustDescription:
      "Access control থেকে evaluation পর্যন্ত প্রতিটি responsibility আলাদা রাখা হয়েছে, একইসাথে পুরো process-কে একটি connected workflow-এর মধ্যে রাখা হয়েছে।",

    security: "Role-aware access",
    securityDescription:
      "প্রতিটি user তার role অনুযায়ী প্রয়োজনীয় functionality পায়।",

    evaluation: "Structured evaluation",
    evaluationDescription:
      "Marks, status এবং feedback submission-এর সাথে সংযুক্ত থাকে।",

    organization: "Organized coursework",
    organizationDescription:
      "Assignment, class, course এবং subject একটি structured অবস্থায় থাকে।",

    finalTitle: "আপনার academic workflow দেখতে প্রস্তুত?",
    finalDescription:
      "আপনার role অনুযায়ী workspace-এ প্রবেশ করতে sign in করুন।",
    finalAction: "পোর্টালে প্রবেশ করুন",
  },
}

export default function Body({ locale }: BodyProps) {
  const { getPublicStats, loading } = usePublic()
  const [stats, setStats] = React.useState<PublicStats | null>(null)

  const t = translations[locale]

  React.useEffect(() => {
    let isMounted = true

    const loadPublicStats = async () => {
      const data = await getPublicStats()

      if (isMounted && data) {
        setStats(data)
      }
    }

    const timer = setTimeout(loadPublicStats, 0)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [getPublicStats])

  const statistics = [
    {
      icon: GraduationCap,
      value: stats?.totalStudents ?? 0,
      label: t.students,
    },
    {
      icon: Users,
      value: stats?.totalTeachers ?? 0,
      label: t.teachers,
    },
    {
      icon: Layers,
      value: stats?.totalCourses ?? 0,
      label: t.courses,
    },
    {
      icon: BookOpen,
      value: stats?.totalSubjects ?? 0,
      label: t.subjects,
    },
  ]

  return (
    <main className="relative overflow-hidden">
      {/* Background atmosphere */}
     <div
  aria-hidden="true"
  className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-175 overflow-hidden"
>
  <div
    className="
      absolute left-1/2 -top-20 size-160 -translate-x-1/2
      rounded-full blur-[100px]
      bg-primary/[0.14]
      dark:bg-primary/10
    "
  />

  <div
    className="
      absolute left-[5%] top-80 size-52
      rounded-full blur-[90px]
      bg-primary/8
      dark:bg-primary/6
    "
  />

  <div
    className="
      absolute right-[5%] top-72 size-60
      rounded-full blur-[100px]
      bg-primary/[0.07]
      dark:bg-primary/6
    "
  />
</div>

      <div className="container mx-auto px-4 sm:px-6">
        {/* ============================================================
            HERO
        ============================================================ */}
        <section className="mx-auto max-w-4xl py-20 text-center sm:py-24 lg:py-28">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
            <Sparkles className="size-3.5 text-primary" />
            {t.badge}
          </div>

          <h1 className="mx-auto mt-7 max-w-4xl text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            {t.heroTitle}
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            {t.heroSubtitle}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={`/${locale}/sign-in`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t.accessPortal}
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href={`/${locale}/about`}
              className="inline-flex h-11 items-center justify-center rounded-lg border bg-background px-5 text-sm font-medium transition-colors hover:bg-muted"
            >
              {t.learnMore}
            </Link>
          </div>
        </section>

        {/* ============================================================
            WORKFLOW
        ============================================================ */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t.workflowTitle}
            </h2>

            <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
              {t.workflowSubtitle}
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-6xl">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {t.workflow.map((item, index) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.title}
                    className="group relative rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>

                      <span className="text-4xl font-bold tracking-tighter text-muted/50">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="mt-6 text-base font-semibold">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ============================================================
            ROLES
        ============================================================ */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t.rolesTitle}
            </h2>

            <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
              {t.rolesSubtitle}
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
            {t.roles.map((role) => {
              const Icon = role.icon

              return (
                <div
                  key={role.title}
                  className="rounded-2xl border bg-card p-6 shadow-sm"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl bg-muted text-primary">
                    <Icon className="size-5" />
                  </div>

                  <h3 className="mt-5 text-base font-semibold">
                    {role.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {role.description}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* ============================================================
            STATISTICS
        ============================================================ */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t.statsTitle}
            </h2>
          </div>

          <div className="mx-auto mt-10 max-w-5xl">
            {loading && !stats ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                <div className="mx-auto mb-3 size-5 animate-spin rounded-full border-2 border-muted border-t-primary" />
                {t.loadingStats}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {statistics.map((stat) => {
                  const Icon = stat.icon

                  return (
                    <div
                      key={stat.label}
                      className="rounded-2xl border bg-card p-5 text-center shadow-sm sm:p-6"
                    >
                      <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>

                      <p className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                        {stat.value}
                      </p>

                      <p className="mt-1 text-xs font-medium text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* ============================================================
            TRUST / CAPABILITIES
        ============================================================ */}
        <section className="py-16 sm:py-20">
          <div className="rounded-3xl border bg-muted/30 p-7 sm:p-10 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-center">
              <div>
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <LockKeyhole className="size-5" />
                </div>

                <h2 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
                  {t.trustTitle}
                </h2>

                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {t.trustDescription}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    title: t.security,
                    description: t.securityDescription,
                  },
                  {
                    title: t.evaluation,
                    description: t.evaluationDescription,
                  },
                  {
                    title: t.organization,
                    description: t.organizationDescription,
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border bg-background p-5"
                  >
                    <CheckCircle2 className="size-5 text-primary" />

                    <h3 className="mt-4 text-sm font-semibold">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            CTA
        ============================================================ */}
        <section className="py-16 sm:py-20">
          <div className="relative overflow-hidden rounded-[2rem] bg-primary px-7 py-12 text-center text-primary-foreground shadow-xl sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="absolute -right-25 -top-30 size-72 rounded-full border-50 border-primary-foreground/8"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-30 -left-20 size-64 rounded-full border-40 border-primary-foreground/6"
            />

            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t.finalTitle}
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-primary-foreground/75 sm:text-base">
                {t.finalDescription}
              </p>

              <Link
                href={`/${locale}/sign-in`}
                className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-background px-6 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {t.finalAction}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* System health */}
      <SystemHealthIndicator locale={locale} />
    </main>
  )
}