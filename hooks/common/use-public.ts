"use client"

import * as React from "react"
import { apiClient } from "@/lib/api"
import { Course, Subject, PublicStats } from "@/types/api"

export function usePublic() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const getCoursesByVersion = React.useCallback(async (version: string): Promise<Course[]> => {
    setLoading(true)
    setError(null)
    try {
      return await apiClient(`public/courses/${version}`, { method: "GET" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load courses")
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const getSubjectsByVersion = React.useCallback(async (version: string): Promise<Subject[]> => {
    setLoading(true)
    setError(null)
    try {
      return await apiClient(`public/subjects/${version}`, { method: "GET" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load subjects")
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const getSubjectsByLevelAndVersion = React.useCallback(async (
    level: string,
    version: string
  ): Promise<Subject[]> => {
    setLoading(true)
    setError(null)
    try {
      return await apiClient(`public/subjects/${level}/${version}`, { method: "GET" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load filtered subjects")
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const getSubjectsByCourse = React.useCallback(async (courseId: string): Promise<Subject[]> => {
    setLoading(true)
    setError(null)
    try {
      return await apiClient(`public/subjects-by-course/${courseId}`, { method: "GET" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load course subjects")
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const getPublicStats = React.useCallback(async (): Promise<PublicStats | null> => {
    setLoading(true)
    setError(null)
    try {
      return await apiClient("public/stats", { method: "GET" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load system stats")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    getCoursesByVersion,
    getSubjectsByVersion,
    getSubjectsByLevelAndVersion,
    getSubjectsByCourse,
    getPublicStats,
  }
}