/**
 * React Query Hooks for Items Management
 * 
 * This module provides optimized hooks for items operations
 * with automatic caching, background refetching, and optimistic updates.
 * 
 * API Endpoints:
 * - GET    /api/items?search=&page=&limit=  - Get all items with pagination/search
 * - GET    /api/items/:itemId                - Get item by ID
 * - POST   /api/items                        - Create item
 * - PUT    /api/items/:itemId                - Update item
 * - DELETE /api/items/:itemId                - Delete item
 */

"use client"

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query"
import { externalApi, type ApiResponse } from "@/lib/api-client"
import { showToast as toast } from "@/lib/toast-service"

// ============= Types =============

/**
 * Item data structure from API responses
 */
export interface Item {
    id: number
    standardItemId: string
    itemName: string
    searchText: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
}

/**
 * Create item request payload
 */
export interface CreateItemData {
    itemName: string
}

/**
 * Update item request payload
 */
export interface UpdateItemData {
    itemName: string
}

/**
 * Paginated items response
 */
export interface ItemsListResponse {
    success: boolean
    message: string
    total: number
    page: number
    data: Item[]
}

/**
 * Single item response
 */
export interface ItemResponse {
    success: boolean
    message: string
    data: Item
}

// ============= Query Keys =============

/**
 * Centralized query keys for items-related queries
 * This ensures consistent cache management across the application
 */
export const itemsKeys = {
    all: ['items'] as const,
    lists: () => [...itemsKeys.all, 'list'] as const,
    list: (filters?: { search?: string; page?: number; limit?: number }) =>
        [...itemsKeys.lists(), filters] as const,
    details: () => [...itemsKeys.all, 'detail'] as const,
    detail: (id: string | number) => [...itemsKeys.details(), id] as const,
}

// ============= Query Hooks =============

/**
 * Hook to fetch all items with pagination and search
 * 
 * Features:
 * - Automatically caches data
 * - Refetches in background when data becomes stale
 * - Shared across components (no duplicate API calls)
 * - Supports search and pagination
 * 
 * @param search - Optional search term to filter items
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 20)
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useItems({ search: 'valve', page: 1, limit: 20 })
 * 
 * if (isLoading) return <Spinner />
 * if (error) return <ErrorMessage />
 * 
 * return data?.data.map(item => <ItemCard key={item.id} {...item} />)
 * ```
 */
export function useItems(
    filters?: { search?: string; page?: number; limit?: number },
    options?: Partial<UseQueryOptions<ItemsListResponse>>
) {
    const { search = '', page = 1, limit = 20 } = filters || {}

    return useQuery({
        queryKey: itemsKeys.list({ search, page, limit }),
        queryFn: async () => {
            // Build query string
            let query = `/api/items?page=${page}&limit=${limit}`
            if (search) {
                query += `&search=${encodeURIComponent(search)}`
            }

            const res = await externalApi.get(query)
            if (!res.success) throw new Error(res.message || 'Failed to fetch items')
            return {
                success: res.success,
                message: res.message,
                total: (res as any).total || 0,
                page: (res as any).page || page,
                data: (res.data || []) as Item[]
            } as ItemsListResponse
        },
        // Keep items fresh for 2 minutes
        staleTime: 2 * 60 * 1000,
        ...options,
    })
}

/**
 * Hook to fetch a single item by standardItemId
 * 
 * Features:
 * - Automatically caches individual item data
 * - Useful for item detail pages
 * 
 * @param standardItemId - Standard Item ID to fetch (e.g., STDIT-000001)
 * @param enabled - Whether the query should run (default: true)
 * 
 * @example
 * ```tsx
 * const { data: item, isLoading } = useItem('STDIT-000001')
 * 
 * if (isLoading) return <Spinner />
 * return <ItemDetails item={item?.data} />
 * ```
 */
