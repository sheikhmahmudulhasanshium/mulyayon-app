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
  },
}

export default function Navbar({ locale }: NavbarProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const t = navLabels[locale]

  // Construct dashboard route based on user role
  const getDashboardLink = () => {
    if (!user) return null
    const roleLower = user.role.toLowerCase()
    return {
      href: `/${locale}/${roleLower}`,
      label: user.role === "Admin" ? t.admin : user.role === "Teacher" ? t.teacher : t.student
    }
  }

  const dashboardLink = getDashboardLink()

  // Helper to style active navigation links
  const getLinkClass = (href: string) => {
    // Check direct equality or subpath mapping (for sub-routes)
    const isActive = pathname === href || (href !== `/${locale}` && pathname.startsWith(href))
    return cn(
      "inline-flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-muted",
      isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
    )
  }

  return (
    <nav className="border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        
        {/* Navigation Links */}
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

          {/* Core Panel Link */}
          {dashboardLink && (
            <Link href={dashboardLink.href} className={getLinkClass(dashboardLink.href)}>
              <span className="font-semibold text-blue-900 dark:text-blue-400">
                {dashboardLink.label}
              </span>
            </Link>
          )}

          {/* Additional Admin navigation options */}
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
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}