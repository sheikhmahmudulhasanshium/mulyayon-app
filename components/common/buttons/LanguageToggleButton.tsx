"use client"

import { usePathname } from "next/navigation"
import { useLanguage } from "@/providers/language-provider"
import { cn } from "@/lib/utils"

interface LanguageToggleButtonProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "responsive"
}

export const LanguageToggleButton = ({
  size = "md",
}: LanguageToggleButtonProps) => {
  const { locale } = useLanguage()
  const pathname = usePathname()

  const txt = {
    xs: ["EN", "বাং"],
    sm: ["EN", "বাং"],
    md: ["English", "বাংলা"],
    lg: ["en English", "bn বাংলা"],
    xl: ["en English", "bn বাংলা"],
  } as const

  const isResponsive = size === "responsive"

  const [enText, bnText] = isResponsive
    ? ["", ""]
    : txt[size]

  const handleToggle = (targetLocale: "en" | "bn") => {
    if (locale === targetLocale) return
    if (!pathname) return

    const segments = pathname.split("/")
    const firstSegment = segments[1]

    const isKnownLocale =
      firstSegment === "en" || firstSegment === "bn"

    if (isKnownLocale) {
      segments[1] = targetLocale
    } else {
      segments.splice(1, 0, targetLocale)
    }

    const newPath = segments.join("/") || "/"

    // Remember language preference
    document.cookie = [
      `NEXT_LOCALE=${targetLocale}`,
      "path=/",
      "max-age=31536000",
      "SameSite=Lax",
    ].join("; ")

    // Navigate to localized route
    window.location.href = newPath
  }

  // Adjusted heights to peak at h-10 (40px)
  const containerSizes = {
    xs: "w-20 h-7 text-[10px] p-0.5",
    sm: "w-24 h-8 text-xs p-1",
    md: "w-36 h-9 text-sm p-1",
    lg: "w-48 h-10 text-base p-1",
    xl: "w-56 h-10 text-lg p-1.5",
  }

  /*
   * Responsive heights capped at h-10:
   *
   * < 640px   → w-20, h-7
   * sm        → w-24, h-8
   * md        → w-36, h-9
   * lg        → w-48, h-10
   * xl        → w-56, h-10 (Capped at 40px)
   */
  const responsiveContainer =
    "w-20 h-7 text-[10px] p-0.5 " +
    "sm:w-24 sm:h-8 sm:text-xs sm:p-1 " +
    "md:w-36 md:h-9 md:text-sm " +
    "lg:w-48 lg:h-10 lg:text-base " +
    "xl:w-56 xl:h-10 xl:text-lg xl:p-1.5"

  return (
    <div
      className={cn(
        "relative inline-flex items-center rounded-full",
        "bg-muted/80 border border-input shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.06)]",
        "cursor-pointer select-none shrink-0 transition-all duration-300",
        "active:scale-[0.98]", // Subtle physical press effect

        isResponsive
          ? responsiveContainer
          : containerSizes[size]
      )}
    >
      {/* Sliding Background Indicator with Floating shadow */}
      <div
        className={cn(
          "absolute top-1 bottom-1 left-1 rounded-full",
          "bg-background shadow-[0_2px_5px_rgba(0,0,0,0.08),_0_0.5px_1.5px_rgba(0,0,0,0.04)]",
          "border border-input/10",
          "transition-all duration-300 ease-out",

          locale === "bn"
            ? "left-[calc(50%)] right-1"
            : "right-[calc(50%)]"
        )}
      />

      {/* English Button */}
      <button
        type="button"
        onClick={() => handleToggle("en")}
        aria-label="Switch to English"
        className={cn(
          "z-10 flex flex-1 items-center justify-center",
          "font-semibold tracking-wide transition-colors duration-200",
          "outline-none h-full cursor-pointer",
          "whitespace-nowrap",

          locale === "en"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {isResponsive ? (
          <>
            {/* Mobile */}
            <span className="inline sm:hidden">
              EN
            </span>

            {/* Small */}
            <span className="hidden sm:inline md:hidden">
              EN
            </span>

            {/* Medium */}
            <span className="hidden md:inline lg:hidden">
              English
            </span>

            {/* Large + XL */}
            <span className="hidden lg:inline">
              en English
            </span>
          </>
        ) : (
          enText
        )}
      </button>

      {/* Bangla Button */}
      <button
        type="button"
        onClick={() => handleToggle("bn")}
        aria-label="বাংলায় পরিবর্তন করুন"
        className={cn(
          "z-10 flex flex-1 items-center justify-center",
          "font-semibold tracking-wide transition-colors duration-200",
          "outline-none h-full cursor-pointer",
          "whitespace-nowrap",

          locale === "bn"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {isResponsive ? (
          <>
            {/* Mobile */}
            <span className="inline sm:hidden">
              বাং
            </span>

            {/* Small */}
            <span className="hidden sm:inline md:hidden">
              বাং
            </span>

            {/* Medium */}
            <span className="hidden md:inline lg:hidden">
              বাংলা
            </span>

            {/* Large + XL */}
            <span className="hidden lg:inline">
              bn বাংলা
            </span>
          </>
        ) : (
          bnText
        )}
      </button>
    </div>
  )
}

export default LanguageToggleButton