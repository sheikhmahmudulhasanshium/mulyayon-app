"use client"

import * as React from "react"
import { useHealth } from "@/hooks/common/use-health"
import { Server, Activity, AlertCircle } from "lucide-react"

interface SystemHealthIndicatorProps {
  locale: "en" | "bn"
}

export default function SystemHealthIndicator({ locale }: SystemHealthIndicatorProps) {
  const { report, error, refresh } = useHealth()

  // Periodically ping the backend health controller every 15 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      refresh()
    }, 15000)

    return () => clearInterval(interval)
  }, [refresh])

  const isHealthy = report?.status === "Healthy" && !error
  const latency = report?.services.database.latencyMs ?? 0

  return (
    <div className="fixed bottom-4 right-4 z-50 p-3 bg-background border rounded-xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Dynamic Status Pulse Dot */}
      <div className="relative flex h-3 w-3">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
          isHealthy ? "bg-emerald-400" : "bg-destructive"
        }`} />
        <span className={`relative inline-flex rounded-full h-3 w-3 ${
          isHealthy ? "bg-emerald-500" : "bg-destructive"
        }`} />
      </div>

      <div className="text-xs space-y-0.5">
        <div className="flex items-center gap-1 font-semibold text-slate-800">
          <Server className="h-3.5 w-3.5 text-muted-foreground" />
          <span>
            {isHealthy 
              ? (locale === "bn" ? "সার্ভার সচল" : "Server Connected") 
              : (locale === "bn" ? "সংযোগ বিচ্ছিন্ন" : "Server Offline")}
          </span>
        </div>
        {isHealthy && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Activity className="h-3.5 w-3.5" />
            <span>
              {locale === "bn" ? "লেটেন্সি:" : "Latency:"} <strong>{latency}ms</strong>
            </span>
          </div>
        )}
        {!isHealthy && (
          <div className="flex items-center gap-1 text-destructive font-medium">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{locale === "bn" ? "সিস্টেম ডাউনে আছে" : "Service Issue"}</span>
          </div>
        )}
      </div>
    </div>
  )
}