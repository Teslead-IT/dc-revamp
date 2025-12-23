"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { authApi } from "@/lib/api-client"
import { useRouter } from "next/navigation"

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await authApi.getSession()
      return res.data?.user || null
    },
  })
}

export function useVerifyUserId() {
  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await authApi.verifyUserId(userId)
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
      const res = await authApi.verifyPassword(userId, password)
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
      await authApi.logout()
    },
    onSuccess: () => {
      queryClient.setQueryData(["session"], null)
      router.push("/login")
    },
  })
}
