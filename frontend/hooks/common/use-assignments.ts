"use client"

import * as React from "react"
import { apiClient } from "@/lib/api"
import { Assignment } from "@/types/api"

export function useAssignments() {
  const [assignments, setAssignments] = React.useState<Assignment[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const fetchAssignments = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiClient("assignments", { method: "GET" })
      setAssignments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load assignments")
    } finally {
      setLoading(false)
    }
  }, [])

  const getAssignmentById = async (id: string): Promise<Assignment | null> => {
    setLoading(true)
    setError(null)
    try {
      return await apiClient(`assignments/${id}`, { method: "GET" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch assignment details")
      return null
    } finally {
      setLoading(false)
    }
  }

  const createAssignment = async (payload: Omit<Assignment, "id" | "teacherId">) => {
    setError(null)
    try {
      const newAssignment = await apiClient("assignments", {
        method: "POST",
        body: payload,
      })
      setAssignments((prev) => [...prev, newAssignment])
      return newAssignment
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create assignment"
      setError(msg)
      throw new Error(msg)
    }
  }

  const updateAssignment = async (id: string, payload: Partial<Omit<Assignment, "id" | "teacherId" | "subjectId">>) => {
    setError(null)
    try {
      await apiClient(`assignments/${id}`, {
        method: "PATCH",
        body: payload,
      })
      setAssignments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...payload } : a))
      )
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update assignment"
      setError(msg)
      throw new Error(msg)
    }
  }

  const deleteAssignment = async (id: string) => {
    setError(null)
    try {
      await apiClient(`assignments/${id}`, { method: "DELETE" })
      setAssignments((prev) => prev.filter((a) => a.id !== id))
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete assignment"
      setError(msg)
      throw new Error(msg)
    }
  }

  React.useEffect(() => {
    let isMounted = true

    const timer = setTimeout(() => {
      if (isMounted) {
        fetchAssignments()
      }
    }, 0)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [fetchAssignments])

  return {
    assignments,
    loading,
    error,
    refresh: fetchAssignments,
    getAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  }
}