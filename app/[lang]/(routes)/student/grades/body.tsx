"use client"

import * as React from "react"
import { useStudent, StudentAssignmentResponse } from "@/hooks/student/use-student"
import { TrendingUp, CheckCircle2, FileText, MessageSquare } from "lucide-react"

interface BodyProps {
  locale: "en" | "bn"
}

export default function Body({ locale }: BodyProps) {
  const { getMyAssignments, loading } = useStudent()
  const [studentTasks, setStudentTasks] = React.useState<StudentAssignmentResponse[]>([])

  React.useEffect(() => {
    let isMounted = true
    const timer = setTimeout(() => {
      if (isMounted) {
        getMyAssignments().then(res => setStudentTasks(res))
      }
    }, 0)
    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [getMyAssignments])

  const gradeAnalytics = React.useMemo(() => {
    const gradedTasks = studentTasks.filter(t => t.submission?.status === "Graded")
    if (gradedTasks.length === 0) return { avg: 0, percentage: 0 }

    let totalMarks = 0
    let totalMaxMarks = 0

    for (const task of gradedTasks) {
      if (task.submission?.marks != null) {
        totalMarks += task.submission.marks
        totalMaxMarks += task.assignment.maxMarks
      }
    }

    const percentage = totalMaxMarks > 0 ? Math.round((totalMarks / totalMaxMarks) * 100) : 0
    const avg = gradedTasks.length ? Math.round(totalMarks / gradedTasks.length) : 0
    return { avg, percentage }
  }, [studentTasks])

  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-20 bg-muted/20 border rounded-xl"></div>
        <div className="h-48 bg-muted/20 border rounded-xl"></div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      
      {/* Grades Card Analytics */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="p-5 border rounded-xl bg-background shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {locale === "bn" ? "গড় নম্বর" : "Cumulative Average"}
            </p>
            <p className="text-3xl font-black text-blue-950">
              {gradeAnalytics.avg} <span className="text-xs font-bold text-muted-foreground">{locale === "bn" ? "পয়েন্ট" : "points"}</span>
            </p>
          </div>
          <TrendingUp className="h-8 w-8 text-blue-900/10" />
        </div>

        <div className="p-5 border rounded-xl bg-background shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {locale === "bn" ? "মোট অর্জিত শতাংশ" : "Total Percentage"}
            </p>
            <p className="text-3xl font-black text-emerald-800">{gradeAnalytics.percentage}%</p>
          </div>
          <CheckCircle2 className="h-8 w-8 text-emerald-800/10" />
        </div>
      </div>

      {/* Roster of Graded Cards */}
      <div className="border rounded-xl bg-background overflow-hidden shadow-sm">
        <div className="p-4 border-b bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <FileText className="h-4.5 w-4.5 text-blue-900" /> 
            {locale === "bn" ? "মূল্যায়ন সম্পন্ন অ্যাসাইনমেন্টসমূহ" : "Completed Graded Assignments"}
          </h3>
        </div>
        
        <div className="divide-y divide-slate-100">
          {studentTasks
            .filter(t => t.submission?.status === "Graded")
            .map(({ assignment, submission }) => {
              if (!submission) return null

              return (
                <div key={submission.id} className="p-5 space-y-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-950">{assignment.title}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {locale === "bn" ? "জমা দেওয়া হয়েছে" : "Submitted"}: {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="p-2 border rounded-lg bg-emerald-50 text-emerald-800 border-emerald-200 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Score: {submission.marks} / {assignment.maxMarks}
                    </div>
                  </div>

                  <div className="p-3 border rounded bg-slate-50/50 text-xs text-slate-600 leading-normal italic">
                    <span className="font-bold text-slate-800 block mb-1">{locale === "bn" ? "আপনার উত্তর" : "Your Solution"}:</span>
                    &quot;{submission.answer}&quot;
                  </div>

                  {submission.feedback && (
                    <div className="text-xs text-slate-700 leading-normal p-3 border border-emerald-100 bg-emerald-50/10 rounded-lg flex items-start gap-1.5">
                      <MessageSquare className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 block mb-0.5">{locale === "bn" ? "শিক্ষকের মন্তব্য" : "Teacher Feedback"}:</span>
                        &quot;{submission.feedback}&quot;
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

          {studentTasks.filter(t => t.submission?.status === "Graded").length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-12">
              {locale === "bn" ? "কোনো অ্যাসাইনমেন্টের মূল্যায়ন এখনো সম্পন্ন করা হয়নি।" : "No assignments have been evaluated or graded yet."}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}