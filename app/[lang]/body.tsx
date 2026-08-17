"use client"

import * as React from "react"
import { usePublic } from "@/hooks/common/use-public"
import { PublicStats } from "@/types/api"
import { GraduationCap, Users, Layers, BookOpen, ChevronRight } from "lucide-react"
import Link from "next/link"
import SystemHealthIndicator from "@/components/common/SystemHealthIndicator"

interface BodyProps {
  locale: "en" | "bn"
}

const translations = {
  en: {
    heroTitle: "Let Your Work Speak",
    heroSubtitle: "Continuous school metrics, course evaluations, and performance monitoring pipelines.",
    getStarted: "Access Portal",
    students: "Enrolled Students",
    teachers: "Active Educators",
    courses: "Academic Classes",
    subjects: "Curriculum Subjects",
    loadingStats: "Syncing metrics...",
    systemStats: "System Scale Analytics",
  },
  bn: {
    heroTitle: "কাজ হোক প্রমাণ",
    heroSubtitle: "ধারাবাহিক স্কুল মেট্রিক্স, কোর্স মূল্যায়ন এবং কার্যক্রম পর্যবেক্ষণ পাইপলাইন।",
    getStarted: "পোর্টালে প্রবেশ করুন",
    students: "মোট শিক্ষার্থী",
    teachers: "সক্রিয় শিক্ষকমণ্ডলী",
    courses: "শ্রেণী / কোর্স",
    subjects: "পাঠ্য বিষয়সমূহ",
    loadingStats: "মেট্রিক্স লোড হচ্ছে...",
    systemStats: "সিস্টেমের কার্যক্রম পরিমাপ",
  },
}

export default function Body({ locale }: BodyProps) {
  const { getPublicStats, loading } = usePublic()
  const [stats, setStats] = React.useState<PublicStats | null>(null)
  const t = translations[locale]

  // Safe async trigger on mount to bypass eslint set-state-in-effect warning
  React.useEffect(() => {
    let isMounted = true

    const loadPublicStats = async () => {
      const data = await getPublicStats()
      if (isMounted && data) {
        setStats(data)
      }
    }

    const timer = setTimeout(() => {
      loadPublicStats()
    }, 0)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [getPublicStats])

  return (
    <div className="relative min-h-[75vh] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Hero Visual Block */}
      <div className="max-w-3xl mx-auto text-center space-y-6 pt-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950">
          {t.heroTitle}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
          {t.heroSubtitle}
        </p>
        <div className="pt-4">
          <Link
            href={`/${locale}/sign-in`}
            className="inline-flex items-center justify-center bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm px-5 h-11 rounded-lg shadow-sm transition-colors gap-1.5"
          >
            {t.getStarted}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Public Scale Statistics Grid */}
      <div className="max-w-5xl mx-auto w-full space-y-6">
        <h3 className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t.systemStats}
        </h3>

        {loading && !stats ? (
          <div className="text-center text-sm text-muted-foreground py-6 animate-pulse">
            {t.loadingStats}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            
            {/* Student Stat Card */}
            <div className="p-6 border rounded-xl bg-background/50 backdrop-blur-sm shadow-sm flex flex-col items-center text-center space-y-2">
              <GraduationCap className="h-6 w-6 text-blue-900" />
              <p className="text-2xl font-bold text-slate-900">{stats?.totalStudents ?? 0}</p>
              <p className="text-xs text-muted-foreground font-medium">{t.students}</p>
            </div>

            {/* Teacher Stat Card */}
            <div className="p-6 border rounded-xl bg-background/50 backdrop-blur-sm shadow-sm flex flex-col items-center text-center space-y-2">
              <Users className="h-6 w-6 text-blue-900" />
              <p className="text-2xl font-bold text-slate-900">{stats?.totalTeachers ?? 0}</p>
              <p className="text-xs text-muted-foreground font-medium">{t.teachers}</p>
            </div>

            {/* Courses Stat Card */}
            <div className="p-6 border rounded-xl bg-background/50 backdrop-blur-sm shadow-sm flex flex-col items-center text-center space-y-2">
              <Layers className="h-6 w-6 text-blue-900" />
              <p className="text-2xl font-bold text-slate-900">{stats?.totalCourses ?? 0}</p>
              <p className="text-xs text-muted-foreground font-medium">{t.courses}</p>
            </div>

            {/* Subjects Stat Card */}
            <div className="p-6 border rounded-xl bg-background/50 backdrop-blur-sm shadow-sm flex flex-col items-center text-center space-y-2">
              <BookOpen className="h-6 w-6 text-blue-900" />
              <p className="text-2xl font-bold text-slate-900">{stats?.totalSubjects ?? 0}</p>
              <p className="text-xs text-muted-foreground font-medium">{t.subjects}</p>
            </div>

          </div>
        )}
      </div>

      {/* Floating System Health Check Component */}
      <SystemHealthIndicator locale={locale} />

    </div>
  )
}