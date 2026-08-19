"use client"

import * as React from "react"
import { useSubjects } from "@/hooks/admin/use-subjects"
import { useCourses } from "@/hooks/admin/use-courses"
import { AlertCircle, RefreshCw, Edit2, Trash2, Check, X } from "lucide-react"
import AddSubjectForm from "@/components/forms/admin/add-subject-form"

interface BodyProps {
  locale: "en" | "bn"
}

const translations = {
  en: {
    title: "Subjects Management",
    subtitle: "Create and map subject areas to specific academic courses or classes.",
    addSubject: "Add Subject",
    subjectName: "Subject Name",
    placeholder: "Enter subject name...",
    selectCourse: "Select Associated Course",
    choose: "-- Choose Course --",
    course: "Associated Course",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    confirmDelete: "Are you sure you want to delete this subject?",
    empty: "No subjects found.",
    refresh: "Refresh",
  },
  bn: {
    title: "বিষয়সমূহ ব্যবস্থাপনা",
    subtitle: "নির্দিষ্ট অ্যাকাডেমিক কোর্স বা ক্লাসের সাথে বিষয়ের ম্যাপিং করুন।",
    addSubject: "নতুন বিষয় যুক্ত করুন",
    subjectName: "বিষয়ের নাম",
    placeholder: "বিষয়ের নাম লিখুন...",
    selectCourse: "সংশ্লিষ্ট কোর্স নির্বাচন",
    choose: "-- কোর্স নির্বাচন করুন --",
    course: "সংশ্লিষ্ট কোর্স",
    actions: "অ্যাকশন",
    edit: "সম্পাদনা",
    delete: "মুছুন",
    save: "সংরক্ষণ",
    cancel: "বাতিল",
    confirmDelete: "আপনি কি নিশ্চিত যে এই বিষয়টি মুছে ফেলতে চান?",
    empty: "কোন বিষয় পাওয়া যায়নি।",
    refresh: "রিফ্রেশ",
  }
}

export default function SubjectsBody({ locale }: BodyProps) {
  const { subjects, loading: subjectsLoading, error: subjectsError, refresh: refreshSubjects, createSubject, updateSubject, deleteSubject } = useSubjects()
  const { courses, loading: coursesLoading, refresh: refreshCourses } = useCourses()
  const t = translations[locale]

  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editingName, setEditingName] = React.useState("")
  const [editingCourseId, setEditingCourseId] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleCreateSubmit = async (name: string, courseId: string) => {
    setIsSubmitting(true)
    try {
      await createSubject(name, courseId)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveEdit = async (id: string) => {
    if (!editingName.trim() || !editingCourseId) return
    try {
      await updateSubject(id, editingName, editingCourseId)
      setEditingId(null)
    } catch {
      // Handled by hook
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm(t.confirmDelete)) {
      try {
        await deleteSubject(id)
      } catch {
        // Handled by hook
      }
    }
  }

  const triggerRefresh = () => {
    refreshSubjects()
    refreshCourses()
  }

  const isLoading = subjectsLoading || coursesLoading

  if (isLoading && subjects.length === 0) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded"></div>
        <div className="h-32 bg-muted rounded-xl"></div>
        <div className="h-64 border rounded-lg bg-background/50 animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t.title}</h1>
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

      {subjectsError && (
        <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg flex items-center gap-3 text-destructive text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{subjectsError}</span>
        </div>
      )}

      <AddSubjectForm courses={courses} onSubmit={handleCreateSubmit} isSubmitting={isSubmitting} t={t} />

      <div className="border rounded-xl bg-background shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b bg-muted/50 font-medium text-muted-foreground">
              <th className="p-4">{t.subjectName}</th>
              <th className="p-4">{t.course}</th>
              <th className="p-4 text-right w-40">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {subjects.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-muted-foreground">
                  {t.empty}
                </td>
              </tr>
            ) : (
              subjects.map((subj) => {
                const currentCourse = courses.find((c) => c.id === subj.courseId)
                return (
                  <tr key={subj.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-medium text-slate-800">
                      {editingId === subj.id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="h-8 px-2 border rounded text-sm w-full max-w-sm focus-visible:outline-none"
                        />
                      ) : (
                        subj.name
                      )}
                    </td>
                    <td className="p-4">
                      {editingId === subj.id ? (
                        <select
                          value={editingCourseId}
                          onChange={(e) => setEditingCourseId(e.target.value)}
                          className="h-8 border rounded text-sm bg-background px-1 focus-visible:outline-none"
                        >
                          {courses.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-xs bg-slate-100 border text-slate-700 font-semibold px-2.5 py-0.5 rounded-full">
                          {currentCourse ? currentCourse.name : subj.courseId}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        {editingId === subj.id ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(subj.id)}
                              className="p-1.5 border rounded hover:bg-accent text-emerald-600"
                              title={t.save}
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 border rounded hover:bg-accent text-rose-600"
                              title={t.cancel}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleStartEdit(subj.id, subj.name, subj.courseId)}
                              className="p-1.5 border rounded hover:bg-accent text-slate-600"
                              title={t.edit}
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(subj.id)}
                              className="p-1.5 border rounded hover:bg-accent text-destructive"
                              title={t.delete}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )

  function handleStartEdit(id: string, name: string, courseId: string) {
    setEditingId(id)
    setEditingName(name)
    setEditingCourseId(courseId)
  }
}