export function useItem(
    standardItemId: string,
    options?: Partial<UseQueryOptions<ItemResponse>>
) {
    return useQuery({
        queryKey: itemsKeys.detail(standardItemId),
        queryFn: async () => {
            const res = await externalApi.get(`/api/items/${standardItemId}`)
            if (!res.success) throw new Error(res.message || 'Failed to fetch item')
            return {
                success: res.success,
                message: res.message,
                data: res.data as Item
            } as ItemResponse
        },
        // Only run query if standardItemId exists
        enabled: !!standardItemId,
        // Keep item details fresh for 5 minutes
        staleTime: 5 * 60 * 1000,
        ...options,
    })
}

// ============= Mutation Hooks =============

/**
 * Hook to create a new item
 * 
 * Features:
 * - Type-safe with CreateItemData interface
 * - Automatically invalidates items list after creation
 * - Shows success/error toast notifications
 * 
 * @example
 * ```tsx
 * const createItem = useCreateItem()
 * 
 * await createItem.mutateAsync({
 *   itemName: "Valve-102"
 * })
 * ```
 */
export function useCreateItem() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (itemData: CreateItemData) => {
            const res = await externalApi.post('/api/items', itemData)
            if (!res.success) throw new Error(res.message || 'Failed to create item')
            return {
                success: res.success,
                message: res.message,
                data: res.data as Item
            } as ItemResponse
        },
        onSuccess: (data) => {
            // Invalidate all items lists to trigger refetch
            queryClient.invalidateQueries({ queryKey: itemsKeys.lists() })

            toast.success(data.message || "Item created successfully")
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to create item")
        },
    })
}

/**
 * Hook to update an existing item
 * 
 * Features:
 * - Type-safe with UpdateItemData interface
 * - Automatically invalidates items list and specific item cache after update
 * - Shows success/error toast notifications
 * 
 * @example
 * ```tsx
 * const updateItem = useUpdateItem()
 * 
 * await updateItem.mutateAsync({
 *   standardItemId: 'STDIT-000001',
 *   data: { itemName: "Valve-103" }
 * })
 * ```
 */
export function useUpdateItem() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ standardItemId, data }: { standardItemId: string; data: UpdateItemData }) => {
            const res = await externalApi.put(`/api/items/${standardItemId}`, data)
            if (!res.success) throw new Error(res.message || 'Failed to update item')
            return {
                success: res.success,
                message: res.message,
                data: res.data as Item
            } as ItemResponse
        },
        onSuccess: (data, variables) => {
            // Invalidate items lists
            queryClient.invalidateQueries({ queryKey: itemsKeys.lists() })

            // Invalidate the specific item detail
            queryClient.invalidateQueries({ queryKey: itemsKeys.detail(variables.standardItemId) })

            toast.success(data.message || "Item updated successfully")
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update item")
        },
    })
}

/**
 * Hook to delete an item
 * 
 * Features:
 * - Removes item from cache
 * - Automatically invalidates items list after deletion
 * - Shows success/error toast notifications
 * 
 * @example
 * ```tsx
 * const deleteItem = useDeleteItem()
 * 
 * await deleteItem.mutateAsync('STDIT-000001')
 * // Success toast shown automatically
 * ```
 */
export function useDeleteItem() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (standardItemId: string) => {
            const res = await externalApi.delete(`/api/items/${standardItemId}`)
            if (!res.success) throw new Error(res.message || 'Failed to delete item')
            return res
        },
        onSuccess: (data, standardItemId) => {
            // Invalidate items lists
            queryClient.invalidateQueries({ queryKey: itemsKeys.lists() })

            // Remove the specific item from cache
            queryClient.removeQueries({ queryKey: itemsKeys.detail(standardItemId) })

            toast.success(data.message || "Item deleted successfully")
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete item")
        },
    })
}

/**
 * Hook to get items statistics
 * 
 * Useful for dashboard views showing total items count
 * 
 * @example
 * ```tsx
 * const { data: stats } = useItemsStats()
 * console.log(stats.total) // Total number of items
 * ```
 */
export function useItemsStats() {
    return useQuery({
        queryKey: [...itemsKeys.all, 'stats'],
        queryFn: async () => {
            const res = await externalApi.get('/api/items?page=1&limit=1')
            if (!res.success) throw new Error(res.message || 'Failed to fetch items stats')

            return {
                total: (res as any).total || 0,
            }
        },
        staleTime: 2 * 60 * 1000,
    })
}
