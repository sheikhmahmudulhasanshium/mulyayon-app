"use client"

import * as React from "react"
import { apiClient } from "@/lib/api"
import { User } from "@/types/api"

export function useTeachers() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const assignTeacher = async (teacherId: string, subjectId: string) => {
    setLoading(true)
    setError(null)
    try {
      await apiClient("admin/assign-teacher", {
        method: "POST",
        body: { teacherId, subjectId },
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to assign teacher"
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  const unassignTeacher = async (teacherId: string, subjectId: string) => {
    setLoading(true)
    setError(null)
    try {
      await apiClient("admin/unassign-teacher", {
        method: "POST",
        body: { teacherId, subjectId },
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to unassign teacher"
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  const getUnassignedTeachers = async (): Promise<{ count: number; teachers: User[] }> => {
    setLoading(true)
    setError(null)
    try {
      return await apiClient("admin/teachers/unassigned", { method: "GET" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch unassigned teachers")
      return { count: 0, teachers: [] }
    } finally {
      setLoading(false)
    }
  }

  const searchTeachers = async (params: {
    level?: string
    specialty?: string
    version?: string
    onlyUnassigned?: boolean
  }): Promise<User[]> => {
    setLoading(true)
    setError(null)
    try {
      const query = new URLSearchParams()
      if (params.level) query.append("level", params.level)
      if (params.specialty) query.append("specialty", params.specialty)
      if (params.version) query.append("version", params.version)
      if (params.onlyUnassigned) query.append("onlyUnassigned", String(params.onlyUnassigned))

      return await apiClient(`admin/teachers/search?${query.toString()}`, {
        method: "GET",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search query failed")
      return []
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    assignTeacher,
    unassignTeacher,
    getUnassignedTeachers,
    searchTeachers,
  }
}