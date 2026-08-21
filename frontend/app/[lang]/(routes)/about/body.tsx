import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Code2,
  FileCheck2,
  GraduationCap,
  Layers3,
  LockKeyhole,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Locale = "en" | "bn";

interface BodyProps {
  locale: Locale;
}

const content = {
  en: {
    hero: {
      badge: "Mulyayon · মূল্যায়ন",
      title: "A clearer way to manage academic evaluation.",
      description:
        "Mulyayon brings assignments, submissions, evaluation, and feedback together in one focused workspace—so every piece of work has a clear path from creation to completion.",
      primaryAction: "Explore the workflow",
      secondaryAction: "See what powers it",
    },

    stats: [
      {
        value: "3",
        label: "Connected roles",
      },
      {
        value: "1",
        label: "Unified workflow",
      },
      {
        value: "∞",
        label: "Learning cycles",
      },
    ],

    purpose: {
      eyebrow: "Why Mulyayon",
      title: "Turn academic work into a meaningful evaluation loop.",
      description:
        "Academic work often moves through several disconnected steps. Mulyayon brings those steps together so administrators can organize the environment, teachers can evaluate effectively, and students always know where their work stands.",
    },

    roles: {
      eyebrow: "Designed around people",
      title: "Everyone gets the tools they need.",
      description:
        "Instead of putting every feature in one place, Mulyayon gives each role a focused experience built around its responsibilities.",
      items: [
        {
          icon: ShieldCheck,
          title: "Admin",
          description:
            "Builds and maintains the academic structure that keeps everything organized.",
          points: [
            "Manage users and credentials",
            "Configure classes and courses",
            "Create subjects and academic structures",
            "Assign teachers",
            "Monitor platform activity",
          ],
        },
        {
          icon: UserCheck,
          title: "Teacher",
          description:
            "Turns learning objectives into assignments and meaningful evaluation.",
          points: [
            "Create and manage assignments",
            "Set deadlines and maximum marks",
            "Review student submissions",
            "Assign marks and statuses",
            "Provide feedback",
          ],
        },
        {
          icon: GraduationCap,
          title: "Student",
          description:
            "Gets a simple place to discover work, submit solutions, and follow progress.",
          points: [
            "View relevant assignments",
            "Submit solutions",
            "Update active submissions",
            "Track marks",
            "Read teacher feedback",
          ],
        },
      ],
    },

    workflow: {
      eyebrow: "The evaluation loop",
      title: "From an idea to meaningful feedback.",
      description:
        "Mulyayon keeps the journey straightforward. Each stage naturally leads into the next.",
      steps: [
        {
          number: "01",
          icon: Layers3,
          title: "Configure",
          description:
            "The academic environment is organized around classes, courses, subjects, and assigned teachers.",
        },
        {
          number: "02",
          icon: BookOpen,
          title: "Create",
          description:
            "Teachers define assignments with descriptions, deadlines, marks, and clear expectations.",
        },
        {
          number: "03",
          icon: FileCheck2,
          title: "Submit",
          description:
            "Students submit their solutions and can update active submissions within the allowed period.",
        },
        {
          number: "04",
          icon: ClipboardCheck,
          title: "Evaluate",
          description:
            "Teachers review the work, assign marks, update statuses, and provide useful feedback.",
        },
      ],
    },

    technology: {
      eyebrow: "Built with purpose",
      title: "A modern foundation underneath.",
      description:
        "The platform combines a structured API backend, a responsive frontend, and secure role-based access to create a dependable academic workspace.",
      items: [
        {
          icon: Code2,
          title: "ASP.NET Core",
          description:
            "C# Web API following RESTful conventions with structured application architecture.",
        },
        {
          icon: Layers3,
          title: "MongoDB",
          description:
            "Flexible document storage for users, academic structures, assignments, and submissions.",
        },
        {
          icon: Sparkles,
          title: "Next.js + React",
          description:
            "A responsive application experience built with TypeScript and modern React patterns.",
        },
        {
          icon: LockKeyhole,
          title: "Secure by design",
          description:
            "JWT authorization, role validation, and BCrypt password hashing protect access and credentials.",
        },
        {
          icon: MessageSquareText,
          title: "Feedback workflow",
          description:
            "Evaluation is more than a mark—teachers can communicate meaningful feedback with submissions.",
        },
        {
          icon: CheckCircle2,
          title: "Reliable operations",
          description:
            "Serilog logging, global exception handling, and seeded data simplify development and evaluation.",
        },
      ],
    },

    closing: {
      eyebrow: "The idea",
      title: "Make evaluation simple, structured, and visible.",
      description:
        "Mulyayon is designed around a simple principle: academic work should have a clear lifecycle, and everyone involved should understand what happens next.",
      action: "Explore Mulyayon",
    },
  },

  bn: {
    hero: {
      badge: "মূল্যায়ন · Mulyayon",
      title: "একাডেমিক মূল্যায়নকে আরও সহজ ও সুসংগঠিত করার একটি workspace।",
      description:
        "মূল্যায়ন assignment, submission, evaluation এবং feedback-কে একটি focused workspace-এ নিয়ে আসে—যাতে প্রতিটি কাজের শুরু থেকে শেষ পর্যন্ত একটি পরিষ্কার workflow থাকে।",
      primaryAction: "Workflow দেখুন",
      secondaryAction: "প্রযুক্তি দেখুন",
    },

    stats: [
      {
        value: "৩",
        label: "সংযুক্ত রোল",
      },
      {
        value: "১",
        label: "সমন্বিত workflow",
      },
      {
        value: "∞",
        label: "Learning cycle",
      },
    ],

    purpose: {
      eyebrow: "কেন মূল্যায়ন",
      title: "Academic work-কে একটি meaningful evaluation loop-এ নিয়ে আসুন।",
      description:
        "একাডেমিক কাজের বিভিন্ন ধাপ প্রায়ই আলাদা হয়ে যায়। মূল্যায়ন সেই ধাপগুলোকে একসাথে নিয়ে আসে—যাতে Admin পরিবেশটি গুছিয়ে রাখতে পারেন, Teacher কার্যকরভাবে মূল্যায়ন করতে পারেন এবং Student সবসময় নিজের কাজের অবস্থান বুঝতে পারে।",
    },

    roles: {
      eyebrow: "ব্যবহারকারীকে কেন্দ্র করে তৈরি",
      title: "প্রত্যেক রোলের জন্য প্রয়োজনীয় tools।",
      description:
        "সব feature এক জায়গায় না রেখে মূল্যায়ন প্রতিটি রোলের দায়িত্ব অনুযায়ী একটি focused experience প্রদান করে।",
      items: [
        {
          icon: ShieldCheck,
          title: "Admin",
          description:
            "পুরো academic structure তৈরি ও পরিচালনা করে এবং সিস্টেমকে সংগঠিত রাখে।",
          points: [
            "User ও credential পরিচালনা",
            "Class ও course configure করা",
            "Subject ও academic structure তৈরি",
            "Teacher assign করা",
            "Platform activity পর্যবেক্ষণ",
          ],
        },
        {
          icon: UserCheck,
          title: "Teacher",
          description:
            "Learning objective-কে assignment এবং meaningful evaluation-এ রূপ দেয়।",
          points: [
            "Assignment তৈরি ও পরিচালনা",
            "Deadline ও maximum marks নির্ধারণ",
            "Student submission review",
            "Marks ও status প্রদান",
            "Feedback প্রদান",
          ],
        },
        {
          icon: GraduationCap,
          title: "Student",
          description:
            "Assignment দেখা, solution submit করা এবং নিজের progress অনুসরণ করার সহজ workspace।",
          points: [
            "প্রাসঙ্গিক assignment দেখা",
            "Solution submit করা",
            "Active submission update করা",
            "Marks দেখা",
            "Teacher feedback পড়া",
          ],
        },
      ],
    },

    workflow: {
      eyebrow: "মূল্যায়নের ধারা",
      title: "একটি ধারণা থেকে meaningful feedback পর্যন্ত।",
      description:
        "মূল্যায়ন workflow-কে সহজ রাখে। প্রতিটি ধাপ স্বাভাবিকভাবেই পরবর্তী ধাপের দিকে নিয়ে যায়।",
      steps: [
        {
          number: "০১",
          icon: Layers3,
          title: "Configure",
          description:
            "Class, course, subject এবং assigned teacher-এর মাধ্যমে academic environment সাজানো হয়।",
        },
        {
          number: "০২",
          icon: BookOpen,
          title: "Create",
          description:
            "Teacher description, deadline, marks এবং requirements সহ assignment তৈরি করেন।",
        },
        {
          number: "০৩",
          icon: FileCheck2,
          title: "Submit",
          description:
            "Student solution submit করে এবং নির্ধারিত সময়ের মধ্যে active submission update করতে পারে।",
        },
        {
          number: "০৪",
          icon: ClipboardCheck,
          title: "Evaluate",
          description:
            "Teacher কাজ review করে marks, status এবং প্রয়োজনীয় feedback প্রদান করেন।",
        },
      ],
    },

    technology: {
      eyebrow: "উদ্দেশ্যপূর্ণ প্রযুক্তি",
      title: "একটি আধুনিক foundation-এর উপর তৈরি।",
      description:
        "Structured API backend, responsive frontend এবং secure role-based access একসাথে একটি নির্ভরযোগ্য academic workspace তৈরি করেছে।",
      items: [
        {
          icon: Code2,
          title: "ASP.NET Core",
          description:
            "RESTful convention অনুসরণকারী C# Web API এবং structured application architecture।",
        },
        {
          icon: Layers3,
          title: "MongoDB",
          description:
            "User, academic structure, assignment এবং submission-এর জন্য flexible document storage।",
        },
        {
          icon: Sparkles,
          title: "Next.js + React",
          description:
            "TypeScript এবং modern React pattern ব্যবহার করে responsive application experience।",
        },
        {
          icon: LockKeyhole,
          title: "Secure by design",
          description:
            "JWT authorization, role validation এবং BCrypt password hashing ব্যবহার করে access ও credentials সুরক্ষিত রাখা হয়েছে।",
        },
        {
          icon: MessageSquareText,
          title: "Feedback workflow",
          description:
            "Evaluation শুধু marks-এর মধ্যে সীমাবদ্ধ নয়—Teacher submission-এর সাথে meaningful feedback দিতে পারেন।",
        },
        {
          icon: CheckCircle2,
          title: "Reliable operations",
          description:
            "Serilog logging, global exception handling এবং seeded data development ও evaluation সহজ করে।",
        },
      ],
    },

    closing: {
      eyebrow: "মূল ধারণা",
      title: "Evaluation হোক সহজ, structured এবং দৃশ্যমান।",
      description:
        "মূল্যায়ন একটি সহজ ধারণাকে কেন্দ্র করে তৈরি: academic work-এর একটি পরিষ্কার lifecycle থাকা উচিত এবং workflow-এর সাথে যুক্ত প্রত্যেকের জানা উচিত পরবর্তী ধাপে কী ঘটবে।",
      action: "মূল্যায়ন দেখুন",
    },
  },
} as const;

