"use client"

import * as React from "react"
import { Menu, X, ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import LanguageToggleButton from "./buttons/LanguageToggleButton"
import AuthButton from "./buttons/AuthButton"
import { ModeToggle } from "./buttons/ModeToggleButton"

interface SidebarProps {
  locale: "en" | "bn"
}

const pageLabels = {
  en: {
    about: "About",
    faq: "FAQ",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    signIn: "Sign in",

  },
  bn: {
    about: "পরিচিতি",
    faq: "সাধারণ জিজ্ঞাসা",
    privacy: "গোপনীয়তা নীতি",
    terms: "ব্যবহারের শর্তাবলী",
    signIn: "সাইন ইন",

  },
}

export default function Sidebar({ locale }: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()

  const isBn = locale === "bn"
  const labels = pageLabels[locale]

  const menuItems = [
    {
      label: isBn ? "হোম" : "Home",
      href: `/${locale}`,
    },
    {
      label: labels.about,
      href: `/${locale}/about`,
    },
    {
      label: labels.faq,
      href: `/${locale}/faq`,
    },
    {
      label: labels.privacy,
      href: `/${locale}/privacy`,
    },
    {
      label: labels.terms,
      href: `/${locale}/terms`,
    },
  ]

  const currentPage = Object.entries({
    about: `/${locale}/about`,
    faq: `/${locale}/faq`,
    privacy: `/${locale}/privacy`,
    terms: `/${locale}/terms`,
    signIn: `/${locale}/sign-in`,

  }).find(([, href]) => pathname === href)

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
        aria-label={isBn ? "মেনু খুলুন" : "Open menu"}
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
            <span>{isBn ? "হোম" : "Home"}</span>
          </Link>

          {currentPageLabel && (
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

      {/* Theme */}
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
          <span className="text-lg font-bold text-foreground">
            {isBn ? "মেনু" : "Navigation"}
          </span>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label={isBn ? "মেনু বন্ধ করুন" : "Close menu"}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Public Navigation */}
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Preferences */}
        <div className="mt-auto flex flex-col gap-4 border-t pt-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {isBn ? "পছন্দসমূহ" : "Preferences"}
          </div>

          {/* Language */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {isBn ? "ভাষা পরিবর্তন" : "Language"}
            </span>

            <LanguageToggleButton size="xs" />
          </div>

          {/* Theme */}
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