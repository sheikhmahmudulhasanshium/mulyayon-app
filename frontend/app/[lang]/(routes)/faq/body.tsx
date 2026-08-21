import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  FileCheck2,
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
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Locale = "en" | "bn";

interface BodyProps {
  locale: Locale;
}

const content = {
  en: {
    hero: {
      badge: "Help Center · মূল্যায়ন",
      title: "Questions are part of the journey.",
      description:
        "Find quick answers about how Mulyayon works, who can use it, how assignments move through the system, and how evaluation stays secure and organized.",
    },

    categories: [
      {
        icon: CircleHelp,
        title: "General",
        description: "The basics of Mulyayon and its purpose.",
      },
      {
        icon: UserCheck,
        title: "Roles",
        description: "What Admins, Teachers, and Students can do.",
      },
      {
        icon: FileCheck2,
        title: "Assignments",
        description: "Creating, submitting, and evaluating coursework.",
      },
      {
        icon: LockKeyhole,
        title: "Security",
        description: "Authentication, authorization, and credentials.",
      },
    ],

    sections: [
      {
        title: "About Mulyayon",
        description:
          "Understand the platform and the problem it is designed to solve.",
        questions: [
          {
            question: "What is Mulyayon?",
            answer:
              "Mulyayon is an assignment and evaluation management platform that connects administrators, teachers, and students through a structured academic workflow. It provides a shared environment for organizing academic structures, creating assignments, collecting submissions, evaluating work, and communicating feedback.",
          },
          {
            question: "What is the main goal of the platform?",
            answer:
              "The goal is to make the academic evaluation process clear, organized, and traceable. Instead of treating assignments, submissions, marks, and feedback as separate activities, Mulyayon connects them into one continuous workflow.",
          },
          {
            question: "Who is Mulyayon designed for?",
            answer:
              "Mulyayon is designed around three primary roles: Admin, Teacher, and Student. Each role receives capabilities relevant to its responsibilities while participating in the same overall evaluation lifecycle.",
          },
        ],
      },

      {
        title: "Roles & Permissions",
        description:
          "Each role has a focused set of responsibilities and capabilities.",
        questions: [
          {
            question: "What can an Admin do?",
            answer:
              "Admins can manage user accounts, configure classes and courses, create academic structures, assign teachers to subjects or classes, and monitor platform-level statistics and activity.",
          },
          {
            question: "What can a Teacher do?",
            answer:
              "Teachers can create and manage assignments, define descriptions and deadlines, set maximum marks, review student submissions, assign marks and statuses, and provide feedback.",
          },
          {
            question: "What can a Student do?",
            answer:
              "Students can view assignments associated with their academic context, submit solutions, modify eligible submissions before the deadline, and track marks and teacher feedback.",
          },
          {
            question: "Can every user access every part of the system?",
            answer:
              "No. Access is role-aware. The platform separates capabilities according to the user's role so that administrative, teaching, and student workflows remain focused and appropriately protected.",
          },
        ],
      },

      {
        title: "Assignments & Submissions",
        description:
          "Everything around creating coursework and turning it in.",
        questions: [
          {
            question: "What information can a Teacher define for an assignment?",
            answer:
              "An assignment can include its title, description, deadline, maximum marks, and other information required to communicate the expected work clearly to students.",
          },
          {
            question: "Can an assignment be saved before publishing?",
            answer:
              "Yes. Teachers can work with assignments in a draft state before making them available as part of the active coursework workflow.",
          },
          {
            question: "Can Students update a submission?",
            answer:
              "Eligible active submissions can be modified before the applicable deadline. Once the submission reaches a restricted state or the deadline has passed, further changes can be prevented according to the platform rules.",
          },
          {
            question: "What happens after a Student submits?",
            answer:
              "The submission becomes available for the Teacher's evaluation workflow. The Teacher can review the work, assign a mark, update its status, and provide feedback.",
          },
        ],
      },

      {
        title: "Evaluation & Feedback",
        description:
          "How submitted work becomes useful academic feedback.",
        questions: [
          {
            question: "How are submissions evaluated?",
            answer:
              "Teachers review submitted coursework and record the appropriate marks and status. They can also provide feedback so students understand the result beyond a numerical score.",
          },
          {
            question: "Can a Teacher change an evaluation?",
            answer:
              "The evaluation workflow is designed to allow authorized Teachers to update marks, statuses, and feedback when the platform's rules permit it.",
          },
          {
            question: "Can Students see their marks?",
            answer:
              "Yes. Once evaluation information is available to the Student, the relevant marks and teacher comments can be viewed through the student's academic workflow.",
          },
        ],
      },

      {
        title: "Security & Technology",
        description:
          "The foundations behind authentication and application reliability.",
        questions: [
          {
            question: "How is authentication handled?",
            answer:
              "The application uses JWT-based authentication. Authenticated requests can be associated with the appropriate user identity and role before protected operations are performed.",
          },
          {
            question: "How are passwords protected?",
            answer:
              "Passwords are stored using BCrypt hashing rather than being retained as plain text.",
          },
          {
            question: "Does the platform enforce role-based access?",
            answer:
              "Yes. Role validation is part of the application's access-control model, helping ensure that users can only perform operations appropriate to their role.",
          },
          {
            question: "What technologies power Mulyayon?",
            answer:
              "The platform uses Next.js, React, and TypeScript on the frontend, with ASP.NET Core and C# powering the backend API. MongoDB provides data storage, while structured logging and centralized exception handling support reliable operation.",
          },
        ],
      },
    ],

    cta: {
      eyebrow: "Still exploring?",
      title: "The best workflow is one you can understand.",
      description:
        "Mulyayon keeps academic work connected from configuration to feedback, giving every role a clear view of what happens next.",
      action: "Explore how it works",
    },
  },

  bn: {
    hero: {
      badge: "Help Center · মূল্যায়ন",
      title: "প্রশ্ন থাকাটাও journey-এর একটি অংশ।",
      description:
        "মূল্যায়ন কীভাবে কাজ করে, কে কী করতে পারে, assignment কীভাবে workflow-এর মধ্য দিয়ে যায় এবং evaluation কীভাবে নিরাপদ ও সংগঠিত থাকে—এসবের সাধারণ উত্তর এখানে পাওয়া যাবে।",
    },

    categories: [
      {
        icon: CircleHelp,
        title: "সাধারণ",
        description: "মূল্যায়ন এবং এর উদ্দেশ্য সম্পর্কে প্রাথমিক তথ্য।",
      },
      {
        icon: UserCheck,
        title: "রোল",
        description: "Admin, Teacher এবং Student কী করতে পারেন।",
      },
      {
        icon: FileCheck2,
        title: "Assignment",
        description: "Assignment তৈরি, submission এবং evaluation।",
      },
      {
        icon: LockKeyhole,
        title: "নিরাপত্তা",
        description: "Authentication, authorization এবং credentials।",
      },
    ],

    sections: [
      {
        title: "মূল্যায়ন সম্পর্কে",
        description:
          "Platform এবং এটি কোন সমস্যার সমাধানের জন্য তৈরি তা সম্পর্কে জানুন।",
        questions: [
          {
            question: "মূল্যায়ন কী?",
            answer:
              "মূল্যায়ন একটি assignment এবং evaluation management platform, যা Admin, Teacher এবং Student-কে একটি structured academic workflow-এর মাধ্যমে যুক্ত করে। Academic structure তৈরি, assignment তৈরি, submission সংগ্রহ, evaluation এবং feedback—সবগুলো কাজ একটি সমন্বিত environment-এ পরিচালনা করা যায়।",
          },
          {
            question: "Platform-এর মূল লক্ষ্য কী?",
            answer:
              "Academic evaluation process-কে সহজ, সুসংগঠিত এবং traceable করা। Assignment, submission, marks এবং feedback-কে আলাদা কাজ হিসেবে না দেখে একটি continuous workflow হিসেবে পরিচালনা করাই এর মূল লক্ষ্য।",
          },
          {
            question: "মূল্যায়ন কার জন্য তৈরি?",
            answer:
              "মূল্যায়ন মূলত তিনটি রোলকে কেন্দ্র করে তৈরি: Admin, Teacher এবং Student। প্রত্যেক রোল তার দায়িত্ব অনুযায়ী নির্দিষ্ট capability পায় এবং সবাই একই evaluation lifecycle-এর অংশ হিসেবে কাজ করে।",
          },
        ],
      },

      {
        title: "রোল ও Permissions",
        description:
          "প্রতিটি রোলের জন্য নির্দিষ্ট দায়িত্ব এবং capability রয়েছে।",
        questions: [
          {
            question: "Admin কী করতে পারেন?",
            answer:
              "Admin user account পরিচালনা, class ও course configure, academic structure তৈরি, subject বা class-এর সাথে teacher assign এবং platform-level statistics ও activity পর্যবেক্ষণ করতে পারেন।",
          },
          {
            question: "Teacher কী করতে পারেন?",
            answer:
              "Teacher assignment তৈরি ও পরিচালনা, description ও deadline নির্ধারণ, maximum marks সেট করা, student submission review, marks ও status প্রদান এবং feedback দিতে পারেন।",
          },
          {
            question: "Student কী করতে পারেন?",
            answer:
              "Student নিজের academic context-এর assignment দেখতে, solution submit করতে, deadline-এর আগে eligible submission পরিবর্তন করতে এবং marks ও teacher feedback দেখতে পারেন।",
          },
          {
            question: "সব user কি সব অংশে access করতে পারেন?",
            answer:
              "না। Access role-aware। Admin, Teacher এবং Student-এর workflow আলাদা capability অনুযায়ী পরিচালিত হয়, যাতে প্রত্যেক ব্যবহারকারী নিজের দায়িত্বের মধ্যে থেকে কাজ করতে পারেন।",
          },
        ],
      },

      {
        title: "Assignment ও Submission",
        description:
          "Coursework তৈরি করা থেকে submission দেওয়া পর্যন্ত।",
        questions: [
          {
            question: "Teacher assignment-এ কী কী তথ্য দিতে পারেন?",
            answer:
              "Assignment-এ title, description, deadline, maximum marks এবং শিক্ষার্থীদের কাজের প্রত্যাশা পরিষ্কার করার জন্য প্রয়োজনীয় অন্যান্য তথ্য দেওয়া যায়।",
          },
          {
            question: "Assignment কি publish করার আগে save করা যায়?",
            answer:
              "হ্যাঁ। Teacher assignment draft অবস্থায় তৈরি ও সংরক্ষণ করতে পারেন এবং প্রস্তুত হলে active coursework workflow-এর অংশ করতে পারেন।",
          },
          {
            question: "Student কি submission পরিবর্তন করতে পারে?",
            answer:
              "Eligible active submission নির্ধারিত deadline-এর আগে পরিবর্তন করা যায়। Submission restricted হয়ে গেলে বা deadline শেষ হয়ে গেলে platform rules অনুযায়ী পরিবর্তন বন্ধ হয়ে যেতে পারে।",
          },
          {
            question: "Student submit করার পর কী হয়?",
            answer:
              "Submission Teacher-এর evaluation workflow-এ যায়। Teacher কাজ review করে marks ও status দিতে এবং feedback প্রদান করতে পারেন।",
          },
        ],
      },

      {
        title: "Evaluation ও Feedback",
        description:
          "Submitted work কীভাবে meaningful academic feedback-এ পরিণত হয়।",
        questions: [
          {
            question: "Submission কীভাবে evaluate করা হয়?",
            answer:
              "Teacher submitted coursework review করে appropriate marks এবং status প্রদান করেন। পাশাপাশি numerical score-এর বাইরে শিক্ষার্থীর জন্য meaningful feedback দেওয়া যায়।",
          },
          {
            question: "Teacher কি evaluation পরিবর্তন করতে পারেন?",
            answer:
              "Platform-এর নিয়ম অনুযায়ী authorized Teacher marks, status এবং feedback update করতে পারেন।",
          },
          {
            question: "Student কি নিজের marks দেখতে পারে?",
            answer:
              "হ্যাঁ। Evaluation information Student-এর জন্য available হলে সংশ্লিষ্ট marks এবং teacher comments student workflow-এর মাধ্যমে দেখা যায়।",
          },
        ],
      },

      {
        title: "Security ও Technology",
        description:
          "Authentication এবং application reliability-এর পেছনের foundation।",
        questions: [
          {
            question: "Authentication কীভাবে পরিচালিত হয়?",
            answer:
              "Application JWT-based authentication ব্যবহার করে। Protected operation-এর আগে authenticated request-এর সাথে user identity এবং role যাচাই করা যায়।",
          },
          {
            question: "Password কীভাবে সুরক্ষিত রাখা হয়?",
            answer:
              "Password plain text হিসেবে সংরক্ষণ করা হয় না। BCrypt hashing ব্যবহার করে password সুরক্ষিত রাখা হয়।",
          },
          {
            question: "Platform কি role-based access ব্যবহার করে?",
            answer:
              "হ্যাঁ। Application-এর access-control model-এর অংশ হিসেবে role validation ব্যবহৃত হয়, যাতে user তার role-এর উপযুক্ত operation-ই করতে পারেন।",
          },
          {
            question: "মূল্যায়নে কোন technologies ব্যবহার করা হয়েছে?",
            answer:
              "Frontend-এ Next.js, React এবং TypeScript এবং backend API-তে ASP.NET Core ও C# ব্যবহার করা হয়েছে। MongoDB data storage-এর জন্য ব্যবহৃত হয়েছে এবং structured logging ও centralized exception handling application reliability বাড়াতে সাহায্য করে।",
          },
        ],
      },
    ],

    cta: {
      eyebrow: "আরও জানতে চান?",
      title: "যে workflow বোঝা যায়, সেটিই সবচেয়ে কার্যকর।",
      description:
        "মূল্যায়ন configuration থেকে feedback পর্যন্ত academic work-কে সংযুক্ত রাখে এবং প্রতিটি রোলকে পরবর্তী ধাপ সম্পর্কে পরিষ্কার ধারণা দেয়।",
      action: "কীভাবে কাজ করে দেখুন",
    },
  },
} as const;

