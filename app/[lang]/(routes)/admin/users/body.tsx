"use client"

import * as React from "react"
import { useUsers } from "@/hooks/admin/use-users"
import { useAuth } from "@/providers/auth-provider"
import { PaginatedResult, User } from "@/types/api"
import { AlertCircle, RefreshCw, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react"
import AddUserForm from "@/components/forms/admin/add-user-form"

interface BodyProps {
  locale: "en" | "bn"
}

const translations = {
  en: {
    title: "Users Management",
    subtitle: "Complete CRUD parameters for managing system admins, teachers, and students.",
    addUser: "Create User Profile",
    name: "Full Name",
    email: "Email Address",
    role: "System Role",
    password: "Password",
    actions: "Actions",
    delete: "Delete Profile",
    confirmDelete: "Are you sure you want to permanently remove this user?",
    empty: "No registered users located in this cluster.",
    loading: "Fetching users database...",
    refresh: "Refresh",
    student: "Student",
    teacher: "Teacher",
    admin: "Admin",
    passwordNotice: "Leave blank to keep existing password when updating.",
    createBtn: "Register User",
    prev: "Previous",
    next: "Next",
    pageOf: "Page {page} of {total}",
    searchPlaceholder: "Search by name or email...",
    filterAll: "All Roles",
    associatedClass: "Class / Course",
    notApplicable: "N/A"
  },
  bn: {
    title: "ব্যবহারকারীসমূহ ব্যবস্থাপনা",
    subtitle: "সিস্টেম অ্যাডমিন, শিক্ষক ও শিক্ষার্থীদের অ্যাকাউন্ট পরিচালনা করুন।",
    addUser: "নতুন ব্যবহারকারী প্রোফাইল তৈরি",
    name: "পূর্ণ নাম",
    email: "ইমেইল ঠিকানা",
    role: "সিস্টেমের ভূমিকা (Role)",
    password: "পাসওয়ার্ড",
    actions: "অ্যাকশন",
    delete: "প্রোফাইল মুছুন",
    confirmDelete: "আপনি কি নিশ্চিতভাবে এই ব্যবহারকারীকে সিস্টেম থেকে সরিয়ে ফেলতে চান?",
    empty: "ডাটাবেজে কোনো ব্যবহারকারী পাওয়া যায়নি।",
    loading: "ব্যবহারকারী তালিকা লোড হচ্ছে...",
    refresh: "রিফ্রেশ",
    student: "শিক্ষার্থী",
    teacher: "শিক্ষক",
    admin: "অ্যাডমিন",
    passwordNotice: "পরিবর্তন করতে না চাইলে পাসওয়ার্ডের ঘরটি ফাঁকা রাখুন।",
    createBtn: "প্রোফাইল তৈরি করুন",
    prev: "পূর্ববর্তী",
    next: "পরবর্তী",
    pageOf: "পৃষ্ঠা {page} / {total}",
    searchPlaceholder: "নাম বা ইমেল দিয়ে খুঁজুন...",
    filterAll: "সকল পদবি",
    associatedClass: "ক্লাস / কোর্স",
    notApplicable: "প্রযোজ্য নয়"
  }
}

export default function UsersBody({ locale }: BodyProps) {
  const { loading, error, createUser, deleteUser, searchEngine } = useUsers()
  const { isLoading: authLoading, isAuthenticated } = useAuth()
  const t = translations[locale]

  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [paginatedResult, setPaginatedResult] = React.useState<PaginatedResult<User & { courseName?: string | null; courseNameBn?: string | null }> | null>(null)
  
  // Search Engine & Filters State
  const [searchQuery, setSearchQuery] = React.useState("")
  const [debouncedQuery, setDebouncedQuery] = React.useState("")
  const [selectedRole, setSelectedRole] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)

  // 1. Debounce Search Input: only trigger API requests 400ms after user finishes typing
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 400)
    return () => clearTimeout(handler)
  }, [searchQuery])

  const fetchUsersPage = React.useCallback(async (pageNo = 1, queryText = "") => {
    if (authLoading || !isAuthenticated) return
    try {
      const result = await searchEngine({
        search: queryText || undefined,
        role: selectedRole || undefined,
        page: pageNo,
        pageSize: 10
      })
      setPaginatedResult(result)
      setCurrentPage(pageNo)
    } catch {
      // Handled silently by hooks
    }
  }, [authLoading, isAuthenticated, selectedRole, searchEngine])

  // 2. Fetch triggering handles search and filter changes seamlessly
  React.useEffect(() => {
    let isMounted = true
    const timer = setTimeout(() => {
      if (isMounted) {
        fetchUsersPage(1, debouncedQuery)
      }
    }, 0)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [debouncedQuery, selectedRole, fetchUsersPage])

  const handleCreateSubmit = async (payload: {
    name: string
    email: string
    role: "Admin" | "Teacher" | "Student"
    password?: string
  }) => {
    setIsSubmitting(true)
    try {
      await createUser(payload)
      fetchUsersPage(1, debouncedQuery)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm(t.confirmDelete)) {
      try {
        await deleteUser(id)
        fetchUsersPage(currentPage, debouncedQuery)
      } catch {
        // Handled silently
      }
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsersPage(1, searchQuery)
  }

  const isLoading = (loading || authLoading) && !paginatedResult

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded"></div>
        <div className="h-40 border rounded-xl bg-background/50"></div>
        <div className="h-60 border rounded-xl bg-background/50"></div>
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
          onClick={() => fetchUsersPage(currentPage, debouncedQuery)}
          className="self-start md:self-auto flex items-center justify-center h-9 px-3 text-xs font-semibold border rounded-lg hover:bg-accent transition-colors gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {t.refresh}
        </button>
      </div>

      {error && (
        <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg flex items-center gap-3 text-destructive text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <AddUserForm onSubmit={handleCreateSubmit} isSubmitting={isSubmitting} t={t} />

      {/* Filter and Search Bar Panel */}
      <div className="p-4 border rounded-xl bg-background shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-1 text-sm shadow-sm focus-visible:outline-none"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="flex h-9 w-full md:w-44 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none"
          >
            <option value="">{t.filterAll}</option>
            <option value="Admin">{t.admin}</option>
            <option value="Teacher">{t.teacher}</option>
            <option value="Student">{t.student}</option>
          </select>
        </div>
      </div>

      {/* Users Database Table */}
      <div className="border rounded-xl bg-background shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b bg-muted/50 font-medium text-muted-foreground">
              <th className="p-4">{t.name}</th>
              <th className="p-4">{t.email}</th>
              <th className="p-4">{t.role}</th>
              <th className="p-4">{t.associatedClass}</th>
              <th className="p-4 text-right w-32">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {!paginatedResult || paginatedResult.data.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  {t.empty}
                </td>
              </tr>
            ) : (
              paginatedResult.data.map((usr: User & { courseName?: string | null; courseNameBn?: string | null }) => (
                <tr key={usr.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-semibold text-slate-800">{usr.name}</td>
                  <td className="p-4 text-slate-600">{usr.email}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                      usr.role === "Admin" 
                        ? "bg-rose-50 text-rose-700 border-rose-200" 
                        : usr.role === "Teacher" 
                        ? "bg-blue-50 text-blue-700 border-blue-200" 
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}>
                      {usr.role === "Admin" ? t.admin : usr.role === "Teacher" ? t.teacher : t.student}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">
                    {usr.courseName ? (
                      <span className="font-semibold text-xs bg-slate-100 border text-slate-700 px-2.5 py-0.5 rounded-md">
                        {locale === "bn" && usr.courseNameBn ? usr.courseNameBn : usr.courseName}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/50 text-xs">{t.notApplicable}</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(usr.id)}
                      className="p-1.5 border rounded hover:bg-rose-50 text-destructive border-input transition-colors"
                      title={t.delete}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Navigation */}
        {paginatedResult && paginatedResult.totalPage > 1 && (
          <div className="flex items-center justify-between border-t p-4 bg-muted/20">
            <button
              onClick={() => fetchUsersPage(Math.max(1, currentPage - 1), debouncedQuery)}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-3 h-8 text-xs font-semibold border rounded-lg hover:bg-accent disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              {t.prev}
            </button>
            <span className="text-xs text-muted-foreground">
              {t.pageOf
                .replace("{page}", String(currentPage))
                .replace("{total}", String(paginatedResult.totalPage))}
            </span>
            <button
              onClick={() => fetchUsersPage(Math.min(paginatedResult.totalPage, currentPage + 1), debouncedQuery)}
              disabled={currentPage === paginatedResult.totalPage}
              className="inline-flex items-center gap-1 px-3 h-8 text-xs font-semibold border rounded-lg hover:bg-accent disabled:opacity-40 transition-colors"
            >
              {t.next}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}