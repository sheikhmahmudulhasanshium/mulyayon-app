"use client"

import * as React from "react"
import { useTeacherStudents } from "@/hooks/teacher/use-teacher-students"
import { User } from "@/types/api"
import { Search, Users, ChevronLeft, ChevronRight, AlertCircle, Mail } from "lucide-react"

export default function Body() {
  const { getMyStudents, loading, error } = useTeacherStudents()
  const [students, setStudents] = React.useState<User[]>([])
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [totalCount, setTotalCount] = React.useState(0)

  const fetchStudents = React.useCallback(async () => {
    const res = await getMyStudents(search, page, 10)
    if (res) {
      setStudents(res.data)
      setTotalPages(res.totalPage)
      setTotalCount(res.totalCount)
    }
  }, [search, page, getMyStudents])

  React.useEffect(() => {
    let isMounted = true

    const timer = setTimeout(() => {
      if (isMounted) {
        fetchStudents()
      }
    }, 0)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [fetchStudents])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Students</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse and look up students currently enrolled in your courses.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name or email..."
            className="w-full h-9 pl-9 pr-4 text-xs border rounded-lg bg-background shadow-sm outline-none focus:border-slate-400"
          />
        </div>
      </div>

      {loading && (
        <div className="space-y-3 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 border rounded-xl bg-muted/40" />
          ))}
        </div>
      )}

      {error && (
        <div className="p-6 flex flex-col items-center justify-center min-h-[30vh] space-y-2 border rounded-xl bg-destructive/5">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm font-semibold text-slate-900">{error}</p>
        </div>
      )}

      {!loading && !error && students.length === 0 && (
        <div className="p-12 text-center border rounded-xl text-muted-foreground">
          No matching students found in your directory.
        </div>
      )}

      {!loading && !error && students.length > 0 && (
        <>
          <div className="border rounded-xl bg-background overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100">
              {students.map((student) => (
                <div key={student.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                      <Users className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-950">{student.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Mail className="h-3.5 w-3.5" /> {student.email}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-xs text-muted-foreground font-semibold">
                Showing Page {page} of {totalPages} ({totalCount} total students)
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