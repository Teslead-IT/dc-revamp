import { NextRequest, NextResponse } from "next/server"
import { initializeDatabase } from "@/server/database"
import { authMiddleware, checkRole, forbiddenResponse, unauthorizedResponse } from "@/server/middleware"
import User from "@/server/models/user.model"
import { validateInput, errorResponse } from "@/server/utils/api-helpers"
import { userCreateSchema } from "@/server/validations"

/**
 * POST /api/auth/create-user
 * 
 * Create a new user (admin or super_admin only)
 * Requires authentication and admin role
 * 
 * Usage:
 * {
 *   "userId": "newuser",
 *   "email": "user@example.com",
 *   "password": "securepassword123",
 *   "name": "John Doe",
 *   "role": "admin"  // or "user" or "admin"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    await initializeDatabase()

    // Check authentication
    const auth = await authMiddleware(request)

    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error || "Unauthorized")
    }

    // Check authorization (only admin and super_admin can create users)
    if (!checkRole(auth.payload!.role, ["admin", "super_admin"])) {
      return forbiddenResponse("Only admins can create users")
    }

    const body = await request.json()

    // Validate input
    const validation = validateInput(userCreateSchema, {
      userId: body.userId,
      email: body.email,
      password: body.password,
      name: body.name,
      role: body.role || "user",
    })

    if (!validation.valid) {
      return errorResponse("Validation failed", validation.errors)
    }

    // Check if userId already exists
    const existingUser = await User.findOne({
      where: { userId: validation.data.userId },
    })

    if (existingUser) {
      return errorResponse("User ID already exists", { userId: "Duplicate userId" })
    }

    // Check if email already exists
    const existingEmail = await User.findOne({
      where: { email: validation.data.email },
    })

    if (existingEmail) {
      return errorResponse("Email already exists", { email: "Duplicate email" })
    }

    // Super admin can create any role, admin can only create "user" role
    if (auth.payload!.role === "admin" && validation.data.role !== "user") {
      return forbiddenResponse("Admins can only create users with 'user' role")
    }

    // Create the user
    const user = await User.create({
      userId: validation.data.userId,
      email: validation.data.email,
      password: validation.data.password,
      name: validation.data.name,
      role: validation.data.role,
      isActive: true,
    })

    // Remove password from response
    const userResponse = user.toJSON()
    delete (userResponse as any).password

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        data: {
          user: userResponse,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Create user error:", error)
    return errorResponse("Failed to create user", { error: error.message })
  }
}
