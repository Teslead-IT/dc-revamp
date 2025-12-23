import { NextRequest, NextResponse } from "next/server"
import { validateInput, successResponse, errorResponse } from "@/server"
import { deliveryChallanService } from "@/server/services"
import { deliveryChallanQuerySchema } from "@/server/validations"

/**
 * GET /api/delivery-challans
 * Get all delivery challans with pagination and filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = {
      status: searchParams.get("status") || undefined,
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "10", 10),
    }

    // Validate query parameters
    const validation = validateInput(deliveryChallanQuerySchema, query)
    if (!validation.valid) {
      return NextResponse.json(errorResponse("Invalid query parameters", validation.errors), { status: 400 })
    }

    const result = await deliveryChallanService.getAll(validation.data as any)
    return NextResponse.json(successResponse(result, "Delivery challans retrieved successfully"))
  } catch (error: any) {
    console.error("Error fetching delivery challans:", error)
    return NextResponse.json(errorResponse(error.message || "Failed to fetch delivery challans"), { status: 500 })
  }
}
