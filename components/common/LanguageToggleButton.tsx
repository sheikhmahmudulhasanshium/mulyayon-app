"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLanguage, type Locale } from "@/providers/language-provider"

export function LanguageToggleButton() {
  const pathname = usePathname()
  const { locale } = useLanguage()

  const isBangla = locale === "bn"

  function changeLanguage(nextLocale: Locale) {
    if (nextLocale === locale) return

    const path = pathname.replace(/^\/(en|bn)/, "")

    window.location.assign(`/${nextLocale}${path}`)
  }

  return (
    <div className="relative inline-flex h-8 w-20 select-none items-center rounded-full bg-muted p-1 md:w-32 lg:w-44">
      <span
        className={cn(
          "absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-background shadow-sm transition-transform duration-200",
          !isBangla && "translate-x-full"
        )}
      />

      <button
        type="button"
        onClick={() => changeLanguage("bn")}
        className={cn(
          "relative z-10 flex h-full flex-1 items-center justify-center text-[10px] font-semibold md:text-xs",
          isBangla ? "text-foreground" : "text-muted-foreground"
        )}
      >
        <span className="md:hidden">বাং</span>
        <span className="hidden md:inline">বাংলা</span>
      </button>

      <button
        type="button"
        onClick={() => changeLanguage("en")}
        className={cn(
          "relative z-10 flex h-full flex-1 items-center justify-center text-[10px] font-semibold md:text-xs",
          !isBangla ? "text-foreground" : "text-muted-foreground"
        )}
      >
        <span className="md:hidden">EN</span>
        <span className="hidden md:inline lg:hidden">Eng</span>
        <span className="hidden lg:inline">English</span>
      </button>
    </div>
  )
}