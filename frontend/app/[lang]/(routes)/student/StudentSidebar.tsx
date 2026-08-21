"use client"

import * as React from "react"
import { 
  Menu, 
  X, 
  ChevronRight, 
  Home, 
  LayoutDashboard, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Award, 
  User
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/common/buttons/ModeToggleButton"
import AuthButton from "@/components/common/buttons/AuthButton"
import LanguageToggleButton from "@/components/common/buttons/LanguageToggleButton"

interface StudentSidebarProps {
  locale: "en" | "bn"
}

const pageLabels = {
  en: {
    dashboard: "Dashboard",
    courses: "My Registered Course",
    subjects: "My Subjects & Teachers",
    assignments: "My Assignments",
    grades: "My Grades & Reports",
    classmates: "My Classmates",
    studentPanel: "Student Panel",
    backToHome: "Back to Home"
  },
  bn: {
    dashboard: "ড্যাশবোর্ড",
    courses: "আমার নিবন্ধিত কোর্স",
    subjects: "বিষয় এবং শিক্ষক",
    assignments: "বাড়ির কাজসমূহ",
    grades: "আমার গ্রেড ও রিপোর্ট",
    classmates: "সহপাঠীবৃন্দ",
    studentPanel: "শিক্ষার্থী প্যানেল",
    backToHome: "হোমে ফিরে যান"
  }
}

export default function StudentSidebar({ locale }: StudentSidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()

  const isBn = locale === "bn"
  const labels = pageLabels[locale]

  const menuItems = [
    {
      label: labels.dashboard,
      href: `/${locale}/student`,
      icon: LayoutDashboard,
    },
    {
      label: labels.subjects,
      href: `/${locale}/student/subjects`,
      icon: BookOpen,
    },
    {
      label: labels.assignments,
      href: `/${locale}/student/assignments`,
      icon: GraduationCap,
    },
    {
      label: labels.grades,
      href: `/${locale}/student/grades`,
      icon: Award,
    },
    {
      label: labels.classmates,
      href: `/${locale}/student/classmates`,
      icon: Users,
    },
  ]

  const currentPage = Object.entries({
    subjects: `/${locale}/student/subjects`,
    assignments: `/${locale}/student/assignments`,
    grades: `/${locale}/student/grades`,
    classmates: `/${locale}/student/classmates`,
    dashboard: `/${locale}/student`,
  }).find(([, href]) => pathname.startsWith(href))

  const currentPageLabel = currentPage
    ? labels[currentPage[0] as keyof typeof labels]
    : null

  return (
    <div className="flex w-full items-center gap-2">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md border bg-background text-foreground shadow-sm outline-none transition-colors hover:bg-accent"
        aria-label={isBn ? "মেনু খুলুন" : "Open menu"}
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex h-9 min-w-0 flex-1 items-center rounded-md border bg-muted/50 px-3">
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center">
          <Link
            href={`/${locale}`}
            className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{labels.backToHome}</span>
          </Link>

          <ChevronRight className="mx-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />

          <Link
            href={`/${locale}/student`}
            className="flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <User className="h-3.5 w-3.5 text-primary" />
            <span>{labels.studentPanel}</span>
          </Link>

          {currentPage && currentPageLabel && currentPage[0] !== "dashboard" && (
            <>
              <ChevronRight className="mx-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
              <span aria-current="page" className="truncate text-xs font-medium text-foreground">
                {currentPageLabel}
              </span>
            </>
          )}
        </nav>
      </div>

      <ModeToggle />

      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col gap-5 border-r bg-background p-6 shadow-2xl transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold text-foreground">{labels.studentPanel}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== `/${locale}/student` && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-4 border-t pt-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {isBn ? "পছন্দসমূহ" : "Preferences"}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">{isBn ? "ভাষা পরিবর্তন" : "Language"}</span>
            <LanguageToggleButton size="xs" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">{isBn ? "থিম" : "Theme"}</span>
            <ModeToggle />
          </div>

          <div className="mt-2 flex justify-center border-t pt-4">
            <AuthButton />
          </div>
        </div>
      </div>
    </div>
  )
}