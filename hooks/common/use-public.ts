"use client"

import * as React from "react"
import { apiClient } from "@/lib/api"
import { Course, Subject, PublicStats } from "@/types/api"

// --- EXTENDED TYPE DEFINITIONS ---
export interface DetailedStats {
  summary: {
    totalStudents: number
    totalTeachers: number
    totalCourses: number
    totalSubjects: number
  }
  byLevel: {
    primaryCourses: number
    secondaryCourses: number
    higherSecondaryCourses: number
  }
  byVersion: {
    banglaVersionCourses: number
    englishVersionCourses: number
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  totalPage: number
  totalCount: number
}

export interface SubjectWithTeachers extends Subject {
  teachers: Array<{
    id: string
    name: string
    specialties: string[]
  }>
}

export function usePublic() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
  // Ref to cancel pending queries and prevent race conditions
  const abortControllerRef = React.useRef<AbortController | null>(null)

  // === ORIGINAL UNTOUCHED ENDPOINTS ===
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

  // === NEW EXTENDED ENDPOINTS ===
  const getDetailedStats = React.useCallback(async (): Promise<DetailedStats | null> => {
    setLoading(true)
    setError(null)
    try {
      return await apiClient("public/stats/detailed", { method: "GET" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load detailed stats")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getCoursesForAdventure = React.useCallback(async (
    version: string,
    level: string,
    page = 1,
    pageSize = 12
  ): Promise<PaginatedResponse<Course> | null> => {
    // Prevent race conditions on page changes
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    setLoading(true)
    setError(null)
    try {
      const endpoint = `public/directory/courses?version=${encodeURIComponent(version)}&level=${encodeURIComponent(level)}&page=${page}&pageSize=${pageSize}`
      return await apiClient(endpoint, { 
        method: "GET",
        signal: abortControllerRef.current.signal 
      })
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return null // Silent cancel, prevent layout flicker
      }
      setError(err instanceof Error ? err.message : "Failed to load directory courses")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getSubjectsWithTeachers = React.useCallback(async (courseId: string): Promise<SubjectWithTeachers[]> => {
    setLoading(true)
    setError(null)
    try {
      return await apiClient(`public/directory/subjects-with-teachers/${courseId}`, { method: "GET" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load subjects with teachers")
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Cleanup effect: Prevents memory leaks if unmounted during active fetches
  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
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
    // Expanded exports:
    getDetailedStats,
    getCoursesForAdventure,
    getSubjectsWithTeachers
  }
}