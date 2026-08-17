"use client"

import * as React from "react"
import { apiClient } from "@/lib/api"
import { Course } from "@/types/api"

export function useCourses() {
  const [courses, setCourses] = React.useState<Course[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const fetchCourses = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiClient("admin/courses", { method: "GET" })
      setCourses(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load courses")
    } finally {
      setLoading(false)
    }
  }, [])

  const createCourse = async (name: string) => {
    setError(null)
    try {
      const newCourse = await apiClient("admin/courses", {
        method: "POST",
        body: { name },
      })
      setCourses((prev) => [...prev, newCourse])
      return newCourse
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create course"
      setError(msg)
      throw new Error(msg)
    }
  }

  const updateCourse = async (id: string, name: string) => {
    setError(null)
    try {
      await apiClient(`admin/courses/${id}`, {
        method: "PATCH",
        body: { name },
      })
      setCourses((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name } : c))
      )
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update course"
      setError(msg)
      throw new Error(msg)
    }
  }

  const deleteCourse = async (id: string) => {
    setError(null)
    try {
      await apiClient(`admin/courses/${id}`, { method: "DELETE" })
      setCourses((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete course"
      setError(msg)
      throw new Error(msg)
    }
  }

  React.useEffect(() => {
    let isMounted = true

    // Defer the synchronous state update out of the render loop
    const timer = setTimeout(() => {
      if (isMounted) {
        fetchCourses()
      }
    }, 0)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [fetchCourses])

  return {
    courses,
    loading,
    error,
    refresh: fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  }
}