/**
 * React Query Utilities
 * 
 * Common utilities and helpers for React Query operations
 */

import { QueryClient } from "@tanstack/react-query"

/**
 * Create consistent query keys for different entity types
 */
export const createQueryKeys = (entity: string) => ({
    all: [entity] as const,
    lists: () => [entity, 'list'] as const,
    list: (filters?: any) => [entity, 'list', filters] as const,
    details: () => [entity, 'detail'] as const,
    detail: (id: string | number) => [entity, 'detail', id] as const,
})

/**
 * Invalidate all queries for a specific entity
 */
export const invalidateEntity = (queryClient: QueryClient, entity: string) => {
    return queryClient.invalidateQueries({ queryKey: [entity] })
}

/**
 * Remove all queries for a specific entity
 */
export const removeEntity = (queryClient: QueryClient, entity: string) => {
    return queryClient.removeQueries({ queryKey: [entity] })
}

/**
 * Prefetch entity list
 */
export const prefetchList = async (
    queryClient: QueryClient,
    queryKey: any[],
    queryFn: () => Promise<any>,
    staleTime = 5 * 60 * 1000
) => {
    return queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime,
    })
}

/**
 * Get cached data for a query
 */
export const getCachedData = <T = any>(
    queryClient: QueryClient,
    queryKey: any[]
): T | undefined => {
    return queryClient.getQueryData<T>(queryKey)
}

/**
 * Set cached data for a query
 */
export const setCachedData = <T = any>(
    queryClient: QueryClient,
    queryKey: any[],
    data: T
) => {
    return queryClient.setQueryData<T>(queryKey, data)
}

/**
 * Update cached data with a updater function
 */
export const updateCachedData = <T = any>(
    queryClient: QueryClient,
    queryKey: any[],
    updater: (old: T | undefined) => T
) => {
    return queryClient.setQueryData<T>(queryKey, updater)
}

/**
 * Standard error handler for mutations
 */
export const handleMutationError = (error: any, defaultMessage = "An error occurred") => {
    const message = error?.message || error?.error || defaultMessage
    console.error("Mutation error:", error)
    return message
}

/**
 * Optimistic update helper
 */
export const createOptimisticUpdate = <T = any>(
    queryClient: QueryClient,
    queryKey: any[],
    updater: (old: T | undefined) => T
) => {
    // Cancel outgoing refetches
    queryClient.cancelQueries({ queryKey })

    // Snapshot previous value
    const previousData = queryClient.getQueryData<T>(queryKey)

    // Optimistically update
    queryClient.setQueryData<T>(queryKey, updater)

    return { previousData }
}

/**
 * Rollback optimistic update
 */
export const rollbackOptimisticUpdate = <T = any>(
    queryClient: QueryClient,
    queryKey: any[],
    previousData: T | undefined
) => {
    if (previousData !== undefined) {
        queryClient.setQueryData<T>(queryKey, previousData)
    }
}

/**
 * Infinite query helper - merge pages
 */
export const mergePages = <T = any>(
    pages: T[][] | undefined,
    newPage: T[]
): T[][] => {
    if (!pages) return [newPage]
    return [...pages, newPage]
}

/**
 * Infinite query helper - get all items from pages
 */
export const getAllItems = <T = any>(pages: T[][] | undefined): T[] => {
    if (!pages) return []
    return pages.flat()
}

/**
 * Check if query is loading for the first time
 */
export const isInitialLoading = (isLoading: boolean, isFetching: boolean) => {
    return isLoading && isFetching
}

/**
 * Check if query is refetching in background
 */
export const isBackgroundFetching = (isLoading: boolean, isFetching: boolean) => {
    return !isLoading && isFetching
}

/**
 * Custom retry logic based on error type
 */
export const customRetry = (failureCount: number, error: any) => {
    // Don't retry on 4xx errors (except 429 - rate limit)
    if (error?.status >= 400 && error?.status < 500 && error?.status !== 429) {
        return false
    }

    // Retry up to 3 times for other errors
    return failureCount < 3
}

/**
 * Calculate exponential backoff delay
 */
export const exponentialBackoff = (attemptIndex: number, maxDelay = 30000) => {
    return Math.min(1000 * 2 ** attemptIndex, maxDelay)
}
