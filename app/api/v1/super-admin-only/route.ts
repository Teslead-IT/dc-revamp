import { NextRequest, NextResponse } from "next/server"
import { authMiddleware, checkRole, forbiddenResponse, unauthorizedResponse } from "@/server/middleware/auth.middleware"

/**
 * Example: Super admin-only endpoint
 * GET /api/v1/super-admin-only
 */
export async function GET(request: NextRequest) {
  const auth = await authMiddleware(request)

  if (!auth.authenticated) {
    return unauthorizedResponse(auth.error || "Unauthorized")
  }

  // Check if user is super_admin
  const hasPermission = checkRole(auth.payload!.role, ["super_admin"])

  if (!hasPermission) {
    return forbiddenResponse("Only super admins can access this endpoint")
  }

  return NextResponse.json({
    message: "This endpoint is super_admin-only",
    user: auth.payload,
  })
}
