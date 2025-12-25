import { type NextRequest, NextResponse } from "next/server"
import { verifyPassword } from "@/server/auth"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { userId, password } = await request.json()

    if (!userId || !password) {
      return NextResponse.json({ success: false, message: "User ID and password are required" }, { status: 400 })
    }

    const result = await verifyPassword(userId, password)

    if (result.success && result.accessToken && result.refreshToken && result.user) {
      const cookieStore = await cookies()

      // Set access token cookie
      cookieStore.set("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        // maxAge: 60 * 60, // 1 hour
        maxAge: 60 , // 7 days
      })

      // Set refresh token cookie
      cookieStore.set("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      // Set user data cookie
      cookieStore.set("user_data", JSON.stringify(result.user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      })

      return NextResponse.json({
        success: true,
        message: result.message,
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          expiresIn: 3600, // 1 hour in seconds
        },
      })
    }

    return NextResponse.json({ success: false, message: result.message }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
