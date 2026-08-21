"use client"

import * as React from "react"
import { apiClient } from "@/lib/api"
import { Subject, PaginatedSubjectsResult } from "@/types/api"

export function useSubjects() {
  const [subjects, setSubjects] = React.useState<Subject[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const fetchSubjects = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiClient("admin/subjects", { method: "GET" })
      setSubjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load subjects")
    } finally {
      setLoading(false)
    }
  }, [])

  const getSubjectsPaginated = React.useCallback(async (
    version: string,
    courseIdOrName: string,
    page = 1,
    pageSize = 10
  ): Promise<PaginatedSubjectsResult> => {
    setLoading(true)
    setError(null)
    try {
      return await apiClient(
        `admin/getSubjects/${version}/${courseIdOrName}?page=${page}&pageSize=${pageSize}`,
        { method: "GET" }
      )
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load paginated subjects"
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  const createSubject = React.useCallback(async (name: string, courseId: string) => {
    setError(null)
    try {
      const newSubject = await apiClient("admin/subjects", {
        method: "POST",
        body: { name, courseId },
      })
      setSubjects((prev) => [...prev, newSubject])
      return newSubject
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create subject"
      setError(msg)
      throw new Error(msg)
    }
  }, [])

  const updateSubject = React.useCallback(async (id: string, name?: string, courseId?: string) => {
    setError(null)
    try {
      await apiClient(`admin/subjects/${id}`, {
        method: "PATCH",
        body: { name, courseId },
      })
      setSubjects((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, name: name ?? s.name, courseId: courseId ?? s.courseId }
            : s
        )
      )
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update subject"
      setError(msg)
      throw new Error(msg)
    }
  }, [])

  const deleteSubject = React.useCallback(async (id: string) => {
    setError(null)
    try {
      await apiClient(`admin/subjects/${id}`, { method: "DELETE" })
      setSubjects((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete subject"
      setError(msg)
      throw new Error(msg)
    }
  }, [])

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

  return {
    subjects,
    loading,
    error,
    refresh: fetchSubjects,
    getSubjectsPaginated,
    createSubject,
    updateSubject,
    deleteSubject,
  }
}