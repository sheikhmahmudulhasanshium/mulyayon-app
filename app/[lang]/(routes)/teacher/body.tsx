"use client"

import * as React from "react"
import { useTeacherStats } from "@/hooks/teacher/use-teacher-stats"
import { useTeacherStudents, TeacherProfile } from "@/hooks/teacher/use-teacher-students"
import { User } from "@/types/api"
import { 
  AlertCircle, 
  RefreshCw, 
  Users, 
  FileText, 
  Layers, 
  CheckSquare, 
  Clock, 
  XCircle,
  TrendingUp,
  Award,
  BookOpen
} from "lucide-react"

interface BodyProps {
  locale: "en" | "bn"
}

const translations = {
  en: {
    welcome: "Welcome back",
    subWelcome: "Here's your professional assessment breakdown for today.",
    title: "Dashboard Overview",
    classesTaught: "Classes Taught",
    activeStudents: "Total Students",
    assignmentsCreated: "Assignments Created",
    submissionsReceived: "Submissions Received",
    pipelineTitle: "Evaluation Progress Pipeline",
    performanceTitle: "Grade Distribution",
    pending: "Pending Evaluation",
    rejected: "Rejected / Needs Revision",
    gradingPerformance: "Evaluation Speed",
    noData: "No metrics available yet.",
    retry: "Retry",
    department: "Your Departments",
    colleaguesTitle: "Department Colleagues",
    colleaguesSub: "Peers teaching in your academic levels & specialties",
    noColleagues: "No peers found in your department.",
    grades: {
      "A+": "A+", A: "A", "A-": "A-", B: "B", C: "C", D: "D", F: "F"
    }
  },
  bn: {
    welcome: "স্বাগতম",
    subWelcome: "আজকের ক্লাসের অ্যাসাইনমেন্ট মূল্যায়ন ও অগ্রগতি চিত্র।",
    title: "ড্যাশবোর্ড সারসংক্ষেপ",
    classesTaught: "আমার ক্লাস",
    activeStudents: "মোট শিক্ষার্থী",
    assignmentsCreated: "অ্যাসাইনমেন্ট তৈরি",
    submissionsReceived: "জমাকৃত অ্যাসাইনমেন্ট",
    pipelineTitle: "অ্যাসাইনমেন্ট মূল্যায়নের পাইপলাইন",
    performanceTitle: "গ্রেড বন্টন চিত্র",
    pending: "মূল্যায়নের অপেক্ষায়",
    rejected: "প্রত্যাখ্যাত / পুনরায় জমা",
    gradingPerformance: "গ্রেডিং মেট্রিক্স",
    noData: "কোনো তথ্য পাওয়া যায়নি।",
    retry: "পুনরায় চেষ্টা করুন",
    department: "আপনার বিভাগসমূহ",
    colleaguesTitle: "বিভাগীয় সহকর্মী বৃন্দ",
    colleaguesSub: "আপনার পাঠ্য বিভাগ ও স্তরের অন্যান্য শিক্ষকবৃন্দ",
    noColleagues: "বিভাগে কোনো সহকর্মী পাওয়া যায়নি।",
    grades: {
      "A+": "এ+", A: "এ", "A-": "এ-", B: "বি", C: "সি", D: "ডি", F: "এফ"
    }
  }
}

