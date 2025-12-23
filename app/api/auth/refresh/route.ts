import { NextRequest, NextResponse } from "next/server"
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from "@/server/middleware/auth.middleware"

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json()

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token required" }, { status: 400 })
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken)

    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 401 })
    }

    // Generate new access token
    const accessToken = generateAccessToken({
      id: payload.id,
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    })

    // Optionally generate new refresh token (for token rotation)
    const newRefreshToken = generateRefreshToken({
      id: payload.id,
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    })

    return NextResponse.json(
      {
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn: 3600, // 1 hour in seconds
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
