// lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown
}

export async function apiClient(endpoint: string, options: RequestOptions = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("AUTH_TOKEN") : null

  const headers = new Headers(options.headers)
  headers.set("Content-Type", "application/json")
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const { body, ...restOptions } = options

  const config: RequestInit = {
    ...restOptions,
    headers,
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  // Normalize URLs to strip duplicate slashes (e.g., prevents "api//auth/login")
  const baseUrl = API_BASE_URL.replace(/\/$/, "") // Remove trailing slash from base
  const cleanEndpoint = endpoint.replace(/^\//, "") // Remove leading slash from endpoint
  const targetUrl = `${baseUrl}/${cleanEndpoint}`

  try {
    const response = await fetch(targetUrl, config)

    if (response.status === 429) {
      throw new Error("Too many requests. Please wait a minute and try again.")
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Request failed with status ${response.status}`)
    }

    if (response.status === 204) {
      return {}
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("An unexpected network error occurred.")
  }
}