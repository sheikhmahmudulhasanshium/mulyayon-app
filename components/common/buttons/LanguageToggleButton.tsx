"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/providers/language-provider"
import { cn } from "@/lib/utils"

interface LanguageToggleButtonProps {
  size?: "sm" | "md" | "lg"
}

export const LanguageToggleButton = ({ size = "md" }: LanguageToggleButtonProps) => {
  const { locale } = useLanguage()
  const pathname = usePathname()

  const txt = {
    sm: ["EN", "বাং"],
    md: ["English", "বাংলা"],
    lg: ["en English", "bn বাংলা"],
  }

  const [enText, bnText] = txt[size]
const handleToggle = (targetLocale: "en" | "bn") => {
    if (locale === targetLocale) return
    if (!pathname) return

    const segments = pathname.split("/")
    const firstSegment = segments[1]
    const isKnownLocale = firstSegment === "en" || firstSegment === "bn"

    if (isKnownLocale) {
      segments[1] = targetLocale
    } else {
      segments.splice(1, 0, targetLocale)
    }

    const newPath = segments.join("/") || "/"

    // Save preference to a cookie so the middleware remembers it on future visits
    document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`

    // Redirect to the new dynamic locale path
    window.location.href = newPath
  }

  const containerSizes = {
    sm: "w-24 h-8 text-xs",
    md: "w-36 h-10 text-sm",
    lg: "w-48 h-12 text-base",
  }

  return (
    <div
      className={cn(
        "relative inline-flex items-center rounded-full bg-muted p-1 cursor-pointer select-none border border-input shadow-inner",
        containerSizes[size]
      )}
    >
      {/* Sliding Background Indicator */}
      <div
        className={cn(
          "absolute top-1 bottom-1 left-1 rounded-full bg-background shadow-sm transition-all duration-300 ease-out",
          locale === "bn" ? "left-[calc(50%)] right-1" : "right-[calc(50%)]"
        )}
      />

      {/* English Button */}
      <button
        type="button"
        onClick={() => handleToggle("en")}
        className={cn(
          "z-10 flex flex-1 items-center justify-center font-medium transition-colors duration-200 outline-none",
          locale === "en" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
      >
        {enText}
      </button>

      {/* Bangla Button */}
      <button
        type="button"
        onClick={() => handleToggle("bn")}
        className={cn(
          "z-10 flex flex-1 items-center justify-center font-medium transition-colors duration-200 outline-none",
          locale === "bn" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
      >
        {bnText}
      </button>
    </div>
  )
}

export default LanguageToggleButton;