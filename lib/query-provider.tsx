"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState, type ReactNode } from "react"

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data remains fresh for 5 minutes before being considered stale
            staleTime: 5 * 60 * 1000, // 5 minutes

            // Cached data is kept for 10 minutes before garbage collection
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

            // Retry failed requests (useful for network issues)
            retry: 2,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

            // Disable automatic refetching on window focus for better UX
            refetchOnWindowFocus: false,

            // Enable automatic refetching when reconnecting to the internet
            refetchOnReconnect: true,

            // Refetch on mount only if data is stale
            refetchOnMount: true,
          },
          mutations: {
            // Retry failed mutations once
            retry: 1,
            retryDelay: 1000,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools are only included in development builds */}
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  )
}
