// proxy.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const locales = ["en", "bn"]
const defaultLocale = "en"

// Helper to decode JWT claims safely on the server
function decodeServerJwt(token: string) {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = Buffer.from(base64, "base64").toString("utf8")
    return JSON.parse(jsonPayload)
  } catch { // Omitted '(e)' to resolve ESLint unused variable warning
    return null
  }
}
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Determine locale and handle redirect if missing
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value || ""
  const locale = locales.includes(cookieLocale) ? cookieLocale : defaultLocale

  if (pathnameIsMissingLocale) {
    request.nextUrl.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(request.nextUrl)
  }

  // 2. Route Protection & Authorization
  const token = request.cookies.get("AUTH_TOKEN")?.value || ""
  const decodedToken = token ? decodeServerJwt(token) : null
  
  // Extract role (supporting both standard claims and ASP.NET schema roles)
  const userRole = decodedToken
    ? decodedToken.role || decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
    : null

  // Normalize path by stripping the locale prefix (e.g. "/en/admin" -> "/admin")
  const pathWithoutLocale = pathname.replace(new RegExp(`^/(${locales.join("|")})`), "") || "/"

  // Define route prefixes and their required roles
  const protectedRoutes = [
    { prefix: "/admin", role: "Admin" },
    { prefix: "/teacher", role: "Teacher" },
    { prefix: "/student", role: "Student" },
  ]

  const activeProtection = protectedRoutes.find((route) =>
    pathWithoutLocale.startsWith(route.prefix)
  )

  // A. If accessing a protected route
  if (activeProtection) {
    if (!token || !userRole) {
      // Unauthenticated -> redirect to sign-in page
      const loginUrl = new URL(`/${locale}/sign-in`, request.url)
      return NextResponse.redirect(loginUrl)
    }

    if (userRole !== activeProtection.role) {
      // Unauthorized -> redirect to their designated home dashboard
      const dashboardHome = `/${locale}/${userRole.toLowerCase()}`
      return NextResponse.redirect(new URL(dashboardHome, request.url))
    }
  }

  // B. Prevent authenticated users from visiting the sign-in page again
  if (pathWithoutLocale.startsWith("/sign-in") && token && userRole) {
    const dashboardHome = `/${locale}/${userRole.toLowerCase()}`
    return NextResponse.redirect(new URL(dashboardHome, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|favicon/|manifest.json|.*\\..*).*)",
  ],
}