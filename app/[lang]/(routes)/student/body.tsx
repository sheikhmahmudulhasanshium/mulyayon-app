"use client"

import * as React from "react"
import { useStudent } from "@/hooks/student/use-student"
import { apiClient } from "@/lib/api"
import { GraduationCap, Award, BookOpen, ChevronRight } from "lucide-react"
import Link from "next/link"

interface BodyProps {
  locale: "en" | "bn"
}

export default function Body({ locale }: BodyProps) {
  const { getMyAssignments, getMySubjects, loading } = useStudent()
  const [totalTasks, setTotalTasks] = React.useState(0)
  const [totalSubjects, setTotalSubjects] = React.useState(0)
  const [studentName, setStudentName] = React.useState("")

  const loadSummary = React.useCallback(async () => {
    try {
      const [tasks, subjects, profile] = await Promise.all([
        getMyAssignments(),
        getMySubjects(),
        apiClient("student/me", { method: "GET" })
      ])
      
      setTotalTasks(tasks.length)
      setTotalSubjects(subjects.length)
      if (profile && profile.name) {
        setStudentName(profile.name)
      }
    } catch {
      // Handled silently
    }
  }, [getMyAssignments, getMySubjects])

  React.useEffect(() => {
    let isMounted = true
    const timer = setTimeout(() => {
      if (isMounted) {
        loadSummary()
      }
    }, 0)
    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [loadSummary])

  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded"></div>
        <div className="h-32 bg-muted rounded"></div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="p-6 border rounded-xl bg-linear-to-r from-blue-900 to-indigo-950 text-white shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-bold">
          {locale === "bn" 
            ? `স্বাগতম, ${studentName || "শিক্ষার্থী"}!` 
            : `Welcome back, ${studentName || "Student"}!`}
        </h1>
        <p className="text-xs text-blue-200 mt-1.5 leading-relaxed">
          {locale === "bn" 
            ? "আপনার বিষয়, বাড়ির কাজ এবং গ্রেড রিপোর্ট পরিচালনা করতে বাম দিকের প্যানেল ব্যবহার করুন।" 
            : "Monitor your enrolled courses, complete assignments, and track evaluation scores."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href={`/${locale}/student/assignments`} className="p-5 border rounded-xl bg-background hover:shadow-md transition-all flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {locale === "bn" ? "চলতি বাড়ির কাজ" : "My Homeworks"}
            </span>
            <p className="text-2xl font-black text-slate-900">{totalTasks} {locale === "bn" ? "টি" : "Active"}</p>
          </div>
          <GraduationCap className="h-8 w-8 text-blue-900/10 group-hover:text-blue-900/25 transition-colors" />
        </Link>

        <Link href={`/${locale}/student/subjects`} className="p-5 border rounded-xl bg-background hover:shadow-md transition-all flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {locale === "bn" ? "আমার বিষয়সমূহ" : "My Subjects"}
            </span>
            <p className="text-2xl font-black text-slate-900">{totalSubjects} {locale === "bn" ? "টি" : "Registered"}</p>
          </div>
          <BookOpen className="h-8 w-8 text-blue-900/10 group-hover:text-blue-900/25 transition-colors" />
        </Link>

        <Link href={`/${locale}/student/grades`} className="p-5 border rounded-xl bg-background hover:shadow-md transition-all flex items-center justify-between group sm:col-span-2 lg:col-span-1">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {locale === "bn" ? "গ্রেড রিপোর্ট" : "Reports"}
            </span>
            <p className="text-2xl font-black text-slate-900 flex items-center gap-1">
              {locale === "bn" ? "রিপোর্ট কার্ড" : "Grades"} <ChevronRight className="h-4 w-4" />
            </p>
          </div>
          <Award className="h-8 w-8 text-blue-900/10 group-hover:text-blue-900/25 transition-colors" />
        </Link>
      </div>
    </div>
  )
}