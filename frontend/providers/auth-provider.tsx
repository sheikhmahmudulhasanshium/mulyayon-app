// providers/auth-provider.tsx
"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"

// Intercept and silence the harmless React 19 script-tag warning from next-themes on client-side route changes
if (typeof window !== "undefined") {
  const originalError = console.error
  console.error = (...args: unknown[]) => {
    if (
      args[0] && 
      typeof args[0] === "string" && 
      args[0].includes("Encountered a script tag while rendering React component")
    ) {
      return
    }
    originalError(...args)
  }
}

export type Role = "Admin" | "Teacher" | "Student"

interface User {
  id: string
  email: string
  role: Role
  name: string
  courseId?: string
  exp: number
}

interface AuthContextProps {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, userPayload: { id: string; name: string; email: string; role: string; courseId?: string }) => void
  logout: () => void
}

interface DecodedToken {
  nameid?: string
  sub?: string
  email?: string
  role?: string
  unique_name?: string
  name?: string
  courseId?: string
  exp: number
  [key: string]: unknown
}

const AuthContext = React.createContext<AuthContextProps | undefined>(undefined)

// Safe Client JWT decoding using strict interface return
function decodeClientJwt(token: string): DecodedToken | null {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [token, setToken] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Recover session asynchronously on mount with cleanup to prevent memory leaks in strict mode
  React.useEffect(() => {
    let isMounted = true
    const savedToken = localStorage.getItem("AUTH_TOKEN")

    // Wrapping the entire logic inside a deferred block satisfies React 19's render rules
    const timer = setTimeout(() => {
      if (!isMounted) return

      if (savedToken) {
        const decoded = decodeClientJwt(savedToken)
        const isExpired = decoded ? decoded.exp * 1000 < Date.now() : true

        if (!isExpired && decoded) {
          const parsedRole = (decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) as Role
          setToken(savedToken)
          setUser({
            id: decoded.nameid || decoded.sub || "",
            email: decoded.email || "",
            role: parsedRole,
            name: decoded.unique_name || decoded.name || "User",
            courseId: decoded.courseId || undefined,
            exp: decoded.exp,
          })
        } else {
          localStorage.removeItem("AUTH_TOKEN")
          document.cookie = "AUTH_TOKEN=; path=/; max-age=0; SameSite=Lax"
        }
      }
      setIsLoading(false)
    }, 0)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [])

  // Wrapped inside useCallback to maintain single-instance reference stability
  const login = React.useCallback((
    jwtToken: string, 
    userPayload: { id: string; name: string; email: string; role: string; courseId?: string }
  ) => {
    setIsLoading(true)
    const decoded = decodeClientJwt(jwtToken)
    const expiration = decoded ? decoded.exp : Math.floor(Date.now() / 1000) + 86400

    const userData: User = {
      id: userPayload.id,
      email: userPayload.email,
      role: userPayload.role as Role,
      name: userPayload.name,
      courseId: userPayload.courseId,
      exp: expiration,
    }

    localStorage.setItem("AUTH_TOKEN", jwtToken)
    document.cookie = `AUTH_TOKEN=${jwtToken}; path=/; max-age=86400; SameSite=Lax`

    setToken(jwtToken)
    setUser(userData)
    setIsLoading(false)

    const locale = pathname?.split("/")[1] || "en"
    router.push(`/${locale}/${userPayload.role.toLowerCase()}`)
  }, [pathname, router])

  // Wrapped inside useCallback to maintain single-instance reference stability
  const logout = React.useCallback(() => {
    setIsLoading(true)
    localStorage.removeItem("AUTH_TOKEN")
    document.cookie = "AUTH_TOKEN=; path=/; max-age=0; SameSite=Lax"
    setToken(null)
    setUser(null)
    setIsLoading(false)

    const locale = pathname?.split("/")[1] || "en"
    router.push(`/${locale}/sign-in`)
  }, [pathname, router])

  const value = React.useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}