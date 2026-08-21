// components/common/loader.tsx
"use client"

import * as React from "react"
import { MulyayonLogoBn } from "@/public/logo/logo-animated-bn"
import { MulyayonLogoEn } from "@/public/logo/logo-animated-en"

interface LoaderProps {
  locale?: "en" | "bn"
  show?: boolean
  statusText?: string
  errorText?: string
  isFullScreen?: boolean
}

export function Loader({
  locale = "en",
  show = true,
  statusText,
  errorText,
  isFullScreen = true,
}: LoaderProps) {
  const defaultStatusText =
    locale === "bn" ? "লোড হচ্ছে..." : "Loading resources..."

  const containerClasses = isFullScreen
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-background transition-opacity duration-500 ease-in-out"
    : "w-full py-12 flex flex-col items-center justify-center p-6 bg-background transition-opacity duration-500 ease-in-out"

  return (
    <div
      className={`${containerClasses} ${
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Sized container for the animated logo */}
      <div className="w-full max-w-xl aspect-2/1 flex items-center justify-center">
        {locale === "bn" ? <MulyayonLogoBn /> : <MulyayonLogoEn />}
      </div>

      {/* Loading/Status text */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
          <span>{statusText || defaultStatusText}</span>
        </div>
        
        {errorText && (
          <span className="text-xs text-destructive font-medium max-w-md text-center animate-pulse">
            {errorText}
          </span>
        )}
      </div>
    </div>
  )
}