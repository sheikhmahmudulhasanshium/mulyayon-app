"use client"

import * as React from "react"
import { useTeacherStats } from "@/hooks/teacher/use-teacher-stats"
import { 
  AlertCircle, 
  RefreshCw, 
  Users, 
  FileText, 
  Layers, 
  CheckSquare, 
  Clock, 
  XCircle,
  TrendingUp 
} from "lucide-react"

interface BodyProps {
  locale: "en" | "bn"
}

const translations = {
  en: {
    title: "Teacher Dashboard",
    subtitle: "Monitor class performance, submissions, and active subjects.",
    classesTaught: "Classes Taught",
    activeStudents: "Total Students",
    assignmentsCreated: "Assignments Created",
    submissionsReceived: "Submissions Received",
    pipelineTitle: "Submission Evaluation Pipeline",
    performanceTitle: "Student Grade Distribution",
    pending: "Pending Grading",
    rejected: "Rejected / Resubmit",
    gradingPerformance: "Grading Metrics",
    noData: "No metrics available yet.",
    retry: "Retry",
    grades: {
      "A+": "A+",
      A: "A",
      "A-": "A-",
      B: "B",
      C: "C",
      D: "D",
      F: "F",
    },
  },
  bn: {
    title: "শিক্ষক ড্যাশবোর্ড",
    subtitle: "ক্লাসের পারফরম্যান্স, জমাকৃত অ্যাসাইনমেন্ট এবং চলমান বিষয়ের বিবরণ।",
    classesTaught: "ক্লাসসমূহ",
    activeStudents: "মোট শিক্ষার্থী",
    assignmentsCreated: "অ্যাসাইনমেন্ট তৈরি",
    submissionsReceived: "জমাকৃত অ্যাসাইনমেন্ট",
    pipelineTitle: "অ্যাসাইনমেন্ট মূল্যায়নের পাইপলাইন",
    performanceTitle: "শিক্ষার্থীদের গ্রেড বিতরণ",
    pending: "মূল্যায়নের অপেক্ষায়",
    rejected: "প্রত্যাখ্যাত / পুনরায় জমা",
    gradingPerformance: "গ্রেডিং মেট্রিক্স",
    noData: "কোনো তথ্য পাওয়া যায়নি।",
    retry: "পুনরায় চেষ্টা করুন",
    grades: {
      "A+": "এ+",
      A: "এ",
      "A-": "এ-",
      B: "বি",
      C: "সি",
      D: "ডি",
      F: "এফ",
    },
  },
}

export default function Body({ locale }: BodyProps) {
  const { stats, loading, error, refresh } = useTeacherStats()
  const t = translations[locale]

  // Render Loading Skeletons
  if (loading) {
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
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-64 border rounded-xl bg-background/50"></div>
          <div className="h-64 border rounded-xl bg-background/50"></div>
        </div>
      </div>
    )
  }

  // Render Network or Access Errors
  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <div>
          <h3 className="text-lg font-semibold">{error}</h3>
          <p className="text-sm text-muted-foreground">Unable to fetch teacher stats. Make sure you are authorized.</p>
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

  // Evaluation Percentage calculations
  const totalSubmissions = stats.assignments.submissionsReceived
  const pendingCount = stats.assignments.submissionsPending
  const gradedCount = totalSubmissions - pendingCount - stats.assignments.submissionsRejected

  const evaluationPercentage = totalSubmissions
    ? Math.round((gradedCount / totalSubmissions) * 100)
    : 0

  return (
    <div className="p-6 space-y-6">
      
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t.subtitle}</p>
        </div>
        <button
          onClick={refresh}
          className="self-start md:self-auto flex items-center justify-center h-9 px-3 text-xs font-semibold border rounded-lg hover:bg-accent transition-colors gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {locale === "bn" ? "রিফ্রেশ" : "Refresh"}
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Classes Taught Card */}
        <div className="p-6 border rounded-xl bg-background shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.classesTaught}
            </p>
            <p className="text-3xl font-bold">{stats.totalClassesToTake}</p>
          </div>
          <Layers className="h-8 w-8 text-blue-900/10 dark:text-blue-400/20" />
        </div>

        {/* Enrolled Students Card */}
        <div className="p-6 border rounded-xl bg-background shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.activeStudents}
            </p>
            <p className="text-3xl font-bold">{stats.totalStudentsInClasses}</p>
          </div>
          <Users className="h-8 w-8 text-blue-900/10 dark:text-blue-400/20" />
        </div>

        {/* Assignments Created Card */}
        <div className="p-6 border rounded-xl bg-background shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.assignmentsCreated}
            </p>
            <p className="text-3xl font-bold">{stats.assignments.totalCreated}</p>
          </div>
          <FileText className="h-8 w-8 text-blue-900/10 dark:text-blue-400/20" />
        </div>

        {/* Submissions Received Card */}
        <div className="p-6 border rounded-xl bg-background shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.submissionsReceived}
            </p>
            <p className="text-3xl font-bold">{stats.assignments.submissionsReceived}</p>
          </div>
          <CheckSquare className="h-8 w-8 text-blue-900/10 dark:text-blue-400/20" />
        </div>

      </div>

      {/* Analytical Visual Blocks */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* Card A: Evaluation Pipeline */}
        <div className="p-6 border rounded-xl bg-background shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{t.pipelineTitle}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Processing and evaluation status of completed assignments.
            </p>
          </div>

          {/* Progress bar visualizer */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-blue-900">
                {locale === "bn" ? "মূল্যায়িত" : "Evaluated"}: {gradedCount}
              </span>
              <span className="text-muted-foreground text-xs">
                {locale === "bn" ? "মোট জমা" : "Total"}: {totalSubmissions}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-900 h-full rounded-full transition-all duration-500" 
                style={{ width: `${evaluationPercentage}%` }}
              />
            </div>
            <p className="text-right text-xs text-muted-foreground">
              {evaluationPercentage}% {locale === "bn" ? "মূল্যায়ন সম্পন্ন" : "evaluated"}
            </p>
          </div>

          {/* Detail Lists */}
          <div className="border-t pt-4 space-y-3">
            {/* Pending Item */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-500" />
                {t.pending}
              </span>
              <span className="font-semibold bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-0.5 rounded-full text-xs">
                {stats.assignments.submissionsPending}
              </span>
            </div>

            {/* Rejected Item */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-destructive" />
                {t.rejected}
              </span>
              <span className="font-semibold bg-red-50 border border-red-200 text-destructive px-2.5 py-0.5 rounded-full text-xs">
                {stats.assignments.submissionsRejected}
              </span>
            </div>
          </div>
        </div>

        {/* Card B: Overall Grade Distributions */}
        <div className="p-6 border rounded-xl bg-background shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{t.performanceTitle}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Dynamic score mappings across standard assessment boundaries.
              </p>
            </div>
            <TrendingUp className="h-5 w-5 text-muted-foreground/50" />
          </div>

          {/* Grade Breakdown Bars */}
          <div className="border-t pt-4 space-y-3">
            {Object.entries(stats.classPerformance).map(([grade, count]) => {
              const gradeKey = grade as keyof typeof t.grades
              const gradeLabel = t.grades[gradeKey] || grade

              // Calculate percentage of this specific grade out of total graded submissions
              const gradePercentage = gradedCount > 0 
                ? Math.round((count / gradedCount) * 100) 
                : 0

              return (
                <div key={grade} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{gradeLabel}</span>
                    <span>{count}</span>
                  </div>
                  <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden border">
                    <div 
                      className="bg-blue-900 h-full rounded-full transition-all duration-300"
                      style={{ width: `${gradePercentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}