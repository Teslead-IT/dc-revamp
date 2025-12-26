"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { externalApi } from "@/lib/api-client"
import { useRouter } from "next/navigation"

export function useSession() {
  return useQuery({
    queryKey: ["session"],
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
  })
}

export function useVerifyUserId() {
  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await externalApi.post('/api/auth/verify-user', { userId })
      if (!res.success) throw new Error(res.message)
      return res.data
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] })
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
      queryClient.setQueryData(["session"], null)
      router.push("/login")
    },
  })
}
