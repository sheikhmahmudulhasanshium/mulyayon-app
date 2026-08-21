"use client"

import * as React from "react"
import { apiClient } from "@/lib/api"
import { Assignment, Submission, Subject } from "@/types/api"

export interface StudentAssignmentResponse {
  assignment: Assignment
  submission: Submission | null
}

export interface SubjectWithTeachers extends Subject {
  teachers: Array<{
    id: string
    name: string
    specialties: string[]
  }>
}

export function useStudent() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const getMyAssignments = React.useCallback(async (): Promise<StudentAssignmentResponse[]> => {
    setLoading(true)
    setError(null)
    try {
      return await apiClient("student/assignments", { method: "GET" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load assignments")
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const getMySubjects = React.useCallback(async (): Promise<SubjectWithTeachers[]> => {
    setLoading(true)
    setError(null)
    try {
      return await apiClient("student/subjects", { method: "GET" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load subjects")
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    getMyAssignments,
    getMySubjects
  }
}