export default function Body({ locale }: BodyProps) {
  const t = content[locale];

  return (
    <main className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-175 overflow-hidden"
      >
        <div className="absolute left-1/2 -top-75 h-150 w-225 -translate-x-1/2 rounded-full bg-primary/[0.07] blur-3xl" />
        <div className="absolute left-[10%] top-87.5 h-40 w-40 rounded-full bg-primary/4 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:py-20">
        {/* Hero */}
        <section className="relative mx-auto max-w-5xl text-center">
          <Badge
            variant="secondary"
            className="rounded-full px-4 py-1.5 text-xs"
          >
            <Sparkles className="mr-1.5 size-3.5" />
            {t.hero.badge}
          </Badge>

          <h1 className="mx-auto mt-7 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t.hero.title}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            {t.hero.description}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#workflow"
              className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-xs transition-all outline-none hover:bg-primary/90 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {t.hero.primaryAction}
              <ArrowRight className="size-4" />
            </a>

            <a
              href="#technology"
              className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full border bg-background px-6 text-sm font-medium shadow-xs transition-all outline-none hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {t.hero.secondaryAction}
            </a>
          </div>

          {/* Product preview */}
          <div className="relative mx-auto mt-14 max-w-4xl">
            <div
              aria-hidden="true"
              className="absolute inset-x-10 bottom-0 h-20 rounded-full bg-primary/10 blur-3xl"
            />

            <Card className="relative overflow-hidden rounded-2xl bg-card/90 text-left shadow-2xl shadow-primary/5 backdrop-blur">
              <div className="flex items-center gap-2 border-b px-5 py-4">
                <div className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-muted" />
                  <span className="size-2.5 rounded-full bg-muted" />
                  <span className="size-2.5 rounded-full bg-muted" />
                </div>

                <div className="mx-auto rounded-md bg-muted/60 px-4 py-1 text-[10px] text-muted-foreground">
                  mulyayon.vercel.app
                </div>

                <div className="w-10" />
              </div>

              <div className="grid md:grid-cols-[180px_1fr]">
                <div className="hidden border-r bg-muted/20 p-4 md:block">
                  <div className="space-y-2">
                    <div className="h-8 rounded-lg bg-primary/10" />
                    <div className="h-7 rounded-lg bg-muted" />
                    <div className="h-7 rounded-lg bg-muted" />
                    <div className="h-7 rounded-lg bg-muted" />
                    <div className="h-7 rounded-lg bg-muted" />
                  </div>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-3 w-24 rounded bg-muted" />
                      <div className="mt-2 h-5 w-40 rounded bg-foreground/10" />
                    </div>

                    <div className="size-9 rounded-full bg-primary/10" />
                  </div>

                  <div className="mt-7 grid gap-3 sm:grid-cols-3">
                    {["Assignments", "Submissions", "Evaluation"].map(
                      (item, index) => (
                        <div
                          key={item}
                          className="rounded-xl border bg-background p-4"
                        >
                          <div className="text-[10px] text-muted-foreground">
                            {item}
                          </div>

                          <div className="mt-2 text-xl font-bold">
                            {index === 0 ? "12" : index === 1 ? "48" : "36"}
                          </div>

                          <div className="mt-2 h-1.5 rounded-full bg-primary/10">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{
                                width:
                                  index === 0
                                    ? "70%"
                                    : index === 1
                                      ? "85%"
                                      : "60%",
                              }}
                            />
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  <div className="mt-3 h-24 rounded-xl border bg-muted/20" />
                </div>
              </div>
            </Card>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-3 overflow-hidden rounded-2xl border bg-card">
            {t.stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`px-3 py-5 sm:px-6 ${
                  index !== t.stats.length - 1 ? "border-r" : ""
                }`}
              >
                <div className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {stat.value}
                </div>

                <div className="mt-1 text-[10px] text-muted-foreground sm:text-xs">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Purpose */}
        <section className="mx-auto mt-28 max-w-5xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <Badge variant="outline" className="rounded-full">
                {t.purpose.eyebrow}
              </Badge>

              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                {t.purpose.title}
              </h2>
            </div>

            <Card className="rounded-3xl shadow-none">
              <CardContent className="p-7 sm:p-9">
                <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <BookOpen className="size-6" />
                </div>

                <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                  {t.purpose.description}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Roles */}
        <section className="mx-auto mt-28 max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="rounded-full">
              {t.roles.eyebrow}
            </Badge>

            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              {t.roles.title}
            </h2>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              {t.roles.description}
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {t.roles.items.map((role) => {
              const Icon = role.icon;

              return (
                <Card
                  key={role.title}
                  className="group rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>

                      <ChevronRight className="size-4 text-muted-foreground/40 transition-transform group-hover:translate-x-1" />
                    </div>

                    <CardTitle className="pt-4">{role.title}</CardTitle>

                    <p className="text-sm leading-6 text-muted-foreground">
                      {role.description}
                    </p>
                  </CardHeader>

                  <CardContent>
                    <Separator className="mb-5" />

                    <ul className="space-y-3">
                      {role.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-2.5 text-xs leading-5 text-muted-foreground"
                        >
                          <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Workflow */}
        <section
          id="workflow"
          className="mx-auto mt-28 max-w-6xl scroll-mt-24"
        >
          <div className="rounded-[2rem] border bg-muted/20 p-7 sm:p-10 lg:p-14">
            <div className="mx-auto max-w-2xl text-center">
              <Badge
                variant="outline"
                className="rounded-full bg-background"
              >
                {t.workflow.eyebrow}
              </Badge>

              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                {t.workflow.title}
              </h2>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {t.workflow.description}
              </p>
            </div>

            <div className="relative mt-12 grid gap-8 md:grid-cols-4">
              <div
                aria-hidden="true"
                className="absolute left-[12%] right-[12%] top-7 hidden h-px bg-border md:block"
              />

              {t.workflow.steps.map((step) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.number}
                    className="relative text-center md:text-left"
                  >
                    <div className="relative mx-auto flex size-14 items-center justify-center rounded-2xl border bg-background text-primary shadow-sm md:mx-0">
                      <Icon className="size-5" />
                    </div>

                    <div className="mt-5 text-xs font-semibold text-primary">
                      {step.number}
                    </div>

                    <h3 className="mt-1 font-semibold">{step.title}</h3>

                    <p className="mt-2 text-xs leading-6 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Technology */}
        <section
          id="technology"
          className="mx-auto mt-28 max-w-6xl scroll-mt-24"
        >
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <Badge variant="outline" className="rounded-full">
                {t.technology.eyebrow}
              </Badge>

              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                {t.technology.title}
              </h2>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {t.technology.description}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {t.technology.items.map((item) => {
                const Icon = item.icon;

                return (
                  <Card
                    key={item.title}
                    className="rounded-2xl shadow-none transition-colors hover:border-primary/30"
                  >
                    <CardContent className="p-5">
                      <div className="flex gap-4">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="size-5" />
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Closing */}
        <section className="mx-auto mt-28 max-w-5xl">
          <Card className="relative overflow-hidden rounded-[2rem] border-primary/20 bg-primary text-primary-foreground shadow-xl">
            <div
              aria-hidden="true"
              className="absolute -right-25 -top-30 size-72 rounded-full border-50 border-primary-foreground/8"
            />

            <CardContent className="relative p-8 sm:p-12 lg:p-14">
              <Badge className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/10">
                <Sparkles className="mr-1.5 size-3.5" />
                {t.closing.eyebrow}
              </Badge>

              <h2 className="mt-6 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
                {t.closing.title}
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-primary-foreground/75 sm:text-base">
                {t.closing.description}
              </p>

              <Button
                variant="secondary"
                size="lg"
                className="mt-8 rounded-full px-6"
              >
                {t.closing.action}
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </CardContent>
          </Card>
        </section>

        <div className="mx-auto mt-16 max-w-5xl">
          <Separator />
        </div>
      </div>
    </main>
  );
}