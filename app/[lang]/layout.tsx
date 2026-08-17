import "@/app/globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import { LanguageProvider } from "@/providers/language-provider"

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
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}