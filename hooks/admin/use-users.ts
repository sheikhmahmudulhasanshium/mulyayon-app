"use client"

import * as React from "react"
import { apiClient } from "@/lib/api"
import { User } from "@/types/api"

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

  const createUser = async (payload: Omit<User, "id"> & { password?: string }) => {
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
  }

  const updateUser = async (id: string, payload: Partial<Omit<User, "id">>) => {
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
  }

  const deleteUser = async (id: string) => {
    setError(null)
    try {
      await apiClient(`admin/users/${id}`, { method: "DELETE" })
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete user"
      setError(msg)
      throw new Error(msg)
    }
  }

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
    createUser,
    updateUser,
    deleteUser,
  }
}