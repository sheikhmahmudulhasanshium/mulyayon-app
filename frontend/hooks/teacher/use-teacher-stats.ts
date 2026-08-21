"use client"

import * as React from "react"
import { apiClient } from "@/lib/api"
import { TeacherStats } from "@/types/api"

export function useTeacherStats() {
  const [stats, setStats] = React.useState<TeacherStats | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const fetchStats = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiClient("teacher/stats", { method: "GET" })
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load teacher stats")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    let isMounted = true

    // Defer the synchronous state update out of the render loop to satisfy pnpm lint
    const timer = setTimeout(() => {
      if (isMounted) {
        fetchStats()
      }
    }, 0)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
  }
}