import { NextRequest, NextResponse } from "next/server"
import { initializeDatabase } from "@/server/database"
import User from "@/server/models/user.model"
import { validateInput, successResponse, errorResponse } from "@/server/utils/api-helpers"
import { userCreateSchema } from "@/server/validations"
import {hashPassword}  from "../../../../server/functions/password"

/**
 * POST /api/auth/setup
 * 
 * Create the first super-admin user (seed endpoint)
 * This should only work if no users exist in the database
 * 
 * Usage:
 * {
 *   "userId": "admin",
 *   "email": "admin@example.com",
 *   "password": "securepassword123",
 *   "name": "Admin User"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    await initializeDatabase()

    const body = await request.json()

    // Check if any users already exist
    const userCount = await User.count()

    if (userCount > 0) {
      return NextResponse.json(
        {
          error: "Users already exist. Use /api/auth/create-user endpoint instead.",
          hint: "Database is already initialized",
        },
        { status: 403 }
      )
    }

    const hashedPassword = await hashPassword(body.password)

    // Validate input
    const validation = validateInput(userCreateSchema, {
      userId: body.userId,
      email: body.email,
      password: hashedPassword,
      name: body.name,
      role: "super_admin", // Always create as super_admin for first user
    })

    if (!validation.valid) {
      return NextResponse.json(
        errorResponse("Validation failed", validation.errors),
        { status: 400 }
      )
    }

    // Check if userId already exists
    const existingUser = await User.findOne({
      where: { userId: validation.data.userId},
    })

    if (existingUser) {
      return NextResponse.json(
        errorResponse("User ID already exists", { userId: ["Duplicate userId"] }),
        { status: 409 }
      )
    }

    // Create the super-admin user
    const user = await User.create({
      userId: validation.data.userId,
      email: validation.data.email,
      password: validation.data.password,
      name: validation.data.name,
      role: "super_admin",
      isActive: true,
    })

    // Remove password from response
    const userResponse = user.toJSON()
    delete (userResponse as any).password

    return NextResponse.json(
      {
        success: true,
        message: "Super Admin user created successfully",
        data: {
          user: userResponse,
          hint: "Now login with these credentials and create other users via /api/auth/create-user",
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Setup error:", error)
    return NextResponse.json(
      errorResponse("Failed to create super-admin user", { error: [error.message] }),
      { status: 500 }
    )
  }
}
