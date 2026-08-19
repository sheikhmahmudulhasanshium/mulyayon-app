"use client"

import * as React from "react"
import { useUsers } from "@/hooks/admin/use-users"
import { AlertCircle, RefreshCw, Trash2 } from "lucide-react"
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
  }
}

export default function UsersBody({ locale }: BodyProps) {
  const { users, loading, error, refresh, createUser, deleteUser } = useUsers()
  const t = translations[locale]
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleCreateSubmit = async (payload: {
    name: string
    email: string
    role: "Admin" | "Teacher" | "Student"
    password?: string
  }) => {
    setIsSubmitting(true)
    try {
      await createUser(payload)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm(t.confirmDelete)) {
      try {
        await deleteUser(id)
      } catch {
        // Handled silently
      }
    }
  }

  if (loading && users.length === 0) {
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
          onClick={refresh}
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

      <div className="border rounded-xl bg-background shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b bg-muted/50 font-medium text-muted-foreground">
              <th className="p-4">{t.name}</th>
              <th className="p-4">{t.email}</th>
              <th className="p-4">{t.role}</th>
              <th className="p-4 text-right w-32">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  {t.empty}
                </td>
              </tr>
            ) : (
              users.map((usr) => (
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
                      {usr.role}
                    </span>
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
      </div>
    </div>
  )
}