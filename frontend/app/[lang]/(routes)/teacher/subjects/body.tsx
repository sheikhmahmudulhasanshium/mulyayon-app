"use client"

import * as React from "react"
import { useTeacherStudents, MySubjectResponse } from "@/hooks/teacher/use-teacher-students"
import { ChevronLeft, ChevronRight, AlertCircle, Layers } from "lucide-react"

export default function Body() {
  const { getMySubjects, loading, error } = useTeacherStudents()
  const [subjects, setSubjects] = React.useState<MySubjectResponse[]>([])
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [totalCount, setTotalCount] = React.useState(0)

  const fetchSubjects = React.useCallback(async () => {
    const res = await getMySubjects(page, 8)
    if (res) {
      setSubjects(res.data)
      setTotalPages(res.totalPage)
      setTotalCount(res.totalCount)
    }
  }, [page, getMySubjects])

  React.useEffect(() => {
    let isMounted = true

    const timer = setTimeout(() => {
      if (isMounted) {
        fetchSubjects()
      }
    }, 0)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [fetchSubjects])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Subjects</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Specific curricular subjects mapped to your assignments.
        </p>
      </div>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 border rounded-xl bg-muted/40" />
          ))}
        </div>
      )}

      {error && (
        <div className="p-6 flex flex-col items-center justify-center min-h-[30vh] space-y-2 border rounded-xl bg-destructive/5">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm font-semibold text-slate-900">{error}</p>
        </div>
      )}

      {!loading && !error && subjects.length === 0 && (
        <div className="p-12 text-center border rounded-xl text-muted-foreground">
          No individual subjects are currently assigned to you.
        </div>
      )}

      {!loading && !error && subjects.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((sub) => (
              <div key={sub.id} className="p-5 border rounded-xl bg-background shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-muted-foreground">
                    <Layers className="h-3.5 w-3.5" />
                    {sub.courseName || "Unknown Class"}
                  </div>
                  <h3 className="text-md font-bold text-slate-950">{sub.name}</h3>
                  <p className="text-xs text-muted-foreground font-semibold">{sub.nameBn}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-xs text-muted-foreground font-semibold">
                Showing Page {page} of {totalPages} ({totalCount} total subjects)
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