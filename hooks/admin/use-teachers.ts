"use client"

import * as React from "react"
import { apiClient } from "@/lib/api"
import { User, PaginatedResult } from "@/types/api"

export function useTeachers() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const assignTeacher = React.useCallback(async (teacherId: string, subjectId: string) => {
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
  }, [])

  const unassignTeacher = React.useCallback(async (teacherId: string, subjectId: string) => {
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
  }, [])

  const getUnassignedTeachers = React.useCallback(async (): Promise<{ count: number; teachers: User[] }> => {
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
  }, [])

  const searchTeachers = React.useCallback(async (params: {
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
  }, [])

  const getTeachersPaginated = React.useCallback(async (params: {
    specialty?: string
    version?: string
    level?: string
    subjectId?: string
    search?: string
    page?: number
    pageSize?: number
  }): Promise<PaginatedResult<User>> => {
    setLoading(true)
    setError(null)
    try {
      const query = new URLSearchParams()
      if (params.specialty) query.append("specialty", params.specialty)
      if (params.version) query.append("version", params.version)
      if (params.level) query.append("level", params.level)
      if (params.subjectId) query.append("subjectId", params.subjectId)
      if (params.search) query.append("search", params.search)
      if (params.page) query.append("page", String(params.page))
      if (params.pageSize) query.append("pageSize", String(params.pageSize))

      return await apiClient(`admin/teachers/paginated?${query.toString()}`, {
        method: "GET",
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load paginated teachers"
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    assignTeacher,
    unassignTeacher,
    getUnassignedTeachers,
    searchTeachers,
    getTeachersPaginated,
  }
}