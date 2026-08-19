"use client"

import * as React from "react"
import { useTeachers } from "@/hooks/admin/use-teachers"
import { useSubjects } from "@/hooks/admin/use-subjects"
import { useAuth } from "@/providers/auth-provider"
import { User, PaginatedResult } from "@/types/api"
import TeacherFilters from "./TeacherFilter"
import { AlertCircle, UserMinus, UserCheck, ShieldAlert, ChevronLeft, ChevronRight } from "lucide-react"

interface BodyProps {
  locale: "en" | "bn"
}

const translations = {
  en: {
    title: "Teacher Allocation",
    subtitle: "Search, map, assign, or de-allocate teachers to designated subjects.",
    searchTitle: "Search & Filter Teachers",
    level: "Level",
    specialty: "Specialty",
    version: "Academic Version",
    unassignedOnly: "Show Only Unassigned",
    search: "Search Database",
    subjectToAssign: "Target Subject mapping",
    unassignedBanner: "Currently, there are {count} unassigned teachers.",
    assign: "Assign",
    unassign: "Unassign",
    results: "Search Results",
    teacherColumn: "Teacher",
    role: "Role",
    actions: "Assignment Actions",
    any: "Any",
    all: "All",
    empty: "No teachers match these filters.",
    successAssign: "Teacher successfully assigned",
    successUnassign: "Teacher successfully unassigned",
    choose: "Choose Subject",
    prev: "Previous",
    next: "Next",
    pageOf: "Page {page} of {total}"
  },
  bn: {
    title: "শিক্ষক বণ্টন ব্যবস্থাপনা",
    subtitle: "নির্দিষ্ট বিষয়ের সাথে শিক্ষকদের বণ্টন, খোঁজা ও সমন্বয় করা।",
    searchTitle: "শিক্ষক ফিল্টার ও অনুসন্ধান",
    level: "স্তর",
    specialty: "বিশেষত্ব (Specialty)",
    version: "একাডেমিক ভার্সন",
    unassignedOnly: "শুধুমাত্র বরাদ্দহীন দেখান",
    search: "অনুসন্ধান করুন",
    subjectToAssign: "উদ্দিষ্ট বিষয় নির্ধারণ",
    unassignedBanner: "বর্তমানে ডাটাবেজে {count} জন বরাদ্দহীন শিক্ষক আছেন।",
    assign: "বরাদ্দ করুন",
    unassign: "বরাদ্দ বাতিল করুন",
    results: "অনুসন্ধান ফলাফল",
    teacherColumn: "শিক্ষক",
    role: "পদবী",
    actions: "বণ্টন কাজ",
    any: "যেকোনো",
    all: "সব",
    empty: "ফিল্টারের সাথে মিল রয়েছে এমন কোনো শিক্ষক পাওয়া যায়নি।",
    successAssign: "শিক্ষক বণ্টন সফল হয়েছে",
    successUnassign: "শিক্ষক বণ্টন বাতিল সফল হয়েছে",
    choose: "বিষয় নির্বাচন করুন",
    prev: "পূর্ববর্তী",
    next: "পরবর্তী",
    pageOf: "পৃষ্ঠা {page} / {total}"
  }
}

