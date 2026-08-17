"use client"

import * as React from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import LanguageToggleButton from "./buttons/LanguageToggleButton"

interface SidebarProps {
  locale: "en" | "bn"
}

export default function Sidebar({ locale }: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const menuItems = [
    { label: locale === "bn" ? "ড্যাশবোর্ড" : "Dashboard", href: "#" },
    { label: locale === "bn" ? "কার্যক্রম" : "Activities", href: "#" },
    { label: locale === "bn" ? "প্রোফাইল" : "Profile", href: "#" },
    { label: locale === "bn" ? "সেটিংস" : "Settings", href: "#" },
  ]

  return (
    <div className="flex items-center gap-2 w-full">
      {/* 1. Left: Compact Menu Icon Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center h-9 w-9 border rounded-md bg-background hover:bg-accent text-foreground transition-colors shadow-sm outline-none shrink-0"
        aria-label="Open Menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* 2. Right: Full-width Placeholder Black Div (for buttons, searchbar, links, etc.) */}
      <div className="flex-1 h-9 bg-muted  rounded-md flex items-center px-3 text-white text-xs">
        {/* Placeholder space */}
      </div>

      {/* 3. Semi-Transparent Backdrop Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* 4. Slide-out Drawer Panel */}
      <div
        className={cn(
          "fixed top-0 bottom-0 left-0 w-72 max-w-[85vw] bg-background border-r p-6 z-50 flex flex-col gap-5 shadow-2xl transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer Header with Close Button */}
        <div className="flex items-center justify-between border-b pb-4">
          <span className="font-bold text-lg text-slate-900">
            {locale === "bn" ? "মেনু তালিকা" : "Navigation"}
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-md hover:bg-accent text-muted-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-accent hover:text-accent-foreground transition-all"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Preferences Area at bottom of Drawer */}
        <div className="border-t pt-4 mt-auto flex flex-col gap-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {locale === "bn" ? "সেটিংস" : "Preferences"}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">
              {locale === "bn" ? "ভাষা পরিবর্তন" : "Language"}
            </span>
            <LanguageToggleButton size="sm" />
          </div>
        </div>
      </div>
    </div>
  )
}