import { NextRequest, NextResponse } from "next/server"
import { validateInput, successResponse, errorResponse } from "@/server"
import { deliveryChallanService } from "@/server/services"
import { deliveryChallanCreateSchema } from "@/server/validations"

/**
 * POST /api/v1/delivery-challans
 * Create a new delivery challan
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validation = validateInput(deliveryChallanCreateSchema, body)
    if (!validation.valid) {
      return NextResponse.json(errorResponse("Validation failed", validation.errors), { status: 400 })
    }

    // Get user ID from session (you'll need to implement session handling)
    const userId = "user-id-from-session" // TODO: Get from session

    const result = await deliveryChallanService.create(validation.data as any, userId)
    return NextResponse.json(successResponse(result, "Delivery challan created successfully"), { status: 201 })
  } catch (error: any) {
    console.error("Error creating delivery challan:", error)
    return NextResponse.json(errorResponse(error.message || "Failed to create delivery challan"), { status: 500 })
  }
}
