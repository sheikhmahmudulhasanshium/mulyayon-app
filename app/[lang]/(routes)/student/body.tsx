"use client"

import { useAssignments } from "@/hooks/common/use-assignments"
import { AlertCircle, RefreshCw, BookOpen, Calendar, Award } from "lucide-react"

interface BodyProps {
  locale: "en" | "bn"
}

const translations = {
  en: {
    title: "Student Dashboard",
    subtitle: "View and submit your ongoing course assignments and tasks.",
    activeTasks: "Active Assignments",
    maxMarks: "Marks",
    dueDate: "Due",
    noAssignments: "No assignments published for your course yet.",
    retry: "Retry",
    loading: "Fetching course tasks...",
  },
  bn: {
    title: "শিক্ষার্থী ড্যাশবোর্ড",
    subtitle: "আপনার চলমান কোর্সের অ্যাসাইনমেন্ট এবং টাস্কসমূহ দেখুন এবং জমা দিন।",
    activeTasks: "চলতি অ্যাসাইনমেন্ট",
    maxMarks: "নম্বর",
    dueDate: "শেষ সময়",
    noAssignments: "আপনার কোর্সের জন্য কোনো অ্যাসাইনমেন্ট প্রকাশ করা হয়নি।",
    retry: "পুনরায় চেষ্টা করুন",
    loading: "অ্যাসাইনমেন্ট লোড হচ্ছে...",
  },
}

export default function Body({ locale }: BodyProps) {
  const { assignments, loading, error, refresh } = useAssignments()
  const t = translations[locale]

  // Render Loading Skeletons
  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="h-4 w-72 bg-muted rounded"></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 border rounded-xl bg-background/50"></div>
          ))}
        </div>
      </div>
    )
  }

  // Render Network Errors
  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <div>
          <h3 className="text-lg font-semibold">{error}</h3>
          <p className="text-sm text-muted-foreground">Unable to fetch your assignment tasks.</p>
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

      {/* Task List Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-900/40" />
          {t.activeTasks}
        </h3>

        {assignments.length === 0 ? (
          <div className="text-center p-12 border-2 border-dashed rounded-xl text-muted-foreground max-w-xl mx-auto">
            {t.noAssignments}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {assignments.map((assignment) => {
              const formattedDeadline = new Date(assignment.deadline).toLocaleDateString(
                locale === "bn" ? "bn-BD" : "en-US",
                { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
              )

              return (
                <div 
                  key={assignment.id} 
                  className="p-6 border rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-base line-clamp-1">
                      {assignment.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {assignment.description}
                    </p>
                  </div>

                  <div className="border-t pt-3 flex items-center justify-between text-xs text-muted-foreground">
                    {/* Due Date Indicator */}
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-blue-900" />
                      <span>{t.dueDate}: {formattedDeadline}</span>
                    </div>

                    {/* Marks Indicator */}
                    <div className="flex items-center gap-1">
                      <Award className="h-3.5 w-3.5 text-blue-900" />
                      <span>{t.maxMarks}: <strong>{assignment.maxMarks}</strong></span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}