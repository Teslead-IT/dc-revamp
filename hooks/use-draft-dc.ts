/**
 * React Query Hooks for Draft DC Management
 * 
 * This module provides optimized hooks for draft DC (Delivery Challan) operations
 * with automatic caching, background refetching, and optimistic updates.
 * 
 * API Endpoints:
 * - GET    /api/draft-dc      - Get all draft DCs
 * - GET    /api/draft-dc/:id  - Get draft DC by ID
 * - POST   /api/draft-dc      - Create draft DC
 * - PUT    /api/draft-dc/:id  - Update draft DC
 * - DELETE /api/draft-dc/:id  - Delete draft DC
 */

"use client"

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query"
import { externalApi, type DraftDC, type CreateDraftDCData } from "@/lib/api-client"
import { toast } from "sonner"

// ============= Query Keys =============

/**
 * Centralized query keys for draft DC-related queries
 * This ensures consistent cache management across the application
 */
export const draftDCKeys = {
    all: ['draft-dc'] as const,
    lists: () => [...draftDCKeys.all, 'list'] as const,
    list: (filters?: any) => [...draftDCKeys.lists(), filters] as const,
    details: () => [...draftDCKeys.all, 'detail'] as const,
    detail: (id: string | number) => [...draftDCKeys.details(), id] as const,
}

// ============= Query Hooks =============

/**
 * Hook to fetch all draft DCs
 * 
 * Features:
 * - Automatically caches data
 * - Refetches in background when data becomes stale
 * - Shared across components (no duplicate API calls)
 * 
 * @example
 * ```tsx
 * const { data: draftDCs, isLoading, error } = useDraftDCs()
 * 
 * if (isLoading) return <Spinner />
 * if (error) return <ErrorMessage />
 * 
 * return draftDCs?.map(dc => <DCCard key={dc.id} {...dc} />)
 * ```
 */
export function useDraftDCs(options?: Partial<UseQueryOptions<DraftDC[]>>) {
    return useQuery({
        queryKey: draftDCKeys.lists(),
        queryFn: async () => {
            const res = await externalApi.getDraftDCs()
            if (!res.success) throw new Error(res.message || 'Failed to fetch draft DCs')
            return res.data as DraftDC[]
        },
        // Keep draft DC list fresh for 2 minutes
        staleTime: 2 * 60 * 1000,
        ...options,
    })
}

/**
 * Hook to fetch draft DC details with pagination
 * 
 * @param page - Page number (1-indexed)
 * @param limit - Items per page (default: 25)
 * @param enabled - Whether to enable the query
 * 
 * @example
 * ```tsx
 * const { data, isLoading } = useDraftDCDetails(1, 25)
 * 
 * return (
 *   <div>
 *     <p>Total: {data?.meta.total}</p>
 *     {data?.data.map(dc => (
 *       <DCRow
 *         key={dc.id}
 *         draftId={dc.draftId}
 *         partyName={dc.partyDetails?.partyName}
 *         totalItems={dc.draftDcItems.length}
 *       />
 *     ))}
 *   </div>
 * )
 * ```
 */
export function useDraftDCDetails(page: number = 1, limit: number = 25, enabled = true) {
    return useQuery({
        queryKey: [...draftDCKeys.all, 'details', page, limit],
        queryFn: async () => {
            const res = await externalApi.getDraftDCDetails(page, limit)
            if (!res.success) throw new Error(res.message || 'Failed to fetch draft DC details')
            return res as any // Returns DraftDCDetailsResponse
        },
        enabled,
        // Keep draft DC details fresh for 2 minutes
        staleTime: 2 * 60 * 1000,
    })
}

/**
 * Hook to fetch a single draft DC by ID
 * 
 * @param id - Draft DC ID (can be null/undefined to disable query)
 * @param enabled - Whether to enable the query (default: true if id exists)
 * 
 * @example
 * ```tsx
 * const { data: draftDC, isLoading } = useDraftDC(dcId)
 * 
 * if (isLoading) return <Spinner />
 * 
 * return (
 *   <div>
 *     <h1>DC: {draftDC?.id}</h1>
 *     <p>Party: {draftDC?.partyId}</p>
 *     <p>Vehicle: {draftDC?.vehicleNo}</p>
 *   </div>
 * )
 * ```
 */
export function useDraftDC(
    id: string | number | null | undefined,
    enabled = true
) {
    return useQuery({
        queryKey: draftDCKeys.detail(id as string | number),
        queryFn: async () => {
            if (!id) throw new Error("Draft DC ID is required")
            const res = await externalApi.getDraftDC(id)
            if (!res.success) throw new Error(res.message || 'Failed to fetch draft DC')
            return res.data as DraftDC
        },
        enabled: !!id && enabled,
        // Keep individual draft DC data fresh for 3 minutes
        staleTime: 3 * 60 * 1000,
    })
}

// ============= Mutation Hooks =============

/**
 * Hook to create a new draft DC
 * 
 * Features:
 * - Type-safe with CreateDraftDCData interface
 * - Automatically invalidates draft DC list after creation
 * - Shows success/error toast notifications
 * 
 * @example
 * ```tsx
 * const createDC = useCreateDraftDC()
 * 
 * await createDC.mutateAsync({
 *   partyId: "SUP-2696-982",
 *   vehicleNo: "TN01AC1029",
 *   process: "Machining",
 *   totalDispatchedQuantity: 29.18,
 *   totalRate: 10.12,
 *   showWeight: true,
 *   showSquareFeet: false,
 *   notes: "Testing",
 *   updatedBy: "",
 *   dcType: "SPM",
 *   dcDate: "2025-12-25 16:17:52.889+05:30"
 * })
 * ```
 */
