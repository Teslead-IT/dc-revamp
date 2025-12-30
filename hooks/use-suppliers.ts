/**
 * React Query Hooks for Supplier Management
 * 
 * This module provides optimized hooks for supplier-related operations
 * with automatic caching, background refetching, and optimistic updates.
 * 
 * API Endpoints:
 * - GET    /api/suppliers      - Get all suppliers
 * - GET    /api/suppliers/:id  - Get supplier by ID
 * - POST   /api/suppliers      - Create supplier
 * - PUT    /api/suppliers/:id  - Update supplier
 * - DELETE /api/suppliers/:id  - Delete supplier
 */

"use client"

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query"
import { externalApi, type Supplier, type CreateSupplierData } from "@/lib/api-client"
import { showToast as toast } from "@/lib/toast-service"

// Query Keys - Centralized for better cache management
export const supplierKeys = {
    all: ['suppliers'] as const,
    lists: () => [...supplierKeys.all, 'list'] as const,
    list: (filters?: any) => [...supplierKeys.lists(), filters] as const,
    details: () => [...supplierKeys.all, 'detail'] as const,
    detail: (id: string | number) => [...supplierKeys.details(), id] as const,
}

/**
 * Hook to fetch all suppliers
 * 
 * Features:
 * - Automatically caches data
 * - Refetches in background when data becomes stale
 * - Shared across components (no duplicate API calls)
 * 
 * @example
 * const { data: suppliers, isLoading, error } = useSuppliers()
 */
export function useSuppliers(options?: Partial<UseQueryOptions<Supplier[]>>) {
    return useQuery({
        queryKey: supplierKeys.lists(),
        queryFn: async () => {
            const res = await externalApi.getSuppliers()
            if (!res.success) throw new Error(res.message || 'Failed to fetch suppliers')
            // API returns { data: { suppliers: [...] } }
            const data = res.data as any
            return (data.suppliers || []) as Supplier[]
        },
        // Keep supplier list fresh for 3 minutes
        staleTime: 3 * 60 * 1000,
        ...options,
    })
}

/**
 * Hook to fetch a single supplier by ID
 * 
 * @param id - Supplier ID (can be null/undefined to disable query)
 * @param enabled - Whether to enable the query (default: true if id exists)
 * 
 * @example
 * const { data: supplier, isLoading } = useSupplier(supplierId)
 */
export function useSupplier(id: string | number | null | undefined, enabled = true) {
    return useQuery({
        queryKey: supplierKeys.detail(id as string | number),
        queryFn: async () => {
            if (!id) throw new Error("Supplier ID is required")
            const res = await externalApi.getSupplier(id)
            if (!res.success) throw new Error(res.message || 'Failed to fetch supplier')
            return res.data as Supplier
        },
        enabled: !!id && enabled,
        // Keep individual supplier data fresh for 5 minutes
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook to create a new supplier
 * 
 * Features:
 * - Type-safe with CreateSupplierData interface
 * - Automatically invalidates supplier list after creation
 * - Shows success/error toast notifications
 * 
 * @example
 * const createSupplier = useCreateSupplier()
 * await createSupplier.mutateAsync({
 *   partyName: "Stranger",
 *   addressLine1: "Theni",
 *   addressLine2: "Tn",
 *   city: "CBE",
 *   state: "TN",
 *   stateCode: 10,
 *   pinCode: 928192,
 *   gstinNumber: "2938k2828829090",
 *   email: "demi@gmail.com",
 *   phone: "9387262696"
 * })
 */
export function useCreateSupplier() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (supplierData: CreateSupplierData) => {
            const res = await externalApi.createSupplier(supplierData)
            if (!res.success) throw new Error(res.message || 'Failed to create supplier')

            // API might return { data: { supplier: {...} } } or { data: {...} }
            const supplierResponse = res.data as any
            const supplier = supplierResponse.supplier || supplierResponse

            // Ensure partyId exists - if not, construct it from the response
            if (!supplier.partyId && supplier.id) {
                console.warn('partyId missing from API response, using returned data:', supplier)
            }

            return supplier as Supplier
        },
        onSuccess: (data) => {
            // Invalidate supplier list to trigger refetch
            queryClient.invalidateQueries({ queryKey: supplierKeys.lists() })

            // Set the new supplier in cache for instant access
            if (data?.id) {
                queryClient.setQueryData(supplierKeys.detail(data.id), data)
            }

            toast.success("Supplier created successfully")
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to create supplier")
        },
    })
}

