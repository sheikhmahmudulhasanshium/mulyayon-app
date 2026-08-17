"use client"

import { useStats } from "@/hooks/admin/use-stats"
import { AlertCircle, RefreshCw, Users, BookOpen, Layers, GraduationCap } from "lucide-react"

interface BodyProps {
  locale: "en" | "bn"
}

const translations = {
  en: {
    title: "Admin Dashboard",
    subtitle: "Overview of system metrics, courses, and teacher allocations.",
    totalCourses: "Total Classes",
    totalSubjects: "Total Subjects",
    totalTeachers: "Total Teachers",
    totalStudents: "Total Students",
    assigned: "Assigned",
    unassigned: "Unassigned",
    teacherBreakdown: "Teacher Level Breakdown",
    studentBreakdown: "Student Class Enrollment",
    banglaVersion: "Bangla Version (BV)",
    englishVersion: "English Version (EV)",
    noData: "No data available.",
    retry: "Retry",
    loading: "Fetching dashboard data...",
    levels: {
      Primary: "Primary",
      Secondary: "Secondary",
      "Higher Secondary": "Higher Secondary",
    },
  },
  bn: {
    title: "অ্যাডমিন ড্যাশবোর্ড",
    subtitle: "সিস্টেমের মেট্রিক্স, কোর্স এবং শিক্ষক বরাদ্দের বিবরণ।",
    totalCourses: "মোট ক্লাস",
    totalSubjects: "মোট বিষয়",
    totalTeachers: "মোট শিক্ষক",
    totalStudents: "মোট শিক্ষার্থী",
    assigned: "বরাদ্দকৃত",
    unassigned: "বরাদ্দহীন",
    teacherBreakdown: "শিক্ষক স্তরের বিন্যাস",
    studentBreakdown: "শিক্ষার্থী শ্রেণীভুক্তি",
    banglaVersion: "বাংলা ভার্সন (BV)",
    englishVersion: "ইংরেজি ভার্সন (EV)",
    noData: "কোন তথ্য পাওয়া যায়নি।",
    retry: "পুনরায় চেষ্টা করুন",
    loading: "ড্যাশবোর্ড তথ্য লোড হচ্ছে...",
    levels: {
      Primary: "প্রাথমিক",
      Secondary: "মাধ্যমিক",
      "Higher Secondary": "উচ্চ মাধ্যমিক",
    },
  },
}

export default function Body({ locale }: BodyProps) {
  const { stats, loading, error, refresh } = useStats()
  const t = translations[locale]

  // Render Loading Skeletons
  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="h-4 w-72 bg-muted rounded"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 border rounded-xl bg-background/50"></div>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-64 border rounded-xl bg-background/50"></div>
          <div className="h-64 border rounded-xl bg-background/50"></div>
        </div>
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

  // Visual mathematics helper for percentage progress
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
            <p className="text-3xl font-bold">{stats.totalCourses}</p>
          </div>
          <Layers className="h-8 w-8 text-blue-900/10 dark:text-blue-400/20" />
        </div>

        {/* Subjects Card */}
        <div className="p-6 border rounded-xl bg-background shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.totalSubjects}
            </p>
            <p className="text-3xl font-bold">{stats.totalSubjects}</p>
          </div>
          <BookOpen className="h-8 w-8 text-blue-900/10 dark:text-blue-400/20" />
        </div>

        {/* Teachers Card */}
        <div className="p-6 border rounded-xl bg-background shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.totalTeachers}
            </p>
            <p className="text-3xl font-bold">{stats.teachers.total}</p>
          </div>
          <Users className="h-8 w-8 text-blue-900/10 dark:text-blue-400/20" />
        </div>

        {/* Students Card */}
        <div className="p-6 border rounded-xl bg-background shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.totalStudents}
            </p>
            <p className="text-3xl font-bold">{stats.students.total}</p>
          </div>
          <GraduationCap className="h-8 w-8 text-blue-900/10 dark:text-blue-400/20" />
        </div>
      </div>

      {/* Analytical Breakdowns Section */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Card A: Teacher Allocations */}
        <div className="p-6 border rounded-xl bg-background shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{t.teacherBreakdown}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Allocation visualizer across primary and secondary tiers.
            </p>
          </div>

          {/* Allocation Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-slate-700">
                {t.assigned}: <strong className="text-blue-900">{stats.teachers.assigned}</strong>
              </span>
              <span className="text-muted-foreground">
                {t.unassigned}: <strong>{stats.teachers.unassigned}</strong>
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-900 h-full rounded-full transition-all duration-500" 
                style={{ width: `${teacherAssignedPercentage}%` }}
              />
            </div>
            <p className="text-right text-xs text-muted-foreground">
              {teacherAssignedPercentage}% {locale === "bn" ? "বরাদ্দ সম্পূর্ণ" : "allocated"}
            </p>
          </div>

          {/* Teacher Level breakdown counts */}
          <div className="border-t pt-4 space-y-3">
            {Object.entries(stats.teachers.byLevel).map(([level, count]) => {
              const levelKey = level as keyof typeof t.levels
              const levelLabel = t.levels[levelKey] || level

              return (
                <div key={level} className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">{levelLabel}</span>
                  <span className="font-semibold bg-slate-50 border px-2.5 py-0.5 rounded-full text-xs">
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Card B: Student Enrollments */}
        <div className="p-6 border rounded-xl bg-background shadow-sm space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{t.studentBreakdown}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Registration matrix splits for Bangla (BV) and English (EV) classes.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 border-t pt-4">
            {/* Bangla Version Panel */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-blue-900 border-b pb-1">
                {t.banglaVersion}
              </h4>
              <div className="space-y-2">
                {Object.keys(stats.students.byVersion.BV).length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-2">{t.noData}</p>
                ) : (
                  Object.entries(stats.students.byVersion.BV).map(([className, count]) => (
                    <div key={className} className="flex justify-between text-xs">
                      <span className="text-slate-600 truncate max-w-30" title={className}>
                        {className}
                      </span>
                      <span className="font-bold">{count}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* English Version Panel */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-blue-950 border-b pb-1">
                {t.englishVersion}
              </h4>
              <div className="space-y-2">
                {Object.keys(stats.students.byVersion.EV).length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-2">{t.noData}</p>
                ) : (
                  Object.entries(stats.students.byVersion.EV).map(([className, count]) => (
                    <div key={className} className="flex justify-between text-xs">
                      <span className="text-slate-600 truncate max-w-30" title={className}>
                        {className}
                      </span>
                      <span className="font-bold">{count}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}