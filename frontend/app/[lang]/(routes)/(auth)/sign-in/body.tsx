"use client"

import { SignInForm } from "@/components/forms/sign-in-form"

interface BodyProps {
  locale: "en" | "bn"
}

export default function Body({ locale }: BodyProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SignInForm locale={locale} />
    </div>
  )
}