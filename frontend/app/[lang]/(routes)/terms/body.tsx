import {
  BookOpenCheck,
  
  FileText,
  Gavel,
  LockKeyhole,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
    badge: "Terms · মূল্যায়ন",
    title: "A shared understanding of how Mulyayon works.",
    intro:
      "These terms describe the basic rules for using Mulyayon and help keep the academic workspace fair, secure, and useful for everyone.",

    updated: "Last updated: August 19, 2026",

    principles: [
      {
        icon: UserCheck,
        title: "Use your own account",
        description:
          "Keep your credentials private and use the platform only through authorized access.",
      },
      {
        icon: BookOpenCheck,
        title: "Respect academic work",
        description:
          "Assignments and submissions should be handled honestly and responsibly.",
      },
      {
        icon: ShieldCheck,
        title: "Keep the platform safe",
        description:
          "Do not intentionally disrupt, abuse, or attempt to bypass platform security.",
      },
    ],

    sections: [
      {
        title: "1. Acceptance of these terms",
        paragraphs: [
          "By accessing or using Mulyayon, you agree to follow these terms and any applicable rules established by the organization operating the platform.",
          "If you do not agree with these terms, you should not use the platform.",
        ],
      },
      {
        title: "2. User accounts",
        paragraphs: [
          "Users are responsible for keeping their account credentials confidential and for activity performed through their account.",
          "Users should provide accurate information where required and should notify the appropriate administrator if they believe their account has been compromised.",
        ],
      },
      {
        title: "3. Appropriate use",
        paragraphs: [
          "Mulyayon is intended for legitimate academic and administrative activities. Users must not use the platform to interfere with other users, manipulate academic records without authorization, distribute malicious content, or attempt to gain unauthorized access.",
          "Users should also avoid actions that unnecessarily place excessive load on the application or its underlying infrastructure.",
        ],
      },
      {
        title: "4. Academic integrity",
        paragraphs: [
          "Assignments and submissions should represent the work permitted by the applicable academic rules.",
          "Mulyayon provides tools for managing and evaluating academic work; it does not replace the academic policies of the institution or organization using the platform.",
        ],
      },
      {
        title: "5. Assignments and submissions",
        paragraphs: [
          "Students are responsible for submitting their work within the applicable deadlines and according to the requirements communicated by the Teacher.",
          "Teachers are responsible for defining assignment requirements clearly and evaluating submissions according to the applicable academic expectations.",
        ],
      },
      {
        title: "6. Evaluation and feedback",
        paragraphs: [
          "Marks, statuses, and feedback are part of the academic evaluation process. Authorized Teachers and administrators are responsible for managing these records within their permitted scope.",
          "Mulyayon provides the technical workflow for evaluation but does not independently determine whether an academic result is correct or fair.",
        ],
      },
      {
        title: "7. Security",
        paragraphs: [
          "Users must not attempt to bypass authentication, access another user's account, inspect protected data without authorization, or interfere with security mechanisms.",
          "Security vulnerabilities discovered through legitimate use should be reported to the responsible administrator rather than exploited.",
        ],
      },
      {
        title: "8. Availability and changes",
        paragraphs: [
          "The platform may occasionally be unavailable because of maintenance, updates, infrastructure issues, or circumstances outside the application's control.",
          "Features, workflows, and these terms may change over time as the platform evolves.",
        ],
      },
      {
        title: "9. Suspension or termination",
        paragraphs: [
          "Access may be restricted or suspended when necessary to protect the platform, its users, academic records, or the organization operating the system.",
          "The organization operating a particular deployment may establish additional account and access policies.",
        ],
      },
      {
        title: "10. Responsibility and limitations",
        paragraphs: [
          "Mulyayon is provided as an application for managing academic workflows. Users and organizations remain responsible for how the platform is used and for decisions made based on academic information within the system.",
          "To the extent permitted by applicable law, the platform should not be treated as a guarantee of uninterrupted availability, error-free operation, or a particular academic outcome.",
        ],
      },
      {
        title: "11. Updates to these terms",
        paragraphs: [
          "These terms may be updated when the platform or its operating requirements change.",
          "The latest version should be made available through the platform so users can review the current terms.",
        ],
      },
    ],
  },

  bn: {
    badge: "Terms · মূল্যায়ন",
    title: "মূল্যায়ন কীভাবে ব্যবহার করা হবে—সেটি নিয়ে একটি পরিষ্কার বোঝাপড়া।",
    intro:
      "এই শর্তাবলি মূল্যায়ন ব্যবহারের মৌলিক নিয়মগুলো নির্ধারণ করে এবং platform-কে সবার জন্য fair, secure ও কার্যকর রাখতে সাহায্য করে।",

    updated: "সর্বশেষ আপডেট: ১৯ আগস্ট, ২০২৬",

    principles: [
      {
        icon: UserCheck,
        title: "নিজের account ব্যবহার করুন",
        description:
          "নিজের credential গোপন রাখুন এবং শুধুমাত্র authorized access-এর মাধ্যমে platform ব্যবহার করুন।",
      },
      {
        icon: BookOpenCheck,
        title: "Academic work-কে সম্মান করুন",
        description:
          "Assignment ও submission সৎ এবং দায়িত্বশীলভাবে পরিচালনা করুন।",
      },
      {
        icon: ShieldCheck,
        title: "Platform নিরাপদ রাখুন",
        description:
          "ইচ্ছাকৃতভাবে system disrupt, abuse অথবা security bypass করার চেষ্টা করবেন না।",
      },
    ],

    sections: [
      {
        title: "১. শর্তাবলিতে সম্মতি",
        paragraphs: [
          "মূল্যায়ন access বা ব্যবহার করার মাধ্যমে আপনি এই শর্তাবলি এবং platform পরিচালনাকারী organization-এর প্রযোজ্য নিয়ম মেনে চলতে সম্মত হন।",
          "আপনি যদি এই শর্তাবলিতে সম্মত না হন, তাহলে platform ব্যবহার করা উচিত নয়।",
        ],
      },
      {
        title: "২. User account",
        paragraphs: [
          "নিজের account credential গোপন রাখা এবং নিজের account-এর মাধ্যমে হওয়া activity-এর জন্য user দায়ী।",
          "প্রয়োজনীয় ক্ষেত্রে সঠিক তথ্য প্রদান করা উচিত এবং account compromise হয়েছে বলে মনে হলে সংশ্লিষ্ট Admin-কে জানানো উচিত।",
        ],
      },
      {
        title: "৩. সঠিক ব্যবহার",
        paragraphs: [
          "মূল্যায়ন legitimate academic এবং administrative কাজের জন্য তৈরি। অন্য user-এর workflow ব্যাহত করা, authorization ছাড়া academic record পরিবর্তন, malicious content ছড়ানো অথবা unauthorized access নেওয়ার চেষ্টা করা যাবে না।",
          "Application বা infrastructure-এর উপর অপ্রয়োজনীয় অতিরিক্ত load তৈরি করে এমন কাজও এড়িয়ে চলা উচিত।",
        ],
      },
      {
        title: "৪. Academic integrity",
        paragraphs: [
          "Assignment এবং submission সংশ্লিষ্ট academic rules অনুযায়ী অনুমোদিত কাজকে প্রতিনিধিত্ব করা উচিত।",
          "মূল্যায়ন academic work পরিচালনা ও evaluation-এর জন্য technical tools প্রদান করে; এটি institution বা organization-এর academic policy-এর বিকল্প নয়।",
        ],
      },
      {
        title: "৫. Assignment ও submission",
        paragraphs: [
          "Student নির্ধারিত deadline-এর মধ্যে এবং Teacher-এর দেওয়া requirements অনুযায়ী কাজ submit করার জন্য দায়ী।",
          "Teacher assignment requirements পরিষ্কারভাবে নির্ধারণ এবং প্রযোজ্য academic expectation অনুযায়ী submission evaluate করার জন্য দায়ী।",
        ],
      },
      {
        title: "৬. Evaluation ও feedback",
        paragraphs: [
          "Marks, status এবং feedback academic evaluation process-এর অংশ। Authorized Teacher ও Admin তাদের অনুমোদিত scope-এর মধ্যে এই record পরিচালনা করেন।",
          "মূল্যায়ন evaluation-এর technical workflow প্রদান করে; কোনো academic result সঠিক বা ন্যায্য কি না তা নিজে থেকে নির্ধারণ করে না।",
        ],
      },
      {
        title: "৭. Security",
        paragraphs: [
          "Authentication bypass করা, অন্যের account access করা, authorization ছাড়া protected data দেখা বা security mechanism-এ হস্তক্ষেপ করা যাবে না।",
          "Legitimate use-এর মাধ্যমে কোনো security vulnerability পাওয়া গেলে সেটি exploit না করে সংশ্লিষ্ট administrator-কে জানানো উচিত।",
        ],
      },
      {
        title: "৮. Availability ও পরিবর্তন",
        paragraphs: [
          "Maintenance, update, infrastructure সমস্যা অথবা application-এর নিয়ন্ত্রণের বাইরের কারণে platform সাময়িকভাবে unavailable হতে পারে।",
          "Platform পরিবর্তনের সাথে feature, workflow এবং এই শর্তাবলিও সময়ের সাথে পরিবর্তিত হতে পারে।",
        ],
      },
      {
        title: "৯. Suspension বা termination",
        paragraphs: [
          "Platform, user, academic record অথবা organization-কে সুরক্ষিত রাখার প্রয়োজনে access restrict বা suspend করা হতে পারে।",
          "কোনো নির্দিষ্ট deployment পরিচালনাকারী organization অতিরিক্ত account এবং access policy নির্ধারণ করতে পারে।",
        ],
      },
      {
        title: "১০. দায়িত্ব ও সীমাবদ্ধতা",
        paragraphs: [
          "মূল্যায়ন academic workflow পরিচালনার একটি application। Platform কীভাবে ব্যবহার করা হচ্ছে এবং system-এর academic information-এর ভিত্তিতে কী সিদ্ধান্ত নেওয়া হচ্ছে—তার দায়িত্ব user ও সংশ্লিষ্ট organization-এর।",
          "প্রযোজ্য আইনের সীমার মধ্যে platform-এর uninterrupted availability, error-free operation অথবা নির্দিষ্ট academic outcome-এর নিশ্চয়তা হিসেবে মূল্যায়নকে বিবেচনা করা উচিত নয়।",
        ],
      },
      {
        title: "১১. শর্তাবলির পরিবর্তন",
        paragraphs: [
          "Platform অথবা operating requirements পরিবর্তিত হলে এই শর্তাবলি update করা হতে পারে।",
          "সর্বশেষ version platform-এর মাধ্যমে available রাখা উচিত, যাতে user বর্তমান শর্তাবলি পর্যালোচনা করতে পারেন।",
        ],
      },
    ],
  },
} as const;