export function useCreateDraftDC() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (draftData: CreateDraftDCData) => {
            const res = await externalApi.createDraftDC(draftData)
            if (!res.success) throw new Error(res.message || 'Failed to create draft DC')
            return res.data as DraftDC
        },
        onSuccess: (data) => {
            // Invalidate draft DC list to trigger refetch
            queryClient.invalidateQueries({ queryKey: draftDCKeys.lists() })

            // Set the new draft DC in cache for instant access
            if (data?.id) {
                queryClient.setQueryData(draftDCKeys.detail(data.id), data)
            }

            toast.success("Draft DC created successfully")
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to create draft DC")
        },
    })
}

/**
 * Hook to update an existing draft DC
 * 
 * Features:
 * - Optimistic updates (UI updates instantly)
 * - Automatic rollback on error
 * - Type-safe with Partial<CreateDraftDCData>
 * 
 * @example
 * ```tsx
 * const updateDC = useUpdateDraftDC()
 * 
 * await updateDC.mutateAsync({
 *   id: dcId,
 *   data: {
 *     vehicleNo: "TN01AC9999",
 *     notes: "Updated notes"
 *   }
 * })
 * // UI updates instantly
 * // Rolls back if error occurs
 * ```
 */
export function useUpdateDraftDC() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            data
        }: {
            id: string | number
            data: Partial<CreateDraftDCData>
        }) => {
            const res = await externalApi.updateDraftDC(id, data)
            if (!res.success) throw new Error(res.message || 'Failed to update draft DC')
            return res.data as DraftDC
        },
        // Optimistic update - update UI before server responds
        onMutate: async ({ id, data }) => {
            // Cancel outgoing refetches to avoid overwriting optimistic update
            await queryClient.cancelQueries({ queryKey: draftDCKeys.detail(id) })

            // Snapshot previous value for rollback
            const previousDC = queryClient.getQueryData(draftDCKeys.detail(id))

            // Optimistically update to the new value
            queryClient.setQueryData(draftDCKeys.detail(id), (old: any) => ({
                ...old,
                ...data,
            }))

            // Return context with previous value for potential rollback
            return { previousDC, id }
        },
        onSuccess: (_data, { id }) => {
            // Invalidate both list and detail to ensure consistency
            queryClient.invalidateQueries({ queryKey: draftDCKeys.lists() })
            queryClient.invalidateQueries({ queryKey: draftDCKeys.detail(id) })

            toast.success("Draft DC updated successfully")
        },
        onError: (error: any, _variables, context) => {
            // Rollback optimistic update on error
            if (context?.previousDC) {
                queryClient.setQueryData(
                    draftDCKeys.detail(context.id),
                    context.previousDC
                )
            }
            toast.error(error.message || "Failed to update draft DC")
        },
    })
}

/**
 * Hook to delete a draft DC
 * 
 * Features:
 * - Removes draft DC from cache
 * - Invalidates draft DC list
 * - Shows success/error toast notifications
 * 
 * @example
 * ```tsx
 * const deleteDC = useDeleteDraftDC()
 * 
 * if (confirm('Delete this draft DC?')) {
 *   await deleteDC.mutateAsync(dcId)
 *   // Success toast shown automatically
 *   // Draft DC removed from list automatically
 * }
 * ```
 */
export function useDeleteDraftDC() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string | number) => {
            const res = await externalApi.deleteDraftDC(id)
            if (!res.success) throw new Error(res.message || 'Failed to delete draft DC')
            return res.data
        },
        onSuccess: (_data, id) => {
            // Remove from cache
            queryClient.removeQueries({ queryKey: draftDCKeys.detail(id) })

            // Invalidate list to trigger refetch
            queryClient.invalidateQueries({ queryKey: draftDCKeys.lists() })
            queryClient.invalidateQueries({ queryKey: draftDCKeys.all })
        },
    })
}

// ============= Utility Hooks =============

/**
 * Hook to prefetch draft DC data
 * 
 * Useful for improving perceived performance by prefetching data
 * before user actually needs it (e.g., on hover)
 * 
 * @example
 * ```tsx
 * const prefetchDC = usePrefetchDraftDC()
 * 
 * <div 
 *   onMouseEnter={() => prefetchDC(dcId)}
 *   onClick={() => navigate(`/draft-dc/${dcId}`)}
 * >
 *   View Draft DC
 * </div>
 * ```
 */
export function usePrefetchDraftDC() {
    const queryClient = useQueryClient()

    return (id: string | number) => {
        queryClient.prefetchQuery({
            queryKey: draftDCKeys.detail(id),
            queryFn: async () => {
                const res = await externalApi.getDraftDC(id)
                if (!res.success) throw new Error(res.message || 'Failed to prefetch draft DC')
                return res.data as DraftDC
            },
            staleTime: 3 * 60 * 1000,
        })
    }
}

/**
 * Hook to get draft DCs filtered by DC type
 * 
 * @param dcType - 'SPM' | 'QC' | 'VALVE'
 * 
 * @example
 * ```tsx
 * const { data: spmDCs } = useDraftDCsByType('SPM')
 * ```
 */
export function useDraftDCsByType(dcType?: 'SPM' | 'QC' | 'VALVE') {
    return useQuery({
        queryKey: [...draftDCKeys.all, 'by-type', dcType],
        queryFn: async () => {
            const res = await externalApi.getDraftDCs()
            if (!res.success) throw new Error(res.message || 'Failed to fetch draft DCs')

            let data = res.data as DraftDC[]

            // Filter by DC type if provided
            if (dcType) {
                data = data.filter(dc => dc.dcType === dcType)
            }

            return data
        },
        staleTime: 2 * 60 * 1000,
        enabled: !!dcType,
    })
}
