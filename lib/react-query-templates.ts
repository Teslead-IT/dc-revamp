/**
 * React Query Hooks Template Generator
 * 
 * This file provides a template and examples for creating
 * React Query hooks for different entities in your application.
 * 
 * Usage:
 * 1. Copy the template below
 * 2. Replace 'Entity' with your entity name (e.g., 'Product', 'Customer')
 * 3. Update the API client methods
 * 4. Customize the hooks as needed
 */

"use client"

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query"
import { externalApi } from "@/lib/api-client"
import { toast } from "sonner"
import { createQueryKeys } from "@/lib/query-utils"

/* ==========================================
   TEMPLATE - Replace 'entity' with your entity name
   ========================================== */

/**
 * Example: Create hooks for a generic entity
 * 
 * @param entityName - Name of the entity (e.g., 'products', 'customers')
 * @param apiMethods - Object containing CRUD API methods
 */
export function createEntityHooks<T = any>(
    entityName: string,
    apiMethods: {
        getAll: () => Promise<any>
        getOne: (id: string | number) => Promise<any>
        create: (data: any) => Promise<any>
        update: (id: string | number, data: any) => Promise<any>
        delete: (id: string | number) => Promise<any>
    }
) {
    const queryKeys = createQueryKeys(entityName)

    // Hook to fetch all entities
    const useEntities = (options?: Partial<UseQueryOptions>) => {
        return useQuery({
            queryKey: queryKeys.lists(),
            queryFn: async () => {
                const res = await apiMethods.getAll()
                if (!res.success) throw new Error(res.message)
                return res.data
            },
            ...options,
        })
    }

    // Hook to fetch a single entity
    const useEntity = (id: string | number | null | undefined, enabled = true) => {
        return useQuery({
            queryKey: queryKeys.detail(id as string | number),
            queryFn: async () => {
                if (!id) throw new Error(`${entityName} ID is required`)
                const res = await apiMethods.getOne(id)
                if (!res.success) throw new Error(res.message)
                return res.data
            },
            enabled: !!id && enabled,
        })
    }

    // Hook to create an entity
    const useCreateEntity = () => {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: async (data: T) => {
                const res = await apiMethods.create(data)
                if (!res.success) throw new Error(res.message)
                return res.data
            },
            onSuccess: (data) => {
                queryClient.invalidateQueries({ queryKey: queryKeys.lists() })
                if (data?.id) {
                    queryClient.setQueryData(queryKeys.detail(data.id), data)
                }
                toast.success(`${entityName} created successfully`)
            },
            onError: (error: any) => {
                toast.error(error.message || `Failed to create ${entityName}`)
            },
        })
    }

    // Hook to update an entity
    const useUpdateEntity = () => {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: async ({ id, data }: { id: string | number; data: Partial<T> }) => {
                const res = await apiMethods.update(id, data)
                if (!res.success) throw new Error(res.message)
                return res.data
            },
            onMutate: async ({ id, data }) => {
                await queryClient.cancelQueries({ queryKey: queryKeys.detail(id) })
                const previousData = queryClient.getQueryData(queryKeys.detail(id))
                queryClient.setQueryData(queryKeys.detail(id), (old: any) => ({
                    ...old,
                    ...data,
                }))
                return { previousData, id }
            },
            onSuccess: (_data, { id }) => {
                queryClient.invalidateQueries({ queryKey: queryKeys.lists() })
                queryClient.invalidateQueries({ queryKey: queryKeys.detail(id) })
                toast.success(`${entityName} updated successfully`)
            },
            onError: (error: any, _variables, context) => {
                if (context?.previousData) {
                    queryClient.setQueryData(queryKeys.detail(context.id), context.previousData)
                }
                toast.error(error.message || `Failed to update ${entityName}`)
            },
        })
    }

    // Hook to delete an entity
    const useDeleteEntity = () => {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: async (id: string | number) => {
                const res = await apiMethods.delete(id)
                if (!res.success) throw new Error(res.message)
                return res.data
            },
            onSuccess: (_data, id) => {
                queryClient.removeQueries({ queryKey: queryKeys.detail(id) })
                queryClient.invalidateQueries({ queryKey: queryKeys.lists() })
                toast.success(`${entityName} deleted successfully`)
            },
            onError: (error: any) => {
                toast.error(error.message || `Failed to delete ${entityName}`)
            },
        })
    }

    return {
        useEntities,
        useEntity,
        useCreateEntity,
        useUpdateEntity,
        useDeleteEntity,
        queryKeys,
    }
}

