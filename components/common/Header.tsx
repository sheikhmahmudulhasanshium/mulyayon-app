// components/common/Header.tsx
"use client"

import Image from "next/image"
//import { ModeToggle } from "./buttons/ModeToggleButton"
import LanguageToggleButton from "./buttons/LanguageToggleButton"
import AuthButton from "./buttons/AuthButton"
import Link from "next/link"

interface HeaderProps {
  locale: "en" | "bn"
}

export default function Header({ locale }: HeaderProps) {
  return (
    <header className="border-b bg-background">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-2 sm:px-4 h-16">

        {/* Logo */}
        <Link href={'/'} className="flex items-center gap-2 font-bold text-2xl text-blue-900 shrink-0">
          <Image
            src="/logo/icon.png"
            alt="Logo Icon"
            width={32}
            height={32}
            className="object-contain"
            priority

          />

          <h1 className="hidden sm:inline">
            {locale === "bn" ? "মূল্যায়ন" : "Mulyayon"}
          </h1>
        </Link>

        {/* ALWAYS VISIBLE */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <LanguageToggleButton size="responsive" />
          
          <AuthButton />
        </div>

      </div>
    </header>
  )
}