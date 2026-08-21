// providers/language-provider.tsx
"use client"

import * as React from "react"

export type Locale = "en" | "bn"

interface LanguageContextProps {
  locale: Locale
}

const LanguageContext =
  React.createContext<LanguageContextProps | undefined>(undefined)

export function LanguageProvider({
  children,
  locale,
}: {
  children: React.ReactNode
  locale: Locale
}) {
  const value = React.useMemo(() => ({ locale }), [locale])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = React.useContext(LanguageContext)

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }

  return context
}