"use client"

import * as React from "react"

interface BodyProps {
  locale: "en" | "bn"
}

const translations = {
  en: {
    title: "Admin Dashboard",
    welcome: "Welcome back, Administrator.",
    statsUsers: "Total Users",
    statsClasses: "Active Classes",
    statsAssessments: "Assessments Completed",
    recentActivity: "Recent System Activity",
    placeholderActivity: "No recent system logs available.",
  },
  bn: {
    title: "অ্যাডমিন ড্যাশবোর্ড",
    welcome: "স্বাগতম, অ্যাডমিনিস্ট্রেটর।",
    statsUsers: "মোট ব্যবহারকারী",
    statsClasses: "চলতি ক্লাসসমূহ",
    statsAssessments: "মূল্যায়ন সম্পন্ন হয়েছে",
    recentActivity: "সাম্প্রতিক সিস্টেম কার্যকলাপ",
    placeholderActivity: "কোন সাম্প্রতিক সিস্টেম লগ পাওয়া যায়নি।",
  },
}

export default function Body({ locale }: BodyProps) {
  const t = translations[locale]

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Title Block */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {t.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t.welcome}
        </p>
      </div>

      {/* Basic Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-6 border rounded-xl bg-background shadow-sm space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t.statsUsers}
          </p>
          <p className="text-3xl font-bold">1,240</p>
        </div>
        <div className="p-6 border rounded-xl bg-background shadow-sm space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t.statsClasses}
          </p>
          <p className="text-3xl font-bold">42</p>
        </div>
        <div className="p-6 border rounded-xl bg-background shadow-sm space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t.statsAssessments}
          </p>
          <p className="text-3xl font-bold">843</p>
        </div>
      </div>

      {/* Activity Area Placeholder */}
      <div className="p-6 border rounded-xl bg-background shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">
          {t.recentActivity}
        </h2>
        <div className="text-sm text-muted-foreground py-8 text-center border-2 border-dashed rounded-lg">
          {t.placeholderActivity}
        </div>
      </div>
    </div>
  )
}