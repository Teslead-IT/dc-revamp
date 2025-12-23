import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export interface TokenPayload {
  id: string
  userId: string
  email: string
  name: string
  role: "super_admin" | "admin" | "user"
  iat: number
  exp: number
}

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret") as TokenPayload
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * Generate Access Token (expires in 1 hour)
 */
export const generateAccessToken = (payload: Omit<TokenPayload, "iat" | "exp">): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || "your_jwt_secret", {
    expiresIn: "1h",
  })
}

/**
 * Generate Refresh Token (expires in 7 days)
 */
export const generateRefreshToken = (payload: Omit<TokenPayload, "iat" | "exp">): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || "your_refresh_secret", {
    expiresIn: "7d",
  })
}

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || "your_refresh_secret") as TokenPayload
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * Authentication Middleware - Extracts and validates token
 */
export const authMiddleware = async (request: NextRequest) => {
  const token = extractToken(request)

  if (!token) {
    return {
      authenticated: false,
      payload: null,
      error: "No token provided",
    }
  }

  const payload = verifyToken(token)

  if (!payload) {
    return {
      authenticated: false,
      payload: null,
      error: "Invalid or expired token",
    }
  }

  return {
    authenticated: true,
    payload,
    error: null,
  }
}

/**
 * Extract token from Authorization header
 */
export const extractToken = (request: NextRequest): string | null => {
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  return authHeader.substring(7)
}

/**
 * Role-based Access Control (RBAC) checker
 */
export const checkRole = (userRole: string, allowedRoles: string[]): boolean => {
  return allowedRoles.includes(userRole)
}

/**
 * Unauthorized Response
 */
export const unauthorizedResponse = (message: string = "Unauthorized") => {
  return NextResponse.json({ error: message }, { status: 401 })
}

/**
 * Forbidden Response (authenticated but no permission)
 */
export const forbiddenResponse = (message: string = "Forbidden") => {
  return NextResponse.json({ error: message }, { status: 403 })
}
