"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { Course } from "@/types/api"

interface AddSubjectFormProps {
  courses: Course[]
  onSubmit: (name: string, courseId: string) => Promise<void>
  isSubmitting: boolean
  t: {
    addSubject: string
    subjectName: string
    placeholder: string
    selectCourse: string
    choose: string
  }
}

export default function AddSubjectForm({ courses, onSubmit, isSubmitting, t }: AddSubjectFormProps) {
  const [newSubjName, setNewSubjName] = React.useState("")
  const [newCourseId, setNewCourseId] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubjName.trim() || !newCourseId) return
    try {
      await onSubmit(newSubjName, newCourseId)
      setNewSubjName("")
      setNewCourseId("")
    } catch {
      // Handled silently
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 border rounded-xl bg-background shadow-sm space-y-4">
      <h3 className="font-semibold text-slate-900">{t.addSubject}</h3>
      <div className="grid gap-4 md:grid-cols-3 max-w-4xl">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">{t.subjectName}</label>
          <input
            type="text"
            value={newSubjName}
            onChange={(e) => setNewSubjName(e.target.value)}
            placeholder={t.placeholder}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">{t.selectCourse}</label>
          <select
            value={newCourseId}
            onChange={(e) => setNewCourseId(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none"
            disabled={isSubmitting}
          >
            <option value="">{t.choose}</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={isSubmitting || !newSubjName.trim() || !newCourseId}
            className="flex w-full items-center justify-center gap-1.5 px-4 h-10 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-950 rounded-lg transition-colors disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {t.addSubject}
          </button>
        </div>
      </div>
    </form>
  )
}