"use client"

import { useLanguage } from "@/providers/language-provider"
import { LanguageToggleButton } from "@/components/common/LanguageToggleButton"
import { ModeToggle } from "@/components/common/ModeToggleButton"
export default function DashboardWidget() {
  const { locale } = useLanguage()

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <p>
        {locale === "en" 
          ? "Current Language: English" 
          : "বর্তমান ভাষা: বাংলা"}
      </p>
      
      <LanguageToggleButton />
      <ModeToggle />
    </div>
  )
}