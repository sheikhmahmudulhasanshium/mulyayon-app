"use client"

import * as React from "react"
import { useTeacherStudents } from "@/hooks/teacher/use-teacher-students"
import { User } from "@/types/api"
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"

export default function Body() {
  const { getMyColleagues, loading, error } = useTeacherStudents()
  const [colleagues, setColleagues] = React.useState<User[]>([])
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [totalCount, setTotalCount] = React.useState(0)

  const fetchColleagues = React.useCallback(async () => {
    const res = await getMyColleagues(page, 6)
    if (res) {
      setColleagues(res.data)
      setTotalPages(res.totalPage)
      setTotalCount(res.totalCount)
    }
  }, [page, getMyColleagues])

  React.useEffect(() => {
    let isMounted = true

    const timer = setTimeout(() => {
      if (isMounted) {
        fetchColleagues()
      }
    }, 0)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [fetchColleagues])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Department Colleagues</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Peers who teach within the same specialties and academic levels.
        </p>
      </div>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-36 border rounded-xl bg-muted/40" />
          ))}
        </div>
      )}

      {error && (
        <div className="p-6 flex flex-col items-center justify-center min-h-[30vh] space-y-2 border rounded-xl bg-destructive/5">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm font-semibold text-slate-900">{error}</p>
        </div>
      )}

      {!loading && !error && colleagues.length === 0 && (
        <div className="p-12 text-center border rounded-xl text-muted-foreground">
          No other teachers found matching your specific specialties or levels.
        </div>
      )}

      {!loading && !error && colleagues.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {colleagues.map((peer) => (
              <div key={peer.id} className="p-5 border rounded-xl bg-background shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="space-y-1">
                  <h3 className="text-md font-bold text-slate-950">{peer.name}</h3>
                  <p className="text-xs text-muted-foreground">{peer.email}</p>
                </div>

                <div className="border-t pt-3 space-y-2">
                  {peer.specialties && peer.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {peer.specialties.slice(0, 3).map((spec) => (
                        <span key={spec} className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-blue-50 text-blue-900 border border-blue-100">
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}

                  {peer.levels && peer.levels.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {peer.levels.slice(0, 2).map((lvl) => (
                        <span key={lvl} className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-100 text-slate-700 border">
                          {lvl}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-xs text-muted-foreground font-semibold">
                Showing Page {page} of {totalPages} ({totalCount} total colleagues)
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