export default function Body({ locale }: BodyProps) {
  const t = translations[locale]
  const { stats, loading: statsLoading, error: statsError, refresh } = useTeacherStats()
  const { getMyProfile, getMyColleagues } = useTeacherStudents()

  const [profile, setProfile] = React.useState<TeacherProfile | null>(null)
  const [colleagues, setColleagues] = React.useState<User[]>([])
  const [colleaguesLoading, setColleaguesLoading] = React.useState(false)

  // Fetch the extended profile and colleagues
  const fetchProfileAndColleagues = React.useCallback(async () => {
    setColleaguesLoading(true)
    try {
      const profileData = await getMyProfile()
      if (profileData) {
        setProfile(profileData)
      }
      const colleaguesData = await getMyColleagues(1, 5) // Fetch top 5 departmental colleagues
      if (colleaguesData) {
        setColleagues(colleaguesData.data)
      }
    } catch {
      // Graceful error fallback
    } finally {
      setColleaguesLoading(false)
    }
  }, [getMyProfile, getMyColleagues])

  React.useEffect(() => {
    let isMounted = true
    const timer = setTimeout(() => {
      if (isMounted) {
        fetchProfileAndColleagues()
      }
    }, 0)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [fetchProfileAndColleagues])

  const handleRefreshAll = () => {
    refresh()
    fetchProfileAndColleagues()
  }

  const isPageLoading = statsLoading || colleaguesLoading

  if (isPageLoading && !stats) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-32 border rounded-2xl bg-muted/40"></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 border rounded-xl bg-muted/40"></div>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="h-64 border rounded-xl bg-muted/40 md:col-span-2"></div>
          <div className="h-64 border rounded-xl bg-muted/40"></div>
        </div>
      </div>
    )
  }

  if (statsError) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <div>
          <h3 className="text-lg font-semibold">{statsError}</h3>
          <p className="text-sm text-muted-foreground">Unable to fetch stats. Verify your authentication status.</p>
        </div>
        <button
          onClick={handleRefreshAll}
          className="flex items-center gap-2 px-4 h-10 text-sm font-semibold border rounded-lg hover:bg-accent transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          {t.retry}
        </button>
      </div>
    )
  }

  if (!stats) {
    return <div className="p-6 text-center text-muted-foreground">{t.noData}</div>
  }

  // Submission pipeline metrics
  const totalSubmissions = stats.assignments.submissionsReceived
  const pendingCount = stats.assignments.submissionsPending
  const gradedCount = totalSubmissions - pendingCount - stats.assignments.submissionsRejected
  const evaluationPercentage = totalSubmissions ? Math.round((gradedCount / totalSubmissions) * 100) : 0

  return (
    <div className="p-4 sm:p-6 space-y-6">
      
      {/* Dynamic Profile Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border bg-linear-to-r from-blue-950 to-slate-900 p-6 text-white shadow-md">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {t.welcome}{profile ? `, ${profile.name}` : ""}!
            </h1>
            <p className="text-sm text-slate-300 font-medium">{t.subWelcome}</p>
          </div>
          <button
            onClick={handleRefreshAll}
            className="self-start sm:self-auto flex items-center h-9 px-3 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors gap-1.5 backdrop-blur-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {locale === "bn" ? "রিফ্রেশ" : "Refresh"}
          </button>
        </div>
        <div className="absolute top-0 right-0 h-40 w-40 bg-white/2 rounded-full -translate-y-10 translate-x-10" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        
        <div className="p-4 sm:p-5 border rounded-xl bg-background shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.classesTaught}</p>
            <p className="text-2xl sm:text-3xl font-black">{stats.totalClassesToTake}</p>
          </div>
          <div className="p-2 sm:p-3 rounded-lg bg-blue-50 text-blue-900">
            <Layers className="h-5 sm:h-6 sm:w-6 w-5" />
          </div>
        </div>

        <div className="p-4 sm:p-5 border rounded-xl bg-background shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.activeStudents}</p>
            <p className="text-2xl sm:text-3xl font-black">{stats.totalStudentsInClasses}</p>
          </div>
          <div className="p-2 sm:p-3 rounded-lg bg-emerald-50 text-emerald-700">
            <Users className="h-5 sm:h-6 sm:w-6 w-5" />
          </div>
        </div>

        <div className="p-4 sm:p-5 border rounded-xl bg-background shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.assignmentsCreated}</p>
            <p className="text-2xl sm:text-3xl font-black">{stats.assignments.totalCreated}</p>
          </div>
          <div className="p-2 sm:p-3 rounded-lg bg-purple-50 text-purple-700">
            <FileText className="h-5 sm:h-6 sm:w-6 w-5" />
          </div>
        </div>

        <div className="p-4 sm:p-5 border rounded-xl bg-background shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.submissionsReceived}</p>
            <p className="text-2xl sm:text-3xl font-black">{stats.assignments.submissionsReceived}</p>
          </div>
          <div className="p-2 sm:p-3 rounded-lg bg-amber-50 text-amber-700">
            <CheckSquare className="h-5 sm:h-6 sm:w-6 w-5" />
          </div>
        </div>

      </div>

      {/* Main Analytical Section Grid */}
      <div className="grid gap-6 md:grid-cols-3">

        {/* Column 1 & 2: Main Performance Cards */}
        <div className="md:col-span-2 space-y-6">

          {/* Evaluation Pipeline Card */}
          <div className="p-5 sm:p-6 border rounded-xl bg-background shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{t.pipelineTitle}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Evaluation status for assignments.</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="font-bold text-slate-800">
                  {locale === "bn" ? "মূল্যায়িত" : "Evaluated"}: {gradedCount}
                </span>
                <span className="text-muted-foreground font-semibold">
                  {locale === "bn" ? "মোট জমা" : "Total"}: {totalSubmissions}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border">
                <div 
                  className="bg-blue-900 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${evaluationPercentage}%` }}
                />
              </div>
              <p className="text-right text-xs text-muted-foreground font-bold">
                {evaluationPercentage}% {locale === "bn" ? "মূল্যায়ন সম্পন্ন" : "evaluated"}
              </p>
            </div>

            <div className="border-t pt-4 grid grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg bg-amber-50/50 flex justify-between items-center">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                  {t.pending}
                </span>
                <span className="font-black text-amber-700 text-sm">{stats.assignments.submissionsPending}</span>
              </div>

              <div className="p-3 border rounded-lg bg-red-50/50 flex justify-between items-center">
                <span className="text-xs font-bold text-red-950 flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                  {t.rejected}
                </span>
                <span className="font-black text-red-700 text-sm">{stats.assignments.submissionsRejected}</span>
              </div>
            </div>
          </div>

          {/* Grade Distribution Map */}
          <div className="p-5 sm:p-6 border rounded-xl bg-background shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{t.performanceTitle}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Mapping score distributions.</p>
              </div>
              <TrendingUp className="h-5 w-5 text-muted-foreground/40" />
            </div>

            <div className="border-t pt-4 grid gap-3 sm:grid-cols-2">
              {Object.entries(stats.classPerformance).map(([grade, count]) => {
                const gradePercentage = gradedCount > 0 ? Math.round((count / gradedCount) * 100) : 0;
                return (
                  <div key={grade} className="p-2 border rounded-lg bg-slate-50/50 space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-1"><Award className="h-3.5 w-3.5 text-blue-900/50" /> {grade}</span>
                      <span>{count}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-900 h-full rounded-full"
                        style={{ width: `${gradePercentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

        {/* Column 3: Custom Endpoint Panels (Profile & Colleagues) */}
        <div className="space-y-6">

          {/* Specialties / Department List */}
          {profile && (profile.specialties || profile.levels) && (
            <div className="p-5 border rounded-xl bg-background shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                {t.department}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {profile.specialties?.map(spec => (
                  <span key={spec} className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                    {spec}
                  </span>
                ))}
                {profile.levels?.map(lvl => (
                  <span key={lvl} className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-800 border">
                    {lvl}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Colleague Directory Card */}
          <div className="p-5 border rounded-xl bg-background shadow-sm space-y-4">
            <div>
              <h3 className="text-md font-bold text-slate-950">{t.colleaguesTitle}</h3>
              <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">{t.colleaguesSub}</p>
            </div>

            <div className="border-t pt-3 divide-y divide-slate-100">
              {colleagues.length > 0 ? (
                colleagues.map((col) => (
                  <div key={col.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{col.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{col.email}</p>
                    </div>
                    {col.specialties && col.specialties.length > 0 && (
                      <span className="text-[8px] font-extrabold bg-blue-50/50 border border-blue-200 text-blue-900 px-1.5 py-0.5 rounded">
                        {col.specialties[0]}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">{t.noColleagues}</p>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}