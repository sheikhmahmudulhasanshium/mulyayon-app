// app/[lang]/layout.tsx
import "@/app/globals.css"
import { ThemeProvider } from "@/providers/theme-provider" // <-- Point back to our custom provider
import { LanguageProvider } from "@/providers/language-provider"
import { AuthProvider } from "@/providers/auth-provider"

interface RootLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { lang } = await params
  const locale = lang === "bn" ? "bn" : "en"

  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body>
        <LanguageProvider locale={locale}>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}