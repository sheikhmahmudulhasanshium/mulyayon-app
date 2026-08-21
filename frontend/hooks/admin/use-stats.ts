"use client"

import * as React from "react"
import { apiClient } from "@/lib/api"
import { DbStats } from "@/types/api"

export function useStats() {
  const [stats, setStats] = React.useState<DbStats | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const fetchStats = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiClient("admin/stats", { method: "GET" })
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stats")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    let isMounted = true

    // Defer to prevent cascading renders during effect synchronization
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