/* ==========================================
   EXAMPLE IMPLEMENTATIONS
   ========================================== */

/**
 * Example: Products hooks
 * Demonstrates how to create hooks for a specific entity
 */

// First, add the API methods to your api-client.ts:
/*
async getProducts() {
  return this.get('/products')
}

async getProduct(id: string | number) {
  return this.get(`/products/${id}`)
}

async createProduct(productData: any) {
  return this.post('/products', productData)
}

async updateProduct(id: string | number, productData: any) {
  return this.put(`/products/${id}`, productData)
}

async deleteProduct(id: string | number) {
  return this.delete(`/products/${id}`)
}
*/

// Then create the hooks:
/*
export const {
  useEntities: useProducts,
  useEntity: useProduct,
  useCreateEntity: useCreateProduct,
  useUpdateEntity: useUpdateProduct,
  useDeleteEntity: useDeleteProduct,
  queryKeys: productKeys,
} = createEntityHooks('products', {
  getAll: () => externalApi.getProducts(),
  getOne: (id) => externalApi.getProduct(id),
  create: (data) => externalApi.createProduct(data),
  update: (id, data) => externalApi.updateProduct(id, data),
  delete: (id) => externalApi.deleteProduct(id),
})
*/

/**
 * Example: Using the hooks in a component
 */
/*
'use client'

import { useProducts, useCreateProduct } from '@/hooks/use-products'

export function ProductList() {
  const { data: products, isLoading, error } = useProducts()
  const createProduct = useCreateProduct()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const handleCreate = async () => {
    await createProduct.mutateAsync({
      name: 'New Product',
      price: 99.99
    })
  }

  return (
    <div>
      <button onClick={handleCreate}>
        {createProduct.isPending ? 'Creating...' : 'Create Product'}
      </button>
      {products?.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}
*/

/* ==========================================
   ADVANCED PATTERNS
   ========================================== */

/**
 * Example: Infinite scroll query
 */
export function useInfiniteEntities(entityName: string, fetchFn: (page: number) => Promise<any>) {
    const { useInfiniteQuery } = require("@tanstack/react-query")

    return useInfiniteQuery({
        queryKey: [entityName, 'infinite'],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await fetchFn(pageParam)
            if (!res.success) throw new Error(res.message)
            return res.data
        },
        getNextPageParam: (lastPage, allPages) => {
            // Adjust based on your API pagination structure
            return lastPage?.hasMore ? allPages.length + 1 : undefined
        },
        initialPageParam: 1,
    })
}

/**
 * Example: Dependent queries
 */
export function useDependentQuery(
    userId: string | null,
    fetchUserPosts: (userId: string) => Promise<any>
) {
    return useQuery({
        queryKey: ['userPosts', userId],
        queryFn: async () => {
            if (!userId) throw new Error('User ID required')
            const res = await fetchUserPosts(userId)
            if (!res.success) throw new Error(res.message)
            return res.data
        },
        // Only run when userId exists
        enabled: !!userId,
    })
}

/**
 * Example: Parallel queries
 */
export function useParallelQueries() {
    const queryClient = useQueryClient()
    const { useQueries } = require("@tanstack/react-query")

    const results = useQueries({
        queries: [
            {
                queryKey: ['products'],
                queryFn: () => externalApi.get('/products'),
            },
            {
                queryKey: ['customers'],
                queryFn: () => externalApi.get('/customers'),
            },
            {
                queryKey: ['orders'],
                queryFn: () => externalApi.get('/orders'),
            },
        ],
    })

    return {
        products: results[0],
        customers: results[1],
        orders: results[2],
        isLoading: results.some(query => query.isLoading),
        isError: results.some(query => query.isError),
    }
}
