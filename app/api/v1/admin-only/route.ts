import { NextRequest, NextResponse } from "next/server"
import { authMiddleware, checkRole, forbiddenResponse, unauthorizedResponse } from "@/server/middleware/auth.middleware"

/**
 * Example: Admin-only endpoint - requires admin or super_admin role
 * GET /api/v1/admin-only
 */
export async function GET(request: NextRequest) {
  const auth = await authMiddleware(request)

  if (!auth.authenticated) {
    return unauthorizedResponse(auth.error || "Unauthorized")
  }

  // Check if user has admin role
  const hasPermission = checkRole(auth.payload!.role, ["admin", "super_admin"])

  if (!hasPermission) {
    return forbiddenResponse("Only admins can access this endpoint")
  }

  return NextResponse.json({
    message: "This endpoint is admin-only",
    user: auth.payload,
  })
}
