"use client"

import * as React from "react"
import { useCourses } from "@/hooks/admin/use-courses"
import { useStats } from "@/hooks/admin/use-stats"
import { useAuth } from "@/providers/auth-provider"
import { Course, PaginatedCoursesResult } from "@/types/api"
import { 
  AlertCircle, 
  RefreshCw, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  ChevronRight, 
  ArrowLeft,
  ChevronLeft,
  Users
} from "lucide-react"
import AddCourseForm from "@/components/forms/admin/add-course-form"

interface BodyProps {
  locale: "en" | "bn"
}

const translations = {
  en: {
    title: "Courses Management",
    subtitle: "Configure academic classes, view enrollments, and manage records.",
    addCourse: "Add Course",
    courseName: "Course Name",
    placeholder: "Enter course name...",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    confirmDelete: "Are you sure you want to delete this course?",
    loading: "Loading classes configuration...",
    empty: "No classes found under this category.",
    refresh: "Refresh",
    enrolledStudents: "Enrolled Students",
    stepMedium: "1. Select Medium / Version",
    stepLevel: "2. Select Level",
    bvLabel: "Bangla Version (BV)",
    evLabel: "English Version (EV)",
    primary: "Primary",
    secondary: "Secondary",
    higherSecondary: "Higher Secondary",
    backBtn: "Back",
    allClasses: "Classes List",
    prev: "Previous",
    next: "Next",
    pageOf: "Page {page} of {total}"
  },
  bn: {
    title: "কোর্সসমূহ ব্যবস্থাপনা",
    subtitle: "একাডেমিক ক্লাস কনফিগার করুন, শিক্ষার্থীর সংখ্যা দেখুন এবং রেকর্ড পরিচালনা করুন।",
    addCourse: "নতুন কোর্স যুক্ত করুন",
    courseName: "কোর্সের নাম",
    placeholder: "কোর্সের নাম লিখুন...",
    actions: "অ্যাকশন",
    edit: "সম্পাদনা",
    delete: "মুছুন",
    save: "সংরক্ষণ",
    cancel: "বাতিল",
    confirmDelete: "আপনি কি নিশ্চিত যে এই কোর্সটি মুছে ফেলতে চান?",
    loading: "ক্লাস কনফিগারেশন লোড হচ্ছে...",
    empty: "এই বিভাগে কোনো ক্লাস পাওয়া যায়নি।",
    refresh: "রিফ্রেশ",
    enrolledStudents: "ভর্তিকৃত শিক্ষার্থী সংখ্যা",
    stepMedium: "১. ভার্সন / মাধ্যম নির্বাচন করুন",
    stepLevel: "২. স্তর নির্বাচন করুন",
    bvLabel: "বাংলা ভার্সন (BV)",
    evLabel: "ইংরেজি ভার্সন (EV)",
    primary: "প্রাথমিক",
    secondary: "মাধ্যমিক",
    higherSecondary: "উচ্চ মাধ্যমিক",
    backBtn: "পেছনে যান",
    allClasses: "ক্লাস সমূহ",
    prev: "পূর্ববর্তী",
    next: "পরবর্তী",
    pageOf: "পৃষ্ঠা {page} / {total}"
  }
}

