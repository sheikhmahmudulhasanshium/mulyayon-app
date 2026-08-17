"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"

import { useAuth } from "@/providers/auth-provider"
import { apiClient } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"

interface SignInFormProps {
  locale: "en" | "bn"
}

const translations = {
  en: {
    title: "Sign in to Mulyayon",
    subtitle: "Enter your credentials to access your portal",
    emailLabel: "Email Address",
    emailPlaceholder: "you@school.edu",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••••",
    buttonText: "Sign In",
    buttonLoading: "Authenticating...",
    errorDefault: "Invalid email or password",
    emailRequired: "Please enter a valid email address.",
    passwordRequired: "Password must be at least 6 characters.",
  },
  bn: {
    title: "মূল্যায়ন-এ সাইন ইন করুন",
    subtitle: "আপনার পোর্টালে প্রবেশ করতে পরিচয়পত্র প্রদান করুন",
    emailLabel: "ইমেইল ঠিকানা",
    emailPlaceholder: "you@school.edu",
    passwordLabel: "পাসওয়ার্ড",
    passwordPlaceholder: "••••••••",
    buttonText: "সাইন ইন করুন",
    buttonLoading: "অনুমোদন করা হচ্ছে...",
    errorDefault: "ভুল ইমেল বা পাসওয়ার্ড",
    emailRequired: "দয়া করে একটি সঠিক ইমেল ঠিকানা লিখুন।",
    passwordRequired: "পাসওয়ার্ডটি অবশ্যই কমপক্ষে ৬ অক্ষরের হতে হবে।",
  },
}

export function SignInForm({ locale }: SignInFormProps) {
  const router = useRouter()
  const { login, user } = useAuth()
  const [error, setError] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)

  const t = translations[locale]

  // Helper to determine redirect path based on user role
  const getRedirectPath = React.useCallback((userRole?: string) => {
    if (!userRole) return `/${locale}`
    
    const normalizedRole = userRole.toLowerCase()
    
    // Matches dynamic folder structures: /admin, /teacher, /student
    if (["admin", "teacher", "student"].includes(normalizedRole)) {
      return `/${locale}/${normalizedRole}`
    }
    
    return `/${locale}`
  }, [locale])

  // Redirect guard: if user is already authenticated, redirect them away from the sign-in page to their dashboard
  React.useEffect(() => {
    if (user) {
      const redirectPath = getRedirectPath(user.role)
      router.push(redirectPath)
      router.refresh()
    }
  }, [user, router, getRedirectPath])

  const formSchema = z.object({
    email: z.string().email({ message: t.emailRequired }),
    password: z.string().min(6, { message: t.passwordRequired }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null)
    setIsSubmitting(true)

    try {
      const data = await apiClient("auth/login", {
        method: "POST",
        body: values,
      })

      if (data && data.token && data.user) {
        login(data.token, data.user)
        
        // Push directly to their specific role dashboard on login
        const redirectPath = getRedirectPath(data.user.role)
        router.push(redirectPath)
        router.refresh()
      } else {
        throw new Error(t.errorDefault)
      }
    } catch {
      setError(t.errorDefault)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Prevent form rendering briefly while redirection is in progress
  if (user) {
    return null
  }

  return (
    <div className="w-full max-w-md space-y-6 border p-8 rounded-xl bg-background shadow-sm">
      {/* Brand Logo & Header Text */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="relative w-12 h-12">
          <Image
            src="/logo/icon.png"
            alt="Mulyayon Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {t.title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.subtitle}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">{t.emailLabel}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t.emailPlaceholder}
                    type="email"
                    autoComplete="email"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">{t.passwordLabel}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder={t.passwordPlaceholder}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      disabled={isSubmitting}
                      className="pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Repositioned Localized Error Box */}
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 font-medium animate-in fade-in-50 slide-in-from-top-1 duration-200">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white shadow-sm transition-colors"
          >
            {isSubmitting ? t.buttonLoading : t.buttonText}
          </Button>
        </form>
      </Form>
    </div>
  )
}