/**
 * Hook to update an existing supplier
 * 
 * Features:
 * - Optimistic updates (UI updates instantly)
 * - Automatic rollback on error
 * - Type-safe with Partial<CreateSupplierData>
 * 
 * @example
 * const updateSupplier = useUpdateSupplier()
 * await updateSupplier.mutateAsync({
 *   id: supplierId,
 *   data: {
 *     addressLine1: "Madurai",
 *     addressLine2: "KL"
 *   }
 * })
 */
export function useUpdateSupplier() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, data }: { id: string | number; data: Partial<CreateSupplierData> }) => {
            const res = await externalApi.updateSupplier(id, data)
            if (!res.success) throw new Error(res.message || 'Failed to update supplier')
            return res.data as Supplier
        },
        onMutate: async ({ id, data }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: supplierKeys.detail(id) })

            // Snapshot previous value
            const previousSupplier = queryClient.getQueryData(supplierKeys.detail(id))

            // Optimistically update to the new value
            queryClient.setQueryData(supplierKeys.detail(id), (old: any) => ({
                ...old,
                ...data,
            }))

            // Return context with previous value
            return { previousSupplier, id }
        },
        onSuccess: (_data, { id }) => {
            // Invalidate both list and detail to ensure consistency
            queryClient.invalidateQueries({ queryKey: supplierKeys.lists() })
            queryClient.invalidateQueries({ queryKey: supplierKeys.detail(id) })

            toast.success("Supplier updated successfully")
        },
        onError: (error: any, _variables, context) => {
            // Rollback on error
            if (context?.previousSupplier) {
                queryClient.setQueryData(
                    supplierKeys.detail(context.id),
                    context.previousSupplier
                )
            }
            toast.error(error.message || "Failed to update supplier")
        },
    })
}

/**
 * Hook to delete a supplier
 * 
 * Features:
 * - Removes supplier from cache
 * - Invalidates supplier list
 * - Shows success/error toast notifications
 * 
 * @example
 * const deleteSupplier = useDeleteSupplier()
 * if (confirm('Delete this supplier?')) {
 *   await deleteSupplier.mutateAsync(supplierId)
 * }
 */
export function useDeleteSupplier() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string | number) => {
            const res = await externalApi.deleteSupplier(id)
            if (!res.success) throw new Error(res.message || 'Failed to delete supplier')
            return res.data
        },
        onSuccess: (_data, id) => {
            // Remove from cache
            queryClient.removeQueries({ queryKey: supplierKeys.detail(id) })

            // Invalidate list to trigger refetch
            queryClient.invalidateQueries({ queryKey: supplierKeys.lists() })

            toast.success("Supplier deleted successfully")
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete supplier")
        },
    })
}


export function usePrefetchSupplier() {
    const queryClient = useQueryClient()

    return (id: string | number) => {
        queryClient.prefetchQuery({
            queryKey: supplierKeys.detail(id),
            queryFn: async () => {
                const res = await externalApi.getSupplier(id)
                if (!res.success) throw new Error(res.message || 'Failed to prefetch supplier')
                return res.data as Supplier
            },
            staleTime: 5 * 60 * 1000,
        })
    }
}

/**
 * Hook to search suppliers by name
 * Useful for autocomplete/search functionality
 * Uses server-side search via API query parameter
 * 
 * @param searchTerm - Search term to filter suppliers
 * @param enabled - Whether to enable the query
 * 
 * @example
 * const { data: suppliers } = useSearchSuppliers('Stranger')
 */
export function useSearchSuppliers(searchTerm: string, enabled = true) {
    return useQuery({
        queryKey: [...supplierKeys.all, 'search', searchTerm],
        queryFn: async () => {
            // Use API's built-in search parameter
            const res = await externalApi.getSuppliers(searchTerm)
            if (!res.success) throw new Error(res.message || 'Failed to search suppliers')

            // API returns { data: { suppliers: [...] } }
            const data = res.data as any
            return (data.suppliers || []) as Supplier[]
        },
        enabled: enabled && (searchTerm?.length ?? 0) >= 2, // Only search when 2+ characters
        staleTime: 3 * 60 * 1000,
    })
}
