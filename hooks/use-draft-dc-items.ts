/**
 * React Query Hooks for Draft DC Items Management
 * 
 * This module provides optimized hooks for draft DC items operations
 * with automatic caching, background refetching, and optimistic updates.
 * 
 * API Endpoints:
 * - GET    /api/draft-dc-items  - Get all draft DC items
 * - POST   /api/draft-dc-items  - Create draft DC items
 */

"use client"

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query"
import { externalApi, type DraftDCItemsResponse, type CreateDraftDCItemsData } from "@/lib/api-client"
import { toast } from "sonner"

// ============= Query Keys =============

/**
 * Centralized query keys for draft DC items-related queries
 * This ensures consistent cache management across the application
 */
export const draftDCItemsKeys = {
    all: ['draft-dc-items'] as const,
    lists: () => [...draftDCItemsKeys.all, 'list'] as const,
    list: (filters?: any) => [...draftDCItemsKeys.lists(), filters] as const,
}

// ============= Query Hooks =============

/**
 * Hook to fetch all draft DC items
 * 
 * Features:
 * - Automatically caches data
 * - Refetches in background when data becomes stale
 * - Shared across components (no duplicate API calls)
 * 
 * @example
 * ```tsx
 * const { data: draftItems, isLoading, error } = useDraftDCItems()
 * 
 * if (isLoading) return <Spinner />
 * if (error) return <ErrorMessage />
 * 
 * return draftItems?.map(draft => <DraftCard key={draft.id} {...draft} />)
 * ```
 */
export function useDraftDCItems(options?: Partial<UseQueryOptions<DraftDCItemsResponse[]>>) {
    return useQuery({
        queryKey: draftDCItemsKeys.lists(),
        queryFn: async () => {
            const res = await externalApi.getDraftDCItems()
            if (!res.success) throw new Error(res.message || 'Failed to fetch draft DC items')
            return res.data as DraftDCItemsResponse[]
        },
        // Keep draft DC items fresh for 2 minutes (more frequent updates expected)
        staleTime: 2 * 60 * 1000,
        ...options,
    })
}

// ============= Mutation Hooks =============

/**
 * Hook to create draft DC items
 * 
 * Features:
 * - Type-safe with CreateDraftDCItemsData interface
 * - Automatically invalidates draft DC items list after creation
 * - Shows success/error toast notifications
 * 
 * @example
 * ```tsx
 * const createDraftDC = useCreateDraftDCItems()
 * 
 * await createDraftDC.mutateAsync({
 *   draftId: "DC-000001",
 *   partyId: "SUP-2696-982",
 *   items: [
 *     {
 *       itemName: "Valve-102",
 *       itemDescription: "Testing",
 *       uom: "KG",
 *       quantity: 10,
 *       weightPerUnit: 2,
 *       totalWeight: 20,
 *       ratePerEach: 2,
 *       squareFeetPerUnit: 12,
 *       totalSquareFeet: 144,
 *       remarks: "Testing",
 *       projectName: "LANDT",
 *       projectIncharge: "Arun",
 *       notes: "Testing"
 *     }
 *   ]
 * })
 * ```
 */
export function useCreateDraftDCItems() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (draftData: CreateDraftDCItemsData) => {
            const res = await externalApi.createDraftDCItems(draftData)
            if (!res.success) throw new Error(res.message || 'Failed to create draft DC items')
            return res.data as DraftDCItemsResponse
        },
        onSuccess: (data) => {
            // Invalidate draft DC items list to trigger refetch
            queryClient.invalidateQueries({ queryKey: draftDCItemsKeys.lists() })

            toast.success("Draft DC items created successfully")
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to create draft DC items")
        },
    })
}

/**
 * Hook to get draft DC items with filtering/searching
 * 
 * Useful for filtered views or search functionality
 * 
 * @param filters - Optional filters to apply
 * 
 * @example
 * ```tsx
 * const { data } = useDraftDCItemsFiltered({ draftId: 'DC-000001' })
 * ```
 */
export function useDraftDCItemsFiltered(filters?: any) {
    return useQuery({
        queryKey: draftDCItemsKeys.list(filters),
        queryFn: async () => {
            const res = await externalApi.getDraftDCItems()
            if (!res.success) throw new Error(res.message || 'Failed to fetch draft DC items')

            let data = res.data as DraftDCItemsResponse[]

            // Apply filters if provided
            if (filters) {
                if (filters.draftId) {
                    data = data.filter(item => item.draftId === filters.draftId)
                }
                if (filters.partyId) {
                    data = data.filter(item => item.partyId === filters.partyId)
                }
            }

            return data
        },
        staleTime: 2 * 60 * 1000,
    })
}

/**
 * Hook to get total items count and statistics
 * 
 * Useful for dashboard views
 * 
 * @example
 * ```tsx
 * const { data: stats } = useDraftDCItemsStats()
 * console.log(stats.totalDrafts, stats.totalItems)
 * ```
 */
export function useDraftDCItemsStats() {
    return useQuery({
        queryKey: [...draftDCItemsKeys.all, 'stats'],
        queryFn: async () => {
            const res = await externalApi.getDraftDCItems()
            if (!res.success) throw new Error(res.message || 'Failed to fetch draft DC items')

            const data = res.data as DraftDCItemsResponse[]

            return {
                totalDrafts: data.length,
                totalItems: data.reduce((sum, draft) => sum + draft.items.length, 0),
                totalQuantity: data.reduce((sum, draft) =>
                    sum + draft.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
                ),
                totalWeight: data.reduce((sum, draft) =>
                    sum + draft.items.reduce((itemSum, item) => itemSum + item.totalWeight, 0), 0
                ),
            }
        },
        staleTime: 2 * 60 * 1000,
    })
}
