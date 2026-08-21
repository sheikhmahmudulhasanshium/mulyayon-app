"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"

interface BodyProps {
  locale: "en" | "bn"
}

export default function Body({ locale }: BodyProps) {
  const { logout } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    const timer = setTimeout(() => {
      // 1. Clear session variables
      logout()
      
      // 2. Redirect back to sign-in page safely
      router.push(`/${locale}/sign-in`)
      router.refresh()
    }, 1000)

    return () => clearTimeout(timer)
  }, [logout, router, locale])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      {/* Dynamic Spinning Indicator */}
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-900 dark:border-blue-400 mb-4" />
      
      <p className="text-sm font-medium text-muted-foreground">
        {locale === "bn" 
          ? "সিস্টেম থেকে সাইন আউট করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন..." 
          : "Signing you out of your account, please wait..."}
      </p>
    </div>
  )
}