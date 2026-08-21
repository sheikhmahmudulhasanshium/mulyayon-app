// app/[lang]/not-found.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShieldAlert } from "lucide-react"
import PageProvider from "@/providers/page-provider"
import Header from "@/components/common/Header"
import Footer from "@/components/common/Footer"
import Sidebar from "@/components/common/Sidebar"
import Navbar from "@/components/common/Navbar"

export default function NotFound() {
  const pathname = usePathname()
  const locale = pathname?.split("/")[1] === "bn" ? "bn" : "en"

  const translations = {
    en: {
      title: "404 - Page Not Found",
      description: "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
      button: "Go Back Home",
    },
    bn: {
      title: "৪০৪ - পৃষ্ঠাটি পাওয়া যায়নি",
      description: "আপনি যে পৃষ্ঠাটি খুঁজছেন তা সম্ভবত মুছে ফেলা হয়েছে, তার নাম পরিবর্তন করা হয়েছে, অথবা সাময়িকভাবে অনুপলব্ধ রয়েছে।",
      button: "হোম পেজে ফিরে যান",
    },
  }

  const { title, description, button } = translations[locale]

  return (
    <PageProvider 
      header={<Header locale={locale} />} 
      footer={<Footer locale={locale} />} 
      sidebar={<Sidebar locale={locale} />} 
      navbar={<Navbar locale={locale} />}
    >
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-6">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
          {description}
        </p>
        <div className="mt-8">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center h-10 px-6 rounded-md font-medium text-sm bg-blue-900 hover:bg-blue-800 text-white transition-colors shadow cursor-pointer"
          >
            {button}
          </Link>
        </div>
      </div>
    </PageProvider>
  )
}