"use client"

import * as React from "react"
import { apiClient } from "@/lib/api"
import { User, Course } from "@/types/api"

// --- EXTENDED TYPE DEFINITIONS ---
export interface TeacherProfile {
  id: string
  name: string
  email: string
  specialties?: string[]
  versions?: string[]
  levels?: string[]
  subjects: string[]
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  totalPage: number
  totalCount: number
}

export interface MySubjectResponse {
  id: string
  name: string
  nameBn: string
  courseId: string
  courseName: string | null
  courseNameBn: string | null
}

export function useTeacherStudents() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
  // Ref to cancel pending queries and prevent race conditions
  const abortControllerRef = React.useRef<AbortController | null>(null)

  // === ORIGINAL UNTOUCHED ENDPOINTS ===
  const getStudentsByClass = React.useCallback(async (courseId: string): Promise<User[]> => {
    setLoading(true)
    setError(null)
    try {
      return await apiClient(`teacher/students-by-class/${courseId}`, { method: "GET" })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load class students"
      setError(msg)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const getStudentById = React.useCallback(async (studentId: string): Promise<User | null> => {
    setLoading(true)
    setError(null)
    try {
      return await apiClient(`teacher/students/${studentId}`, { method: "GET" })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load student details"
      setError(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getStudentsBySubject = React.useCallback(async (subjectId: string): Promise<User[]> => {
    setLoading(true)
    setError(null)
    try {
      return await apiClient(`teacher/students-by-subject/${subjectId}`, { method: "GET" })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load subject students"
      setError(msg)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // === NEW EXTENDED ENDPOINTS ===
  const getMyProfile = React.useCallback(async (): Promise<TeacherProfile | null> => {
    setLoading(true)
    setError(null)
    try {
      return await apiClient("teacher/me", { method: "GET" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getTeacherById = React.useCallback(async (id: string): Promise<TeacherProfile | null> => {
    setLoading(true)
    setError(null)
    try {
      return await apiClient(`teacher/${id}`, { method: "GET" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch teacher profile")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getMyCourses = React.useCallback(async (
    page = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<Course> | null> => {
    setLoading(true)
    setError(null)
    try {
      return await apiClient(`teacher/my-courses?page=${page}&pageSize=${pageSize}`, { method: "GET" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load assigned courses")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getMySubjects = React.useCallback(async (
    page = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<MySubjectResponse> | null> => {
    setLoading(true)
    setError(null)
    try {
      return await apiClient(`teacher/my-subjects?page=${page}&pageSize=${pageSize}`, { method: "GET" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load assigned subjects")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getMyStudents = React.useCallback(async (
    search?: string,
    page = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<User> | null> => {
    // Cancel previous search fetches if search input is rapidly altered
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    setLoading(true)
    setError(null)
    try {
      let url = `teacher/my-students?page=${page}&pageSize=${pageSize}`
      if (search) {
        url += `&search=${encodeURIComponent(search)}`
      }
      return await apiClient(url, { 
        method: "GET",
        signal: abortControllerRef.current.signal 
      })
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return null // Silent cancel, prevent layout flicker
      }
      setError(err instanceof Error ? err.message : "Failed to load assigned students")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getMyColleagues = React.useCallback(async (
    page = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<User> | null> => {
    setLoading(true)
    setError(null)
    try {
      return await apiClient(`teacher/my-colleagues?page=${page}&pageSize=${pageSize}`, { method: "GET" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load colleagues")
      return null
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
    getStudentsByClass,
    getStudentById,
    getStudentsBySubject,
    // Expanded exports:
    getMyProfile,
    getTeacherById,
    getMyCourses,
    getMySubjects,
    getMyStudents,
    getMyColleagues
  }
}