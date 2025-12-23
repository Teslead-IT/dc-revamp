// Client-side JWT Authentication utilities
// For server-side auth functions, see @/server/auth.ts
import { cookies } from "next/headers"

export interface User {
  id: string
  userId: string
  name: string
  email: string
  role: "super_admin" | "admin" | "user"
}

/**
 * Get current user from cookie
 * Client-side function that can be called from any component
 */
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const userDataStr = cookieStore.get("user_data")?.value

  if (!userDataStr) return null

  try {
    return JSON.parse(userDataStr) as User
  } catch {
    return null
  }
}