export default function Body({ locale }: BodyProps) {
  const t = content[locale];

  return (
    <main className="relative overflow-hidden">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-150 overflow-hidden"
      >
        <div className="absolute left-1/2 -top-70 size-150 -translate-x-1/2 rounded-full bg-primary/[0.07] blur-3xl" />
        <div className="absolute right-[5%] top-75 size-40 rounded-full bg-primary/4 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:py-20">
        {/* Hero */}
        <section className="mx-auto max-w-4xl text-center">
          <Badge
            variant="secondary"
            className="rounded-full px-4 py-1.5"
          >
            <Sparkles className="mr-1.5 size-3.5" />
            {t.hero.badge}
          </Badge>

          <h1 className="mt-7 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t.hero.title}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            {t.hero.description}
          </p>
        </section>

        {/* Category cards */}
        <section className="mx-auto mt-14 max-w-5xl">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {t.categories.map((category) => {
              const Icon = category.icon;

              return (
                <Card
                  key={category.title}
                  className="rounded-2xl shadow-none transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
                >
                  <CardContent className="p-5">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>

                    <h2 className="mt-4 text-sm font-semibold">
                      {category.title}
                    </h2>

                    <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* FAQ sections */}
        <section className="mx-auto mt-20 max-w-4xl">
          <div className="space-y-12">
            {t.sections.map((section, sectionIndex) => (
              <div key={section.title}>
                {sectionIndex > 0 && <Separator className="mb-12" />}

                <div className="mb-6">
                  <h2 className="text-2xl font-bold tracking-tight">
                    {section.title}
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </div>

                <div className="overflow-hidden rounded-2xl border bg-card">
                  {section.questions.map((item) => (
                    <details
                      key={item.question}
                      className="group border-b last:border-b-0"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-5 py-5 text-sm font-medium transition-colors hover:bg-muted/40 [&::-webkit-details-marker]:hidden sm:px-6"
                    >
                        <span>{item.question}</span>

                        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                      </summary>

                      <div className="px-5 pb-5 sm:px-6">
                        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                          {item.answer}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick reassurance */}
        <section className="mx-auto mt-20 max-w-4xl">
          <Card className="rounded-3xl bg-muted/30 shadow-none">
            <CardContent className="p-7 sm:p-9">
              <div className="grid gap-7 sm:grid-cols-3">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />

                  <div>
                    <h3 className="text-sm font-semibold">
                      {locale === "bn"
                        ? "Role-aware"
                        : "Role-aware access"}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {locale === "bn"
                        ? "প্রতিটি রোল তার প্রয়োজনীয় capability পায়।"
                        : "Each role gets the capabilities it needs."}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <LockKeyhole className="mt-0.5 size-5 shrink-0 text-primary" />

                  <div>
                    <h3 className="text-sm font-semibold">
                      {locale === "bn"
                        ? "Secure credentials"
                        : "Secure credentials"}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {locale === "bn"
                        ? "Authentication ও password protection-এর জন্য নিরাপদ পদ্ধতি।"
                        : "Secure approaches for authentication and passwords."}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />

                  <div>
                    <h3 className="text-sm font-semibold">
                      {locale === "bn"
                        ? "Clear workflow"
                        : "Clear workflow"}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {locale === "bn"
                        ? "Assignment থেকে feedback পর্যন্ত একটি পরিষ্কার flow।"
                        : "A clear flow from assignment to feedback."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="mx-auto mt-20 max-w-5xl">
          <Card className="relative overflow-hidden rounded-[2rem] border-primary/20 bg-primary text-primary-foreground shadow-xl">
            <div
              aria-hidden="true"
              className="absolute -right-22.5 -top-30 size-72 rounded-full border-50 border-primary-foreground/8"
            />

            <CardContent className="relative p-8 sm:p-12 lg:p-14">
              <Badge className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/10">
                <MessageSquareText className="mr-1.5 size-3.5" />
                {t.cta.eyebrow}
              </Badge>

              <h2 className="mt-6 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
                {t.cta.title}
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-primary-foreground/75 sm:text-base">
                {t.cta.description}
              </p>

              <Button
                variant="secondary"
                size="lg"
                className="mt-8 rounded-full px-6"
              >
                {t.cta.action}
                <ArrowRight className="size-4" />
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