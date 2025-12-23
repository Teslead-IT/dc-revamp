import { NextRequest, NextResponse } from "next/server"
import { authMiddleware, checkRole, forbiddenResponse, unauthorizedResponse } from "@/server/middleware/auth.middleware"

/**
 * Example: Protected endpoint - requires any authentication
 * GET /api/v1/protected
 */
export async function GET(request: NextRequest) {
  const auth = await authMiddleware(request)

  if (!auth.authenticated) {
    return unauthorizedResponse(auth.error || "Unauthorized")
  }

  return NextResponse.json({
    message: "This is a protected endpoint",
    user: auth.payload,
  })
}
