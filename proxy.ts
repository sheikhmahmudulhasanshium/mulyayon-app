import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const locales = ["en", "bn"] as const
const defaultLocale = "en"

type Locale = (typeof locales)[number]

function getLocale(request: NextRequest): Locale {
  const language = request.headers
    .get("accept-language")
    ?.split(",")[0]
    ?.split("-")[0]

  return language === "bn" ? "bn" : defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasLocale = locales.some(
    (locale) =>
      pathname === `/${locale}` ||
      pathname.startsWith(`/${locale}/`)
  )

  if (hasLocale) {
    return NextResponse.next()
  }

  const locale = getLocale(request)

  return NextResponse.redirect(
    new URL(`/${locale}${pathname}`, request.url)
  )
}

export const config = {
  matcher: [
    "/((?!api|_next|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|webmanifest|xml|txt)$).*)",
  ],
}