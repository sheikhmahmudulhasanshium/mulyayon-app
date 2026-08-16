import "../globals.css"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import {
  LanguageProvider,
  type Locale,
} from "@/providers/language-provider"
import { ThemeProvider } from "@/providers/theme-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

type LayoutProps = {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

function getLocale(lang: string): Locale {
  return lang === "bn" ? "bn" : "en"
}

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { lang } = await params
  const locale = getLocale(lang)
  const isBn = locale === "bn"

  const title = isBn ? "মূল্যায়ন" : "Mulyayon"
  const description = isBn ? "কাজ হোক প্রমাণ" : "Let Your Work Speak"
  const siteUrl = "https://mulyayon.vercel.app"

  return {
    metadataBase: new URL(siteUrl),

    title,
    description,

    icons: {
      icon: [
        {
          url: "/favicon/favicon-16x16.png",
          sizes: "16x16",
          type: "image/png",
        },
        {
          url: "/favicon/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
        {
          url: "/favicon/favicon.ico",
          sizes: "any",
        },
      ],
      apple: [
        {
          url: "/favicon/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },

    manifest: "/favicon/site.webmanifest",

    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}`,
      siteName: isBn ? "মূল্যায়ন" : "Mulyayon",
      locale: isBn ? "bn_BD" : "en_US",
      type: "website",
      images: [
        {
          url: isBn ? "/logo/logo-bn.png" : "/logo/logo-en.png",
          width: 1200,
          height: 630,
          alt: isBn ? "মূল্যায়ন লোগো" : "Mulyayon Logo",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        isBn ? "/logo/logo-bn.png" : "/logo/logo-en.png",
      ],
    },
  }
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps) {
  const { lang } = await params
  const locale = getLocale(lang)

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider locale={locale}>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}