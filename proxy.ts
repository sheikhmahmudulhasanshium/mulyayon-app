// proxy.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const locales = ["en", "bn"]
const defaultLocale = "en"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  if (!pathnameIsMissingLocale) {
    return NextResponse.next()
  }

  // Fallback to empty string if cookie is undefined to satisfy TypeScript types
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value || ""
  const locale = locales.includes(cookieLocale) ? cookieLocale : defaultLocale

  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|favicon/|manifest.json|.*\\..*).*)",
  ],
}