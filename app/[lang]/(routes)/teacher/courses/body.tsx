"use client"

import * as React from "react"
import { useTeacherStudents } from "@/hooks/teacher/use-teacher-students"
import { Course } from "@/types/api"
import { GraduationCap, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"

export default function Body() {
  const { getMyCourses, loading, error } = useTeacherStudents()
  const [courses, setCourses] = React.useState<Course[]>([])
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [totalCount, setTotalCount] = React.useState(0)

  const fetchCourses = React.useCallback(async () => {
    const res = await getMyCourses(page, 8)
    if (res) {
      setCourses(res.data)
      setTotalPages(res.totalPage)
      setTotalCount(res.totalCount)
    }
  }, [page, getMyCourses])

  React.useEffect(() => {
    let isMounted = true

    const timer = setTimeout(() => {
      if (isMounted) {
        fetchCourses()
      }
    }, 0)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [fetchCourses])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Courses</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Classes where you are actively assigned to teach.
        </p>
      </div>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 border rounded-xl bg-muted/40" />
          ))}
        </div>
      )}

      {error && (
        <div className="p-6 flex flex-col items-center justify-center min-h-[30vh] space-y-2 border rounded-xl bg-destructive/5">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm font-semibold text-slate-900">{error}</p>
        </div>
      )}

      {!loading && !error && courses.length === 0 && (
        <div className="p-12 text-center border rounded-xl text-muted-foreground">
          No courses currently assigned to your portfolio.
        </div>
      )}

      {!loading && !error && courses.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => (
              <div key={course.id} className="p-5 border rounded-xl bg-background shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{course.level}</p>
                  <h3 className="text-lg font-bold text-slate-900">{course.name}</h3>
                  <p className="text-xs text-muted-foreground font-semibold">{course.version} Version</p>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-900">
                  <GraduationCap className="h-5 w-5" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-xs text-muted-foreground font-semibold">
                Showing Page {page} of {totalPages} ({totalCount} total classes)
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-2 border rounded-md hover:bg-accent disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2 border rounded-md hover:bg-accent disabled:opacity-50 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}