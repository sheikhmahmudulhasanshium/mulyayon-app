"use client"

import * as React from "react"
import { apiClient } from "@/lib/api"
import { Search, Users, Mail, User } from "lucide-react"

interface BodyProps {
  locale: "en" | "bn"
}

interface Classmate {
  id: string
  name: string
  email: string
}

export default function Body({ locale }: BodyProps) {
  const [classmates, setClassmates] = React.useState<Classmate[]>([])
  const [search, setSearch] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)

  const fetchClassmates = React.useCallback(async () => {
    setLoading(true)
    try {
      const endpoint = `student/classmates?search=${encodeURIComponent(search)}&page=${page}&pageSize=9`
      const res = await apiClient(endpoint, { method: "GET" })
      if (res) {
        setClassmates(res.data)
        setTotalPages(res.totalPage)
      }
    } catch {
      // Handled silently
    } finally {
      setLoading(false)
    }
  }, [search, page])

  React.useEffect(() => {
    let isMounted = true
    const timer = setTimeout(() => {
      if (isMounted) {
        fetchClassmates()
      }
    }, 0)
    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [fetchClassmates])

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="p-5 border rounded-xl bg-background shadow-sm space-y-1 flex-1">
          <h3 className="text-md font-bold text-slate-950 flex items-center gap-1.5">
            <Users className="h-5 w-5 text-blue-900" /> 
            {locale === "bn" ? "আমার সহপাঠীবৃন্দ" : "My Classmates"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {locale === "bn" ? "আমার ক্লাসের সহপাঠী ও সহশিক্ষার্থীদের তালিকা" : "Class peers enrolled in the same course directory."}
          </p>
        </div>

        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder={locale === "bn" ? "সহপাঠীর নাম বা ইমেল খুঁজুন..." : "Search peer by name or email..."}
            className="w-full h-11 pl-9 pr-4 text-xs border rounded-lg bg-background shadow-sm outline-none focus:border-slate-400"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading && classmates.length === 0 ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-28 border rounded-xl bg-muted/20 animate-pulse"></div>
          ))
        ) : classmates.length > 0 ? (
          classmates.map((mate) => (
            <div key={mate.id} className="p-5 border rounded-xl bg-background shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 flex items-center justify-center">
                <User className="h-5 w-5 text-slate-600" />
              </div>
              <div className="space-y-1 min-w-0">
                <h4 className="font-bold text-slate-950 text-sm truncate">{mate.name}</h4>
                <p className="text-[10px] text-slate-500 font-mono tracking-wider">ID: {mate.id}</p>
                <div className="flex items-center gap-1 text-[11px] text-slate-600 pt-1">
                  <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                  <span className="truncate">{mate.email}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-xs text-muted-foreground border rounded-xl bg-slate-50/50 sm:col-span-3">
            {locale === "bn" ? "কোনো সহপাঠী খুঁজে পাওয়া যায়নি।" : "No classmates found."}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            className="px-3 h-8 text-xs font-bold border rounded-lg bg-background disabled:opacity-50 hover:bg-accent transition-colors cursor-pointer"
          >
            {locale === "bn" ? "পূর্ববর্তী" : "Previous"}
          </button>
          <span className="text-xs font-semibold">
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            className="px-3 h-8 text-xs font-bold border rounded-lg bg-background disabled:opacity-50 hover:bg-accent transition-colors cursor-pointer"
          >
            {locale === "bn" ? "পরবর্তী" : "Next"}
          </button>
        </div>
      )}
    </div>
  )
}