"use client"

import * as React from "react"
import { apiClient } from "@/lib/api"
import { Submission } from "@/types/api"

export function useSubmissions() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const submitAnswer = async (assignmentId: string, answer: string, attachmentUrl?: string) => {
    setLoading(true)
    setError(null)
    try {
      return await apiClient("submissions", {
        method: "POST",
        body: { assignmentId, answer, attachmentUrl },
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit answer"
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  const updateSubmission = async (id: string, answer: string, attachmentUrl?: string) => {
    setLoading(true)
    setError(null)
    try {
      await apiClient(`submissions/${id}`, {
        method: "PATCH",
        body: { answer, attachmentUrl },
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update submission"
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  const gradeSubmission = async (id: string, marks: number, feedback?: string) => {
    setLoading(true)
    setError(null)
    try {
      await apiClient(`submissions/${id}/grade`, {
        method: "POST",
        body: { marks, feedback },
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit grade"
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  const getSubmissionById = React.useCallback(async (id: string): Promise<Submission | null> => {
    setLoading(true)
    setError(null)
    try {
      return await apiClient(`submissions/${id}`, { method: "GET" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load submission details")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getAssignmentSubmissions = React.useCallback(async (assignmentId: string): Promise<Submission[]> => {
    setLoading(true)
    setError(null)
    try {
      return await apiClient(`submissions/assignment/${assignmentId}`, { method: "GET" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load submissions list")
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    submitAnswer,
    updateSubmission,
    gradeSubmission,
    getSubmissionById,
    getAssignmentSubmissions,
  }
}