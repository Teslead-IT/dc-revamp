import { type NextRequest, NextResponse } from "next/server"
import { verifyUserId } from "@/server/auth"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    const result = await verifyUserId(userId)

    return NextResponse.json({
      success: result.exists,
      message: result.message,
      data: { exists: result.exists },
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