export default function Body({ locale }: BodyProps) {
  const t = content[locale];

  return (
    <main className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-125"
      >
        <div className="absolute left-1/2 -top-62.5 size-137.5 -translate-x-1/2 rounded-full bg-primary/6 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:py-20">
        {/* Hero */}
        <section className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="rounded-full px-4 py-1.5">
            <Gavel className="mr-1.5 size-3.5" />
            {t.badge}
          </Badge>

          <h1 className="mt-7 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            {t.title}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            {t.intro}
          </p>

          <p className="mt-5 text-xs text-muted-foreground">
            {t.updated}
          </p>
        </section>

        {/* Principles */}
        <section className="mx-auto mt-14 max-w-5xl">
          <div className="grid gap-4 md:grid-cols-3">
            {t.principles.map((item) => {
              const Icon = item.icon;

              return (
                <Card key={item.title} className="rounded-2xl shadow-none">
                  <CardContent className="p-5">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>

                    <h2 className="mt-4 text-sm font-semibold">
                      {item.title}
                    </h2>

                    <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Terms */}
        <section className="mx-auto mt-16 max-w-3xl">
          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-6 sm:p-9">
              <div className="space-y-10">
                {t.sections.map((section, index) => (
                  <div key={section.title}>
                    {index > 0 && <Separator className="mb-10" />}

                    <div className="flex gap-4">
                      <div className="hidden size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground sm:flex">
                        <FileText className="size-4" />
                      </div>

                      <div>
                        <h2 className="text-lg font-semibold tracking-tight">
                          {section.title}
                        </h2>

                        <div className="mt-4 space-y-4">
                          {section.paragraphs.map((paragraph) => (
                            <p
                              key={paragraph}
                              className="text-sm leading-7 text-muted-foreground"
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Bottom note */}
        <section className="mx-auto mt-12 max-w-3xl">
          <Card className="rounded-2xl border-primary/20 bg-primary/4 shadow-none">
            <CardContent className="flex gap-4 p-5 sm:p-6">
              <LockKeyhole className="mt-0.5 size-5 shrink-0 text-primary" />

              <div>
                <h3 className="text-sm font-semibold">
                  {locale === "bn"
                    ? "ব্যবহারের আগে গুরুত্বপূর্ণ"
                    : "Before using the platform"}
                </h3>

                <p className="mt-1.5 text-xs leading-6 text-muted-foreground">
                  {locale === "bn"
                    ? "এই শর্তাবলি platform-এর সাধারণ ব্যবহারের জন্য তৈরি। কোনো নির্দিষ্ট প্রতিষ্ঠান বা deployment-এর নিজস্ব policy থাকলে সেটিও প্রযোজ্য হতে পারে।"
                    : "These terms describe general platform usage. A specific organization or deployment may also have additional policies that apply to its users."}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}