export default function TeachersBody({ locale }: BodyProps) {
  const { loading: teachersLoading, error: teachersError, assignTeacher, unassignTeacher, getUnassignedTeachers, getTeachersPaginated } = useTeachers()
  const { subjects, loading: subjectsLoading } = useSubjects()
  const { isLoading: authLoading, isAuthenticated } = useAuth()
  const t = translations[locale]

  // Filter local state
  const [level, setLevel] = React.useState("")
  const [specialty, setSpecialty] = React.useState("")
  const [version, setVersion] = React.useState("")
  const [onlyUnassigned, setOnlyUnassigned] = React.useState(false)

  const [paginatedTeachers, setPaginatedTeachers] = React.useState<PaginatedResult<User> | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [unassignedCount, setUnassignedCount] = React.useState(0)
  const [selectedSubjectId, setSelectedSubjectId] = React.useState("")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [notif, setNotif] = React.useState<{ type: "success" | "error"; msg: string } | null>(null)

  const fetchUnassignedSummary = React.useCallback(async () => {
    if (authLoading || !isAuthenticated) return
    try {
      const data = await getUnassignedTeachers()
      setUnassignedCount(data.count)
    } catch {
      // Handled silently
    }
  }, [authLoading, isAuthenticated, getUnassignedTeachers])

  const handleSearch = React.useCallback(async (pageNo = 1) => {
    if (authLoading || !isAuthenticated) return
    try {
      const results = await getTeachersPaginated({
        level: level || undefined,
        specialty: specialty || undefined,
        version: version || undefined,
        page: pageNo,
        pageSize: 10
      })
      setPaginatedTeachers(results)
      setCurrentPage(pageNo)
    } catch (err) {
      setNotif({ type: "error", msg: err instanceof Error ? err.message : "Search failed" })
    }
  }, [authLoading, isAuthenticated, level, specialty, version, getTeachersPaginated])

  React.useEffect(() => {
    let isMounted = true

    const loadInitialData = async () => {
      if (isMounted) {
        await Promise.all([
          fetchUnassignedSummary(),
          handleSearch(1)
        ])
      }
    }

    const timer = setTimeout(() => {
      loadInitialData()
    }, 0)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [fetchUnassignedSummary, handleSearch])

  const handleAssign = async (teacherId: string) => {
    if (!selectedSubjectId) return
    setIsProcessing(true)
    setNotif(null)
    try {
      await assignTeacher(teacherId, selectedSubjectId)
      setNotif({ type: "success", msg: t.successAssign })
      fetchUnassignedSummary()
      handleSearch(currentPage)
    } catch (err) {
      setNotif({ type: "error", msg: err instanceof Error ? err.message : "Action failed" })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUnassign = async (teacherId: string) => {
    if (!selectedSubjectId) return
    setIsProcessing(true)
    setNotif(null)
    try {
      await unassignTeacher(teacherId, selectedSubjectId)
      setNotif({ type: "success", msg: t.successUnassign })
      fetchUnassignedSummary()
      handleSearch(currentPage)
    } catch (err) {
      setNotif({ type: "error", msg: err instanceof Error ? err.message : "Action failed" })
    } finally {
      setIsProcessing(false)
    }
  }

  const isLoading = teachersLoading || subjectsLoading || authLoading
  const activeError = notif?.msg || teachersError

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t.subtitle}</p>
      </div>

      {activeError && (
        <div className={`p-4 border rounded-lg text-sm flex items-center gap-3 ${
          notif?.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"
        }`}>
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{activeError}</span>
        </div>
      )}

      <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-center gap-3">
        <ShieldAlert className="h-6 w-6 text-amber-700 shrink-0" />
        <p className="text-sm font-medium">
          {t.unassignedBanner.replace("{count}", String(unassignedCount))}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <TeacherFilters
          level={level}
          setLevel={setLevel}
          specialty={specialty}
          setSpecialty={setSpecialty}
          version={version}
          setVersion={setVersion}
          onlyUnassigned={onlyUnassigned}
          setOnlyUnassigned={setOnlyUnassigned}
          onSearch={() => handleSearch(1)}
          t={t}
        />

        <div className="md:col-span-2 space-y-4">
          <div className="p-5 border rounded-xl bg-background shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-slate-900">{t.subjectToAssign}</h3>
            </div>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="flex h-10 w-full sm:max-w-xs rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
            >
              <option value="">-- {t.choose} --</option>
              {subjects.map((subj) => (
                <option key={subj.id} value={subj.id}>
                  {subj.name}
                </option>
              ))}
            </select>
          </div>

          <div className="border rounded-xl bg-background shadow-sm overflow-hidden">
            {isLoading && !paginatedTeachers ? (
              <div className="p-8 space-y-4 animate-pulse">
                {[...Array(2)].map((_, idx) => (
                  <div key={idx} className="h-10 bg-muted rounded-md" />
                ))}
              </div>
            ) : !paginatedTeachers || paginatedTeachers.data.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">{t.empty}</div>
            ) : (
              <div>
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b bg-muted/20 font-medium text-slate-500">
                      <th className="p-4">{t.teacherColumn}</th>
                      <th className="p-4">{t.role}</th>
                      <th className="p-4 text-right">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {paginatedTeachers.data.map((teacher: User) => (
                      <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{teacher.name}</div>
                          <div className="text-xs text-slate-500">{teacher.email}</div>
                        </td>
                        <td className="p-4">
                          <span className="text-xs bg-slate-100 border text-slate-800 px-2.5 py-0.5 rounded-full font-semibold">
                            {teacher.role}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleAssign(teacher.id)}
                              disabled={isProcessing || !selectedSubjectId}
                              className="inline-flex items-center justify-center gap-1 px-3 h-8 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 rounded-lg transition-colors"
                            >
                              <UserCheck className="h-3.5 w-3.5" />
                              {t.assign}
                            </button>
                            <button
                              onClick={() => handleUnassign(teacher.id)}
                              disabled={isProcessing || !selectedSubjectId}
                              className="inline-flex items-center justify-center gap-1 px-3 h-8 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-40 rounded-lg transition-colors"
                            >
                              <UserMinus className="h-3.5 w-3.5" />
                              {t.unassign}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                {paginatedTeachers.totalPage > 1 && (
                  <div className="flex items-center justify-between border-t p-4 bg-muted/20">
                    <button
                      onClick={() => handleSearch(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="inline-flex items-center gap-1 px-3 h-8 text-xs font-semibold border rounded-lg hover:bg-accent disabled:opacity-40 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      {t.prev}
                    </button>
                    <span className="text-xs text-muted-foreground">
                      {t.pageOf
                        .replace("{page}", String(currentPage))
                        .replace("{total}", String(paginatedTeachers.totalPage))}
                    </span>
                    <button
                      onClick={() => handleSearch(Math.min(paginatedTeachers.totalPage, currentPage + 1))}
                      disabled={currentPage === paginatedTeachers.totalPage}
                      className="inline-flex items-center gap-1 px-3 h-8 text-xs font-semibold border rounded-lg hover:bg-accent disabled:opacity-40 transition-colors"
                    >
                      {t.next}
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}