"use client"

import * as React from "react"
import { Plus } from "lucide-react"

interface AddCourseFormProps {
  onSubmit: (name: string) => Promise<void>
  isSubmitting: boolean
  t: {
    addCourse: string
    courseName: string
    placeholder: string
  }
}

export default function AddCourseForm({ onSubmit, isSubmitting, t }: AddCourseFormProps) {
  const [newCourseName, setNewCourseName] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCourseName.trim()) return
    try {
      await onSubmit(newCourseName)
      setNewCourseName("")
    } catch {
      // Handled silently
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 border rounded-xl bg-background shadow-sm space-y-4">
      <h3 className="font-semibold text-slate-900">{t.addCourse}</h3>
      <div className="flex gap-2 max-w-lg">
        <input
          type="text"
          value={newCourseName}
          onChange={(e) => setNewCourseName(e.target.value)}
          placeholder={t.placeholder}
          className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !newCourseName.trim()}
          className="flex items-center gap-1.5 px-4 h-10 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-950 rounded-lg transition-colors disabled:opacity-50 shrink-0"
        >
          <Plus className="h-4 w-4" />
          {t.addCourse}
        </button>
      </div>
    </form>
  )
}