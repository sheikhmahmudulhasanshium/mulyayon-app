"use client"

import * as React from "react"
import { apiClient } from "@/lib/api"
import { User } from "@/types/api"

export function useTeacherStudents() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

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

  return {
    loading,
    error,
    getStudentsByClass,
    getStudentById,
    getStudentsBySubject,
  }
}