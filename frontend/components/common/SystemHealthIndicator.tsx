"use client"

import * as React from "react"
import { useHealth } from "@/hooks/common/use-health"
import { Server, Activity, ChevronLeft, ChevronRight } from "lucide-react"

// Import your animated TSX logos
import { MulyayonLogoBn } from "@/public/logo/logo-animated-bn"
import { MulyayonLogoEn } from "@/public/logo/logo-animated-en"

interface SystemHealthIndicatorProps {
  locale: "en" | "bn"
}

export default function SystemHealthIndicator({ locale }: SystemHealthIndicatorProps) {
  const { report, error, refresh } = useHealth()
  const [minimumDelayPassed, setMinimumDelayPassed] = React.useState(false)
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  // 1. Enforce a minimum 2-second cold start duration
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumDelayPassed(true)
    }, 2000) // 2000ms (2 seconds) cold start

    return () => clearTimeout(timer)
  }, [])

  // 2. Periodically ping the backend health controller every 15 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      refresh()
    }, 15000)

    return () => clearInterval(interval)
  }, [refresh])

  // 3. Auto-collapse the status widget 2 seconds after the connection succeeds
  const isHealthy = report?.status === "Healthy" && !error && minimumDelayPassed

  React.useEffect(() => {
    if (isHealthy) {
      const timer = setTimeout(() => {
        setIsCollapsed(true)
      }, 2000) // Collapse 2 seconds after healthy state is registered
      
      return () => clearTimeout(timer)
    } else {
      // Defer the update to the next frame to prevent synchronous cascading renders
      const frame = requestAnimationFrame(() => {
        setIsCollapsed(false)
      })
      
      return () => cancelAnimationFrame(frame)
    }
  }, [isHealthy])

  const latency = report?.services.database.latencyMs ?? 0

  return (
    <>
      {/* 1. Full-Screen Splash Screen Overlay */}
      <div 
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-background transition-opacity duration-500 ease-in-out ${
          isHealthy ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="w-full max-w-xl aspect-2/1 flex items-center justify-center">
          {locale === "bn" ? <MulyayonLogoBn /> : <MulyayonLogoEn />}
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span>
              {locale === "bn" 
                ? "সার্ভারের সাথে সংযোগ স্থাপন করা হচ্ছে..." 
                : "Establishing connection to the server..."}
            </span>
          </div>
          {error && (
            <span className="text-xs text-destructive font-medium max-w-md text-center animate-pulse">
              {locale === "bn"
                ? "ডাটাবেজ সংযোগে সমস্যা হচ্ছে। পুনরায় চেষ্টা করা হচ্ছে।"
                : "Database connection issue detected. Retrying..."}
            </span>
          )}
        </div>
      </div>

      {/* 2. Tiny Bottom-Right Status Indicator (Displayed only when healthy) */}
      {isHealthy && (
        <>
          {isCollapsed ? (
            /* Collapsed Trigger Button - Clicking '<' opens the status panel */
            <button
              onClick={() => setIsCollapsed(false)}
              className="fixed bottom-4 right-4 z-40 p-2.5 bg-background border rounded-full shadow-lg hover:bg-accent hover:text-accent-foreground transition-all duration-300 animate-in fade-in zoom-in-95"
              title={locale === "bn" ? "সার্ভার স্থিতি দেখুন" : "View Server Status"}
            >
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </button>
          ) : (
            /* Fully Expanded Status Indicator Box */
            <div className="fixed bottom-4 right-4 z-40 p-3 bg-background border rounded-xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Dynamic Status Pulse Dot */}
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </div>

              <div className="text-xs space-y-0.5">
                <div className="flex items-center gap-1 font-semibold text-slate-800">
                  <Server className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>
                    {locale === "bn" ? "সার্ভার সচল" : "Server Connected"}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Activity className="h-3.5 w-3.5" />
                  <span>
                    {locale === "bn" ? "লেটেন্সি:" : "Latency:"} <strong>{latency}ms</strong>
                  </span>
                </div>
              </div>

              {/* Manual Collapse Toggle Button ('>') */}
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-1 hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors ml-1"
                title={locale === "bn" ? "বন্ধ করুন" : "Collapse"}
              >
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}