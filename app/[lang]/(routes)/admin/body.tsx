"use client"

import * as React from "react"
import { useStats } from "@/hooks/admin/use-stats"
import { useAuth } from "@/providers/auth-provider"
import { AlertCircle, RefreshCw, Users, BookOpen, Layers, GraduationCap } from "lucide-react"

interface BodyProps {
  locale: "en" | "bn"
}

const translations = {
  en: {
    title: "Admin Dashboard",
    subtitle: "High-level summary of system metrics and teacher allocations.",
    totalCourses: "Total Classes",
    totalSubjects: "Total Subjects",
    totalTeachers: "Total Teachers",
    totalStudents: "Total Students",
    allocationStatus: "Teacher Assignment Status",
    assigned: "Assigned Status",
    unassigned: "Unassigned Status",
    allocationVisualizer: "Overall Allocation Progress",
    allocatedLabel: "allocated",
    noData: "No overview data available.",
    retry: "Retry",
    loading: "Fetching dashboard data...",
  },
  bn: {
    title: "অ্যাডমিন ড্যাশবোর্ড",
    subtitle: "সিস্টেমের মেট্রিক্স এবং শিক্ষক বরাদ্দের সংক্ষিপ্ত বিবরণ।",
    totalCourses: "মোট ক্লাস",
    totalSubjects: "মোট বিষয়",
    totalTeachers: "মোট শিক্ষক",
    totalStudents: "মোট শিক্ষার্থী",
    allocationStatus: "শিক্ষক বরাদ্দের অবস্থা",
    assigned: "বরাদ্দকৃত",
    unassigned: "বরাদ্দহীন",
    allocationVisualizer: "সার্বিক বরাদ্দ অগ্রগতি",
    allocatedLabel: "বরাদ্দ সম্পূর্ণ",
    noData: "কোন তথ্য পাওয়া যায়নি।",
    retry: "পুনরায় চেষ্টা করুন",
    loading: "ড্যাশবোর্ড তথ্য লোড হচ্ছে...",
  },
}

export default function Body({ locale }: BodyProps) {
  const { stats, loading, error, refresh } = useStats()
  const { isLoading: authLoading, isAuthenticated } = useAuth()
  const t = translations[locale]

  // Defer fetching stats until authentication state is resolved to prevent initial 401s
  React.useEffect(() => {
    if (!authLoading && isAuthenticated) {
      refresh()
    }
  }, [authLoading, isAuthenticated, refresh])

  const isLoading = loading || authLoading

  // Render Loading Skeletons
  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="h-4 w-72 bg-muted rounded"></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 border rounded-xl bg-background/50"></div>
          ))}
        </div>
        <div className="h-40 border rounded-xl bg-background/50"></div>
      </div>
    )
  }

  // Render Network or API errors
  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <div>
          <h3 className="text-lg font-semibold">{error}</h3>
          <p className="text-sm text-muted-foreground">Unable to fetch database metrics.</p>
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-2 px-4 h-10 text-sm font-semibold border rounded-lg hover:bg-accent transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          {t.retry}
        </button>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="p-6 text-center text-muted-foreground">{t.noData}</div>
    )
  }

  // Visual helper for percentage progress
  const teacherAssignedPercentage = stats.teachers.total
    ? Math.round((stats.teachers.assigned / stats.teachers.total) * 100)
    : 0

  return (
    <div className="p-6 space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t.subtitle}</p>
        </div>
        <button
          onClick={refresh}
          className="self-start md:self-auto flex items-center justify-center h-9 px-3 text-xs font-semibold border rounded-lg hover:bg-accent transition-colors gap-1.5"
          aria-label="Refresh stats"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {locale === "bn" ? "রিফ্রেশ" : "Refresh"}
        </button>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Classes Card */}
        <div className="p-6 border rounded-xl bg-background shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.totalCourses}
            </p>
            <p className="text-3xl font-bold text-slate-800">{stats.totalCourses}</p>
          </div>
          <Layers className="h-8 w-8 text-blue-900/10 dark:text-blue-400/20" />
        </div>

        {/* Subjects Card */}
        <div className="p-6 border rounded-xl bg-background shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.totalSubjects}
            </p>
            <p className="text-3xl font-bold text-slate-800">{stats.totalSubjects}</p>
          </div>
          <BookOpen className="h-8 w-8 text-blue-900/10 dark:text-blue-400/20" />
        </div>

        {/* Teachers Card */}
        <div className="p-6 border rounded-xl bg-background shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.totalTeachers}
            </p>
            <p className="text-3xl font-bold text-slate-800">{stats.teachers.total}</p>
          </div>
          <Users className="h-8 w-8 text-blue-900/10 dark:text-blue-400/20" />
        </div>

        {/* Students Card */}
        <div className="p-6 border rounded-xl bg-background shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.totalStudents}
            </p>
            <p className="text-3xl font-bold text-slate-800">{stats.students.total}</p>
          </div>
          <GraduationCap className="h-8 w-8 text-blue-900/10 dark:text-blue-400/20" />
        </div>
      </div>

      {/* Simplified High-Level Allocation Progress Panel */}
      <div className="p-6 border rounded-xl bg-background shadow-sm space-y-4 max-w-3xl">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-slate-900">{t.allocationStatus}</h3>
          <p className="text-xs text-muted-foreground">
            {t.allocationVisualizer}
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-slate-700">
              {t.assigned}: <strong className="text-blue-900 font-bold">{stats.teachers.assigned}</strong>
            </span>
            <span className="text-muted-foreground text-sm font-medium">
              {t.unassigned}: <strong className="text-slate-800 font-bold">{stats.teachers.unassigned}</strong>
            </span>
          </div>
          
          <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden border">
            <div 
              className="bg-blue-900 h-full rounded-full transition-all duration-500" 
              style={{ width: `${teacherAssignedPercentage}%` }}
            />
          </div>
          
          <p className="text-right text-xs font-semibold text-slate-600">
            {teacherAssignedPercentage}% {t.allocatedLabel}
          </p>
        </div>
      </div>
    </div>
  )
}