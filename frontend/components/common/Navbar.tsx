"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { cn } from "@/lib/utils"
import { ModeToggle } from "./buttons/ModeToggleButton"

interface NavbarProps {
  locale: "en" | "bn"
}

const navLabels = {
  en: {
    home: "Home",
    about: "About",
    faq: "FAQ",
    admin: "Admin Dashboard",
    teacher: "Teacher Panel",
    student: "Student Panel",
    courses: "Courses",
    subjects: "Subjects",
    teachers: "Teachers",
    users: "Users",
    assignments: "Assignments",
    students: "Students",
    colleagues: "Colleagues",
    grades: "Grades",
    classmates: "Classmates"
  },
  bn: {
    home: "হোম",
    about: "পরিচিতি",
    faq: "সাধারণ জিজ্ঞাসা",
    admin: "অ্যাডমিন ড্যাশবোর্ড",
    teacher: "শিক্ষক প্যানেল",
    student: "শিক্ষার্থী প্যানেল",
    courses: "কোর্সসমূহ",
    subjects: "বিষয়সমূহ",
    teachers: "শিক্ষকবৃন্দ",
    users: "ব্যবহারকারীগণ",
    assignments: "অ্যাসাইনমেন্ট",
    students: "শিক্ষার্থীবৃন্দ",
    colleagues: "সহকর্মীবৃন্দ",
    grades: "গ্রেড রিপোর্ট",
    classmates: "সহপাঠীবৃন্দ"
  },
}

export default function Navbar({ locale }: NavbarProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const t = navLabels[locale]

  const getDashboardLink = () => {
    if (!user) return null
    const roleLower = user.role.toLowerCase()
    return {
      href: `/${locale}/${roleLower}`,
      label: user.role === "Admin" ? t.admin : user.role === "Teacher" ? t.teacher : t.student
    }
  }

  const dashboardLink = getDashboardLink()

  const getLinkClass = (href: string) => {
    const isActive = pathname === href || (href !== `/${locale}` && pathname.startsWith(href))
    return cn(
      "inline-flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-muted",
      isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
    )
  }

  return (
    <nav className="border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-1">
          <Link href={`/${locale}`} className={getLinkClass(`/${locale}`)}>
            {t.home}
          </Link>
          <Link href={`/${locale}/about`} className={getLinkClass(`/${locale}/about`)}>
            {t.about}
          </Link>
          <Link href={`/${locale}/faq`} className={getLinkClass(`/${locale}/faq`)}>
            {t.faq}
          </Link>

          {dashboardLink && (
            <Link href={dashboardLink.href} className={getLinkClass(dashboardLink.href)}>
              <span className="font-semibold text-blue-900 dark:text-blue-400">
                {dashboardLink.label}
              </span>
            </Link>
          )}

          {user?.role === "Admin" && (
            <div className="hidden md:flex items-center gap-1 border-l pl-2 ml-1">
              <Link href={`/${locale}/admin/courses`} className={getLinkClass(`/${locale}/admin/courses`)}>
                {t.courses}
              </Link>
              <Link href={`/${locale}/admin/subjects`} className={getLinkClass(`/${locale}/admin/subjects`)}>
                {t.subjects}
              </Link>
              <Link href={`/${locale}/admin/teachers`} className={getLinkClass(`/${locale}/admin/teachers`)}>
                {t.teachers}
              </Link>
              <Link href={`/${locale}/admin/users`} className={getLinkClass(`/${locale}/admin/users`)}>
                {t.users}
              </Link>
            </div>
          )}

          {user?.role === "Teacher" && (
            <div className="hidden md:flex items-center gap-1 border-l pl-2 ml-1">
              <Link href={`/${locale}/teacher/courses`} className={getLinkClass(`/${locale}/teacher/courses`)}>
                {t.courses}
              </Link>
              <Link href={`/${locale}/teacher/subjects`} className={getLinkClass(`/${locale}/teacher/subjects`)}>
                {t.subjects}
              </Link>
              <Link href={`/${locale}/teacher/assignments`} className={getLinkClass(`/${locale}/teacher/assignments`)}>
                {t.assignments}
              </Link>
              <Link href={`/${locale}/teacher/students`} className={getLinkClass(`/${locale}/teacher/students`)}>
                {t.students}
              </Link>
              <Link href={`/${locale}/teacher/colleagues`} className={getLinkClass(`/${locale}/teacher/colleagues`)}>
                {t.colleagues}
              </Link>
            </div>
          )}

          {user?.role === "Student" && (
            <div className="hidden md:flex items-center gap-1 border-l pl-2 ml-1">
              <Link href={`/${locale}/student/subjects`} className={getLinkClass(`/${locale}/student/subjects`)}>
                {t.subjects}
              </Link>
              <Link href={`/${locale}/student/assignments`} className={getLinkClass(`/${locale}/student/assignments`)}>
                {t.assignments}
              </Link>
              <Link href={`/${locale}/student/grades`} className={getLinkClass(`/${locale}/student/grades`)}>
                {t.grades}
              </Link>
              <Link href={`/${locale}/student/classmates`} className={getLinkClass(`/${locale}/student/classmates`)}>
                {t.classmates}
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}