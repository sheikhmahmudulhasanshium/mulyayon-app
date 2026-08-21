// components/common/buttons/AuthButton.tsx
"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { User, LogOut } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function AuthButton() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const locale = pathname?.split("/")[1] === "bn" ? "bn" : "en"

  const translations = {
    en: {
      signIn: "Sign In",
      signOut: "Sign Out",
      loading: "...",
    },
    bn: {
      signIn: "সাইন ইন",
      signOut: "সাইন আউট",
      loading: "...",
    },
  }

  const t = translations[locale]

  const handleAuthAction = () => {
    if (isAuthenticated) {
      router.push(`/${locale}/sign-out`)
    } else {
      router.push(`/${locale}/sign-in`)
    }
  }

  if (isLoading) {
    return (
      <button
        type="button"
        disabled
        aria-label={t.loading}
        className={cn(
          buttonVariants({
            variant: "outline",
            size: "sm",
          }),
          "w-9 h-9 sm:w-auto sm:px-3 opacity-50 cursor-not-allowed shrink-0"
        )}
      >
        <span className="animate-pulse">{t.loading}</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleAuthAction}
      aria-label={isAuthenticated ? t.signOut : t.signIn}
      title={isAuthenticated ? t.signOut : t.signIn}
      className={cn(
        buttonVariants({
          variant: isAuthenticated ? "ghost" : "outline",
          size: "sm",
        }),
        "gap-2 font-medium shrink-0 transition-colors cursor-pointer",
        "w-9 h-9 p-0",
        "sm:w-auto sm:h-9 sm:px-3"
      )}
    >
      {isAuthenticated ? (
        <>
          <LogOut className="h-4 w-4 shrink-0" />

          <span className="hidden sm:inline">
            {t.signOut}
          </span>
        </>
      ) : (
        <>
          <User className="h-4 w-4 shrink-0" />

          <span className="hidden sm:inline">
            {t.signIn}
          </span>
        </>
      )}
    </button>
  )
}