"use client"

import * as React from "react"
import { apiClient } from "@/lib/api"
import { HealthReport } from "@/types/api"

export function useHealth() {
  const [report, setReport] = React.useState<HealthReport | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const checkHealth = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Hits api/health directly
      const data = await apiClient("health", { method: "GET" })
      setReport(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "System health check failed")
      
      // If the API threw an error with a payload, try to extract it
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message)
          if (parsed && parsed.status) {
            setReport(parsed as HealthReport)
          }
        } catch {
          // Message wasn't stringified JSON, leave report as null
        }
      }
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    let isMounted = true

    const timer = setTimeout(() => {
      if (isMounted) {
        checkHealth()
      }
    }, 0)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [checkHealth])

  return {
    report,
    loading,
    error,
    refresh: checkHealth,
  }
}