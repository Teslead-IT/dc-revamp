// Server-side JWT Authentication utilities
import { initializeDatabase } from "./database"
import User from "./models/user.model"
import  {verifyPassword}  from "../server/functions/password"
import { generateAccessToken, generateRefreshToken } from "./middleware/auth.middleware"

export interface UserData {
  id: string
  userId: string
  name: string
  email: string
  role: "super_admin" | "admin" | "user"
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: UserData
  accessToken?: string
  refreshToken?: string
}

/**
 * Verify if userId exists in database
 * Server-only function
 */
export async function verifyUserId(userId: string): Promise<{ exists: boolean; message: string }> {
  try {
    await initializeDatabase()
    const user = await User.findOne({
      where: { userId },
    })

    if (user) {
      return { exists: true, message: "User found" }
    }
    return { exists: false, message: "User ID not found" }
  } catch (error) {
    console.error("Error verifying user ID:", error)
    return { exists: false, message: "Database error" }
  }
}

/**
 * Verify password for userId and generate JWT tokens
 * Server-only function
 */
export async function verifyPassword(userId: string, password: string): Promise<AuthResponse> {
  try {
    await initializeDatabase()

    const user = await User.findOne({
      where: { userId },
    })

    if (!user) {
      return { success: false, message: "Invalid credentials" }
    }

    // Simple password comparison (in production, use bcrypt)
    // if (user.getDataValue("password") !== password) {
    //   return { success: false, message: "Invalid credentials" }
    // }
    const isValid = await verifyPassword(password, user.getDataValue("password"))
    if (!isValid) {
      return { success: false, message: "Invalid credentials" }
    }
    // Check if user is active
    if (!user.getDataValue("isActive")) {
      return { success: false, message: "User account is inactive" }
    }

    const userData: UserData = {
      id: user.getDataValue("id"),
      userId: user.getDataValue("userId"),
      name: user.getDataValue("name"),
      email: user.getDataValue("email"),
      role: user.getDataValue("role"),
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken({
      id: userData.id,
      userId: userData.userId,
      email: userData.email,
      name: userData.name,
      role: userData.role,
    })

    const refreshToken = generateRefreshToken({
      id: userData.id,
      userId: userData.userId,
      email: userData.email,
      name: userData.name,
      role: userData.role,
    })

    return {
      success: true,
      message: "Login successful",
      user: userData,
      accessToken,
      refreshToken,
    }
  } catch (error: any) {
    console.error("Auth error:", error)
    return { success: false, message: "Authentication error" }
  }
}
