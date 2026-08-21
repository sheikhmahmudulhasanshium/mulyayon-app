"use client"

import * as React from "react"
import { UserPlus } from "lucide-react"

interface AddUserFormProps {
  onSubmit: (payload: {
    name: string
    email: string
    role: "Admin" | "Teacher" | "Student"
    password?: string
  }) => Promise<void>
  isSubmitting: boolean
  t: {
    addUser: string
    name: string
    email: string
    role: string
    password: string
    passwordNotice: string
    createBtn: string
    student: string
    teacher: string
    admin: string
  }
}

export default function AddUserForm({ onSubmit, isSubmitting, t }: AddUserFormProps) {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [role, setRole] = React.useState<"Admin" | "Teacher" | "Student">("Teacher")
  const [password, setPassword] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    try {
      await onSubmit({
        name,
        email,
        role,
        password: password || undefined,
      })
      setName("")
      setEmail("")
      setPassword("")
    } catch {
      // Handled silently
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 border rounded-xl bg-background shadow-sm space-y-4">
      <h3 className="font-semibold text-slate-900 flex items-center gap-2">
        <UserPlus className="h-5 w-5 text-blue-900" />
        {t.addUser}
      </h3>
      <div className="grid gap-4 md:grid-cols-4 max-w-6xl">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">{t.name}</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">{t.email}</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">{t.role}</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "Admin" | "Teacher" | "Student")}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
            disabled={isSubmitting}
          >
            <option value="Student">{t.student}</option>
            <option value="Teacher">{t.teacher}</option>
            <option value="Admin">{t.admin}</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">{t.password}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <p className="text-xs text-muted-foreground">{t.passwordNotice}</p>
        <button
          type="submit"
          disabled={isSubmitting || !name.trim() || !email.trim()}
          className="flex items-center gap-1.5 px-4 h-10 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-950 rounded-lg transition-colors disabled:opacity-50"
        >
          {t.createBtn}
        </button>
      </div>
    </form>
  )
}