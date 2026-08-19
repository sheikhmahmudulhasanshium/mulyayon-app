"use client"

import * as React from "react"
import { apiClient } from "@/lib/api"
import { User, PaginatedResult } from "@/types/api"

export function useUsers() {
  const [users, setUsers] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const fetchUsers = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiClient("admin/users", { method: "GET" })
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users")
    } finally {
      setLoading(false)
    }
  }, [])

  const getStudentsPaginated = React.useCallback(async (params: {
    courseId?: string
    version?: string
    search?: string
    page?: number
    pageSize?: number
  }): Promise<PaginatedResult<User>> => {
    setLoading(true)
    setError(null)
    try {
      const query = new URLSearchParams()
      if (params.courseId) query.append("courseId", params.courseId)
      if (params.version) query.append("version", params.version)
      if (params.search) query.append("search", params.search)
      if (params.page) query.append("page", String(params.page))
      if (params.pageSize) query.append("pageSize", String(params.pageSize))

      return await apiClient(`admin/students/paginated?${query.toString()}`, {
        method: "GET",
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load paginated students"
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  const getAdminsPaginated = React.useCallback(async (params: {
    search?: string
    page?: number
    pageSize?: number
  }): Promise<PaginatedResult<User>> => {
    setLoading(true)
    setError(null)
    try {
      const query = new URLSearchParams()
      if (params.search) query.append("search", params.search)
      if (params.page) query.append("page", String(params.page))
      if (params.pageSize) query.append("pageSize", String(params.pageSize))

      return await apiClient(`admin/admins/paginated?${query.toString()}`, {
        method: "GET",
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load paginated admins"
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  const searchEngine = React.useCallback(async (params: {
    id?: string
    name?: string
    role?: string
    course?: string
    specialty?: string
    search?: string
    page?: number
    pageSize?: number
  }): Promise<PaginatedResult<User & { courseName?: string | null; courseNameBn?: string | null }>> => {
    setLoading(true)
    setError(null)
    try {
      const query = new URLSearchParams()
      if (params.id) query.append("id", params.id)
      if (params.name) query.append("name", params.name)
      if (params.role) query.append("role", params.role)
      if (params.course) query.append("course", params.course)
      if (params.specialty) query.append("specialty", params.specialty)
      if (params.search) query.append("search", params.search)
      if (params.page) query.append("page", String(params.page))
      if (params.pageSize) query.append("pageSize", String(params.pageSize))

      return await apiClient(`admin/users/search-engine?${query.toString()}`, {
        method: "GET",
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Search engine query failed"
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  const createUser = React.useCallback(async (payload: Omit<User, "id"> & { password?: string }) => {
    setError(null)
    try {
      const newUser = await apiClient("admin/users", {
        method: "POST",
        body: payload,
      })
      setUsers((prev) => [...prev, newUser])
      return newUser
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create user"
      setError(msg)
      throw new Error(msg)
    }
  }, [])

  const updateUser = React.useCallback(async (id: string, payload: Partial<Omit<User, "id">>) => {
    setError(null)
    try {
      await apiClient(`admin/users/${id}`, {
        method: "PATCH",
        body: payload,
      })
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...payload } : u))
      )
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update user"
      setError(msg)
      throw new Error(msg)
    }
  }, [])

  const deleteUser = React.useCallback(async (id: string) => {
    setError(null)
    try {
      await apiClient(`admin/users/${id}`, { method: "DELETE" })
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete user"
      setError(msg)
      throw new Error(msg)
    }
  }, [])

  React.useEffect(() => {
    let isMounted = true
    const timer = setTimeout(() => {
      if (isMounted) {
        fetchUsers()
      }
    }, 0)
    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [fetchUsers])

  return {
    users,
    loading,
    error,
    refresh: fetchUsers,
    getStudentsPaginated,
    getAdminsPaginated,
    searchEngine,
    createUser,
    updateUser,
    deleteUser,
  }
}