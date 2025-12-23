import { ZodSchema } from "zod"

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string[]>
}

/**
 * Validate input data against a Zod schema
 */
export function validateInput<T>(schema: ZodSchema, data: unknown): { valid: true; data: T } | { valid: false; errors: Record<string, string[]> } {
  const result = schema.safeParse(data)

  if (!result.success) {
    const errors: Record<string, string[]> = {}
    result.error.errors.forEach((error) => {
      const path = error.path.join(".")
      if (!errors[path]) {
        errors[path] = []
      }
      errors[path].push(error.message)
    })
    return { valid: false, errors }
  }

  return { valid: true, data: result.data as T }
}

/**
 * Create a success API response
 */
export function successResponse<T>(data?: T, message: string = "Success"): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  }
}

/**
 * Create an error API response
 */
export function errorResponse(message: string, errors?: Record<string, string[]>): ApiResponse {
  return {
    success: false,
    message,
    errors,
  }
}

/**
 * Handle async errors
 */
export async function handleAsyncError(fn: () => Promise<any>) {
  try {
    return await fn()
  } catch (error) {
    console.error("Error:", error)
    throw error
  }
}
