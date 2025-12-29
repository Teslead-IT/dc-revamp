"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { externalApi } from "@/lib/api-client"
import { useRouter } from "next/navigation"
import { showToast as toast } from "@/lib/toast-service"

// Centralized query keys for auth
export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
}

export function useSession() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: async () => {
      try {
        // Check if token exists
        const token = externalApi.getToken()
        if (!token) return null

        // Call backend to get real user session data
        const res = await externalApi.getSession()
        return res.data?.user || null
      } catch (error) {
        // If session fetch fails, clear token and return null
        console.error("Session fetch error:", error)
        return null
      }
    },
    // Keep session fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Retry session fetching
    retry: 1,
  })
}

export function useVerifyUserId() {
  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await externalApi.post('/api/auth/verify-user', { userId })
      if (!res.success) throw new Error(res.message)
      return res.data
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to verify user ID")
    },
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async ({ userId, password }: { userId: string; password: string }) => {
      const res = await externalApi.login(userId, password)
      if (!res.success) throw new Error(res.message)
      return res.data
    },
    onSuccess: (data) => {
      // Update session cache immediately
      if (data?.user) {
        queryClient.setQueryData(authKeys.session(), data.user)
      }

      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: authKeys.session() })

      toast.success("Login successful")
    },
    onError: (error: any) => {
      toast.error(error.message || "Login failed")
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async () => {
      await externalApi.logout()
    },
    onSuccess: () => {
      // Clear all cached data on logout
      queryClient.clear()

      // Set session to null
      queryClient.setQueryData(authKeys.session(), null)

      toast.success("Logged out successfully")
      router.push("/login")
    },
    onError: (error: any) => {
      // Still clear cache and redirect even on error
      queryClient.clear()
      queryClient.setQueryData(authKeys.session(), null)

      toast.error(error.message || "Logout failed")
      router.push("/login")
    },
  })
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated() {
  const { data: user, isLoading } = useSession()
  return {
    isAuthenticated: !!user,
    isLoading,
    user,
  }
}

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 */
export function useRequireAuth() {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useIsAuthenticated()

  if (!isLoading && !isAuthenticated) {
    router.push('/login')
  }

  return { isAuthenticated, isLoading, user }
}

