import {
  Database,
  FileText,
  LockKeyhole,
  ShieldCheck,
  UserRoundCheck,
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
    badge: "Privacy · মূল্যায়ন",
    title: "Privacy should be simple to understand.",
    intro:
      "This policy explains what information Mulyayon handles, why that information is needed, and the principles used to keep it protected while the platform is being used.",

    updated: "Last updated: August 19, 2026",

    highlights: [
      {
        icon: LockKeyhole,
        title: "Protected access",
        description:
          "Authentication and role-based authorization help protect restricted areas.",
      },
      {
        icon: Database,
        title: "Purpose-driven data",
        description:
          "Information is handled primarily to operate the academic workflow.",
      },
      {
        icon: UserRoundCheck,
        title: "Role-aware handling",
        description:
          "Access to information follows the responsibilities of each platform role.",
      },
    ],

    sections: [
      {
        title: "1. Information we handle",
        paragraphs: [
          "Mulyayon may handle information required to operate the platform, such as a user's name, email or username, role, academic associations, account credentials, assignments, submissions, marks, and feedback.",
          "The exact information available to a user depends on their role and the features enabled within the application.",
        ],
      },
      {
        title: "2. How information is used",
        paragraphs: [
          "Information is used to provide the platform's core functionality. This includes authenticating users, determining permissions, organizing academic structures, connecting students with relevant coursework, processing submissions, and supporting evaluation.",
          "Information may also be used to maintain application reliability, troubleshoot technical problems, and understand platform-level activity.",
        ],
      },
      {
        title: "3. Account credentials",
        paragraphs: [
          "Passwords should never be stored or transmitted as plain text. Mulyayon is designed to use secure password hashing for stored credentials.",
          "Authentication tokens and other security-related information should be handled carefully by the application and should not be intentionally exposed to unauthorized users.",
        ],
      },
      {
        title: "4. Role-based access",
        paragraphs: [
          "Mulyayon follows a role-aware access model. Administrative information, teacher functionality, and student information are separated according to the permissions associated with each role.",
          "This separation is intended to reduce unnecessary access and keep the academic workflow organized.",
        ],
      },
      {
        title: "5. Academic information",
        paragraphs: [
          "Assignments, submissions, marks, statuses, and teacher feedback form part of the academic workflow. Such information should only be accessible to users who are authorized to view or manage it.",
          "Students may be able to view their own academic information, while teachers and administrators may have broader access according to their responsibilities.",
        ],
      },
      {
        title: "6. Application security",
        paragraphs: [
          "The application uses authentication, authorization, password hashing, server-side validation, and structured application practices to reduce common security risks.",
          "No software system can guarantee absolute security. Users should also protect their account credentials and avoid sharing authenticated sessions with others.",
        ],
      },
      {
        title: "7. Data retention",
        paragraphs: [
          "Academic and account information may be retained for as long as it is necessary for the operation of the platform and the associated academic workflow.",
          "Retention and deletion practices may depend on the organization operating the particular Mulyayon deployment.",
        ],
      },
      {
        title: "8. Changes to this policy",
        paragraphs: [
          "This privacy policy may be updated when the platform, its functionality, or its data-handling practices change.",
          "When material changes are made, the updated policy should be published through the platform so users can review the latest version.",
        ],
      },
    ],
  },

  bn: {
    badge: "Privacy · মূল্যায়ন",
    title: "Privacy নীতি হওয়া উচিত সহজ ও পরিষ্কার।",
    intro:
      "এই নীতিতে মূল্যায়ন কী ধরনের তথ্য ব্যবহার করে, কেন সেই তথ্য প্রয়োজন এবং platform ব্যবহারের সময় কীভাবে তা সুরক্ষিত রাখার চেষ্টা করা হয়—তা ব্যাখ্যা করা হয়েছে।",

    updated: "সর্বশেষ আপডেট: ১৯ আগস্ট, ২০২৬",

    highlights: [
      {
        icon: LockKeyhole,
        title: "সুরক্ষিত access",
        description:
          "Authentication এবং role-based authorization restricted area সুরক্ষায় সহায়তা করে।",
      },
      {
        icon: Database,
        title: "উদ্দেশ্যভিত্তিক data",
        description:
          "Academic workflow পরিচালনার প্রয়োজন অনুযায়ী তথ্য ব্যবহার করা হয়।",
      },
      {
        icon: UserRoundCheck,
        title: "Role-aware handling",
        description:
          "প্রতিটি role-এর দায়িত্ব অনুযায়ী তথ্যের access নির্ধারিত হয়।",
      },
    ],

    sections: [
      {
        title: "১. আমরা কী ধরনের তথ্য পরিচালনা করি",
        paragraphs: [
          "মূল্যায়ন platform পরিচালনার জন্য প্রয়োজনীয় তথ্য যেমন নাম, email বা username, role, academic association, account credential, assignment, submission, marks এবং feedback পরিচালনা করতে পারে।",
          "কোন user কী তথ্য দেখতে বা পরিচালনা করতে পারবেন তা তার role এবং application-এর সক্রিয় feature-এর উপর নির্ভর করে।",
        ],
      },
      {
        title: "২. তথ্য কীভাবে ব্যবহার করা হয়",
        paragraphs: [
          "Platform-এর মূল functionality পরিচালনার জন্য তথ্য ব্যবহার করা হয়। এর মধ্যে user authentication, permission নির্ধারণ, academic structure পরিচালনা, relevant coursework-এর সাথে student-কে যুক্ত করা, submission process এবং evaluation অন্তর্ভুক্ত।",
          "Application reliability বজায় রাখা, technical সমস্যা শনাক্ত করা এবং platform-level activity বোঝার জন্যও কিছু তথ্য ব্যবহার করা হতে পারে।",
        ],
      },
      {
        title: "৩. Account credentials",
        paragraphs: [
          "Password কখনোই plain text হিসেবে সংরক্ষণ বা আদান-প্রদান করা উচিত নয়। মূল্যায়ন stored credential-এর জন্য secure password hashing ব্যবহারের জন্য তৈরি।",
          "Authentication token এবং অন্যান্য security-related তথ্য সতর্কতার সাথে পরিচালনা করা উচিত এবং unauthorized user-এর কাছে প্রকাশ করা উচিত নয়।",
        ],
      },
      {
        title: "৪. Role-based access",
        paragraphs: [
          "মূল্যায়ন role-aware access model অনুসরণ করে। Admin, Teacher এবং Student-এর functionality ও তথ্য তাদের নিজ নিজ permission অনুযায়ী আলাদা রাখা হয়।",
          "এই separation অপ্রয়োজনীয় access কমাতে এবং academic workflow সংগঠিত রাখতে সাহায্য করে।",
        ],
      },
      {
        title: "৫. Academic information",
        paragraphs: [
          "Assignment, submission, marks, status এবং teacher feedback academic workflow-এর অংশ। এই তথ্য শুধুমাত্র authorized user-এর কাছে accessible হওয়া উচিত।",
          "Student নিজের academic information দেখতে পারে, আর Teacher ও Admin তাদের দায়িত্ব অনুযায়ী বিস্তৃত access পেতে পারেন।",
        ],
      },
      {
        title: "৬. Application security",
        paragraphs: [
          "Application authentication, authorization, password hashing, server-side validation এবং structured application practices ব্যবহার করে সাধারণ security risk কমানোর চেষ্টা করে।",
          "কোনো software system সম্পূর্ণ নিরাপত্তার নিশ্চয়তা দিতে পারে না। User-এরও নিজের credential সুরক্ষিত রাখা এবং অন্যের সাথে authenticated session share না করার দায়িত্ব রয়েছে।",
        ],
      },
      {
        title: "৭. Data retention",
        paragraphs: [
          "Platform পরিচালনা এবং সংশ্লিষ্ট academic workflow-এর জন্য যতদিন প্রয়োজন ততদিন account ও academic information সংরক্ষিত থাকতে পারে।",
          "কোন deployment কোন organization পরিচালনা করছে তার উপর retention ও deletion policy নির্ভর করতে পারে।",
        ],
      },
      {
        title: "৮. এই নীতির পরিবর্তন",
        paragraphs: [
          "Platform, functionality অথবা data-handling practice পরিবর্তিত হলে এই privacy policy-ও পরিবর্তিত হতে পারে।",
          "গুরুত্বপূর্ণ পরিবর্তনের ক্ষেত্রে updated policy platform-এর মাধ্যমে প্রকাশ করা উচিত, যাতে user সর্বশেষ version পর্যালোচনা করতে পারেন।",
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
        <section className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="rounded-full px-4 py-1.5">
            <ShieldCheck className="mr-1.5 size-3.5" />
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

        <section className="mx-auto mt-14 max-w-5xl">
          <div className="grid gap-4 md:grid-cols-3">
            {t.highlights.map((item) => {
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
      </div>
    </main>
  );
}