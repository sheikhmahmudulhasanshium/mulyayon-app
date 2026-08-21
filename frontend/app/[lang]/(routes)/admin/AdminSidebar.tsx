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
  UserCheck, 
  Users,
  Shield
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/common/buttons/ModeToggleButton"
import AuthButton from "@/components/common/buttons/AuthButton"
import LanguageToggleButton from "@/components/common/buttons/LanguageToggleButton"

interface AdminSidebarProps {
  locale: "en" | "bn"
}

const pageLabels = {
  en: {
    dashboard: "Dashboard",
    courses: "Courses",
    subjects: "Subjects",
    teachers: "Teachers",
    users: "Users",
    adminPanel: "Admin Panel",
    backToHome: "Back to Home",
  },
  bn: {
    dashboard: "ড্যাশবোর্ড",
    courses: "কোর্সসমূহ",
    subjects: "বিষয়সমূহ",
    teachers: "শিক্ষকবৃন্দ",
    users: "ব্যবহারকারীগণ",
    adminPanel: "অ্যাডমিন প্যানেল",
    backToHome: "হোমে ফিরে যান",
  },
}

export default function AdminSidebar({ locale }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()

  const isBn = locale === "bn"
  const labels = pageLabels[locale]

  const menuItems = [
    {
      label: labels.dashboard,
      href: `/${locale}/admin`,
      icon: LayoutDashboard,
    },
    {
      label: labels.courses,
      href: `/${locale}/admin/courses`,
      icon: GraduationCap,
    },
    {
      label: labels.subjects,
      href: `/${locale}/admin/subjects`,
      icon: BookOpen,
    },
    {
      label: labels.teachers,
      href: `/${locale}/admin/teachers`,
      icon: UserCheck,
    },
    {
      label: labels.users,
      href: `/${locale}/admin/users`,
      icon: Users,
    },
  ]

  // Find the current active path, matching sub-paths for breadcrumbs
  const currentPage = Object.entries({
    courses: `/${locale}/admin/courses`,
    subjects: `/${locale}/admin/subjects`,
    teachers: `/${locale}/admin/teachers`,
    users: `/${locale}/admin/users`,
    dashboard: `/${locale}/admin`, // Kept last so deeper routes match first
  }).find(([, href]) => pathname.startsWith(href))

  const currentPageLabel = currentPage
    ? labels[currentPage[0] as keyof typeof labels]
    : null

  return (
    <div className="flex w-full items-center gap-2">
      {/* Menu Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md border bg-background text-foreground shadow-sm outline-none transition-colors hover:bg-accent"
        aria-label={isBn ? "অ্যাডমিন মেনু খুলুন" : "Open admin menu"}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Breadcrumb */}
      <div className="flex h-9 min-w-0 flex-1 items-center rounded-md border bg-muted/50 px-3">
        <nav
          aria-label={isBn ? "ব্রেডক্রাম্ব" : "Breadcrumb"}
          className="flex min-w-0 items-center"
        >
          <Link
            href={`/${locale}`}
            className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{labels.backToHome}</span>
          </Link>

          <ChevronRight className="mx-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />

          <Link
            href={`/${locale}/admin`}
            className="flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Shield className="h-3.5 w-3.5 text-destructive" />
            <span>{labels.adminPanel}</span>
          </Link>

          {currentPage && currentPageLabel && currentPage[0] !== "dashboard" && (
            <>
              <ChevronRight className="mx-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
              <span
                aria-current="page"
                className="truncate text-xs font-medium text-foreground"
              >
                {currentPageLabel}
              </span>
            </>
          )}
        </nav>
      </div>

      {/* Theme Toggle */}
      <ModeToggle />

      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col gap-5 border-r bg-background p-6 shadow-2xl transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-destructive" />
            <span className="text-lg font-bold text-foreground">
              {labels.adminPanel}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label={isBn ? "মেনু বন্ধ করুন" : "Close menu"}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Admin Navigation */}
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== `/${locale}/admin` && pathname.startsWith(item.href))

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

        {/* Settings/Preferences Section */}
        <div className="mt-auto flex flex-col gap-4 border-t pt-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {isBn ? "পছন্দসমূহ" : "Preferences"}
          </div>

          {/* Language Switch */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {isBn ? "ভাষা পরিবর্তন" : "Language"}
            </span>
            <LanguageToggleButton size="xs" />
          </div>

          {/* Theme Switch */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {isBn ? "থিম" : "Theme"}
            </span>
            <ModeToggle />
          </div>

          {/* Authentication */}
          <div className="mt-2 flex justify-center border-t pt-4">
            <AuthButton />
          </div>
        </div>
      </div>
    </div>
  )
}