export default function CoursesBody({ locale }: BodyProps) {
  const { loading: coursesLoading, error: coursesError, getCoursesPaginated, createCourse, updateCourse, deleteCourse } = useCourses()
  const { loading: statsLoading, refresh: refreshStats } = useStats()
  const { isLoading: authLoading, isAuthenticated } = useAuth()
  const t = translations[locale]

  // Flow State
  const [selectedVersion, setSelectedVersion] = React.useState<"BV" | "EV" | null>(null)
  const [selectedLevel, setSelectedLevel] = React.useState<string | null>(null)
  
  // Paginated Courses Data
  const [paginatedData, setPaginatedData] = React.useState<PaginatedCoursesResult | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)

  // Edit State
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editingName, setEditingName] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const levelOptions = ["Primary", "Secondary", "Higher Secondary"]

  const fetchCurrentCourses = React.useCallback(async (version: "BV" | "EV", level: string, page: number) => {
    if (authLoading || !isAuthenticated) return
    try {
      const result = await getCoursesPaginated(version, level, page, 6)
      setPaginatedData(result)
    } catch {
      // Handled inside hook
    }
  }, [authLoading, isAuthenticated, getCoursesPaginated])

  React.useEffect(() => {
    let isMounted = true
    const timer = setTimeout(() => {
      if (isMounted && selectedVersion && selectedLevel) {
        fetchCurrentCourses(selectedVersion, selectedLevel, currentPage)
      }
    }, 0)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [selectedVersion, selectedLevel, currentPage, fetchCurrentCourses])

  const handleReset = () => {
    setSelectedVersion(null)
    setSelectedLevel(null)
    setPaginatedData(null)
    setCurrentPage(1)
    setEditingId(null)
  }

  const handleCreateSubmit = async (name: string) => {
    setIsSubmitting(true)
    try {
      await createCourse(name)
      if (selectedVersion && selectedLevel) {
        fetchCurrentCourses(selectedVersion, selectedLevel, currentPage)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveEdit = async (id: string) => {
    if (!editingName.trim()) return
    try {
      await updateCourse(id, editingName)
      setEditingId(null)
      if (selectedVersion && selectedLevel) {
        fetchCurrentCourses(selectedVersion, selectedLevel, currentPage)
      }
    } catch {
      // Handled inside hook
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm(t.confirmDelete)) {
      try {
        await deleteCourse(id)
        if (selectedVersion && selectedLevel) {
          fetchCurrentCourses(selectedVersion, selectedLevel, currentPage)
        }
      } catch {
        // Handled inside hook
      }
    }
  }

  const triggerRefresh = () => {
    if (selectedVersion && selectedLevel) {
      fetchCurrentCourses(selectedVersion, selectedLevel, currentPage)
    }
    refreshStats()
  }

  const isLoading = coursesLoading || statsLoading || authLoading

  if (isLoading && !paginatedData) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded"></div>
        <div className="h-24 bg-muted rounded-xl"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{t.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t.subtitle}</p>
        </div>
        <button
          onClick={triggerRefresh}
          className="self-start md:self-auto flex items-center justify-center h-9 px-3 text-xs font-semibold border rounded-lg hover:bg-accent transition-colors gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {t.refresh}
        </button>
      </div>

      {coursesError && (
        <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg flex items-center gap-3 text-destructive text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{coursesError}</span>
        </div>
      )}

      <AddCourseForm 
        onSubmit={handleCreateSubmit} 
        isSubmitting={isSubmitting} 
        t={{
          addCourse: t.addCourse,
          courseName: t.courseName,
          placeholder: t.placeholder
        }} 
      />

      {/* Option Cards Interface */}
      <div className="p-6 border rounded-xl bg-background shadow-sm space-y-6">
        
        {/* Step 1: Medium selection */}
        {!selectedVersion && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-500">{t.stepMedium}</h4>
            <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
              <button
                onClick={() => setSelectedVersion("BV")}
                className="flex flex-col items-start p-5 border rounded-xl hover:bg-slate-50/50 text-left transition-all"
              >
                <span className="text-lg font-bold text-blue-900">{t.bvLabel}</span>
              </button>
              <button
                onClick={() => setSelectedVersion("EV")}
                className="flex flex-col items-start p-5 border rounded-xl hover:bg-slate-50/50 text-left transition-all"
              >
                <span className="text-lg font-bold text-blue-950">{t.evLabel}</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Level Selection */}
        {selectedVersion && !selectedLevel && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span>{selectedVersion === "BV" ? t.bvLabel : t.evLabel}</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-slate-800">{t.stepLevel}</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 max-w-3xl">
              {levelOptions.map((lvl) => {
                const localizedLvl = lvl === "Primary" ? t.primary : lvl === "Secondary" ? t.secondary : lvl === "Higher Secondary" ? t.higherSecondary : lvl
                return (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className="p-4 border rounded-xl hover:bg-slate-50/50 text-left font-bold text-slate-700 dark:text-slate-200 transition-all flex items-center justify-between"
                  >
                    <span>{localizedLvl}</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setSelectedVersion(null)}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t.backBtn}
            </button>
          </div>
        )}

        {/* Step 3: View matching Course Cards Grid */}
        {selectedVersion && selectedLevel && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-3">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                <button onClick={handleReset} className="hover:text-blue-900">{selectedVersion === "BV" ? t.bvLabel : t.evLabel}</button>
                <ChevronRight className="h-3 w-3" />
                <button onClick={() => { setSelectedLevel(null); setPaginatedData(null); }} className="hover:text-blue-900">
                  {selectedLevel === "Primary" ? t.primary : selectedLevel === "Secondary" ? t.secondary : selectedLevel === "Higher Secondary" ? t.higherSecondary : selectedLevel}
                </button>
                <ChevronRight className="h-3 w-3" />
                <span className="text-slate-800">{t.allClasses}</span>
              </div>

              <button
                onClick={() => { setSelectedLevel(null); setPaginatedData(null); }}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {t.backBtn}
              </button>
            </div>

            {!paginatedData || paginatedData.data.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">{t.empty}</div>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedData.data.map((course: Course & { studentCount: number }) => {
                    const isEditing = editingId === course.id

                    return (
                      <div 
                        key={course.id} 
                        className="p-5 border rounded-xl bg-background shadow-sm space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-1">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="h-9 px-2 border rounded-md text-sm w-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-transparent"
                            />
                          ) : (
                            <>
                              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                                {locale === "bn" ? course.nameBn : course.name}
                              </h4>
                              <p className="text-xs text-slate-400 font-semibold">
                                {locale === "bn" ? course.name : course.nameBn}
                              </p>
                            </>
                          )}
                        </div>

                        {/* Student Count Display */}
                        <div className="flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-900 border p-2.5 rounded-lg text-slate-700 dark:text-slate-300">
                          <Users className="h-4 w-4 text-blue-900/70 dark:text-blue-400/70" />
                          <span className="font-medium">{t.enrolledStudents}:</span>
                          <strong className="text-blue-900 dark:text-blue-400 font-bold ml-auto">
                            {course.studentCount}
                          </strong>
                        </div>

                        {/* Card Actions */}
                        <div className="flex items-center justify-end gap-1.5 border-t pt-3">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(course.id)}
                                className="p-1.5 border rounded hover:bg-slate-50 dark:hover:bg-slate-900 text-emerald-600"
                                title={t.save}
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-1.5 border rounded hover:bg-slate-50 dark:hover:bg-slate-900 text-rose-600"
                                title={t.cancel}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => { setEditingId(course.id); setEditingName(course.name); }}
                                className="p-1.5 border rounded hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400"
                                title={t.edit}
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(course.id)}
                                className="p-1.5 border rounded hover:bg-rose-50 dark:hover:bg-rose-950/25 hover:border-destructive/20 text-destructive"
                                title={t.delete}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Pagination Navigation */}
                {paginatedData.totalPage > 1 && (
                  <div className="flex items-center justify-between border-t pt-4">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="inline-flex items-center gap-1 px-3 h-8 text-xs font-semibold border rounded-lg hover:bg-accent disabled:opacity-40 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      {t.prev}
                    </button>
                    <span className="text-xs text-muted-foreground">
                      {t.pageOf
                        .replace("{page}", String(currentPage))
                        .replace("{total}", String(paginatedData.totalPage))}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(paginatedData.totalPage, p + 1))}
                      disabled={currentPage === paginatedData.totalPage}
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
        )}
      </div>
    </div>
  )
}