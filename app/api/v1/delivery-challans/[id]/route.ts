import { NextRequest, NextResponse } from "next/server"
import { validateInput, successResponse, errorResponse } from "@/server"
import { deliveryChallanService } from "@/server/services"
import { deliveryChallanUpdateSchema } from "@/server/validations"

/**
 * GET /api/v1/delivery-challans/[id]
 * Get a single delivery challan by ID
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await deliveryChallanService.getById(params.id)
    return NextResponse.json(successResponse(result, "Delivery challan retrieved successfully"))
  } catch (error: any) {
    console.error("Error fetching delivery challan:", error)
    return NextResponse.json(errorResponse(error.message || "Delivery challan not found"), { status: 404 })
  }
}

/**
 * PUT /api/v1/delivery-challans/[id]
 * Update a delivery challan
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Validate input
    const validation = validateInput(deliveryChallanUpdateSchema, body)
    if (!validation.valid) {
      return NextResponse.json(errorResponse("Validation failed", validation.errors), { status: 400 })
    }

    const result = await deliveryChallanService.update(params.id, validation.data as any)
    return NextResponse.json(successResponse(result, "Delivery challan updated successfully"))
  } catch (error: any) {
    console.error("Error updating delivery challan:", error)
    return NextResponse.json(errorResponse(error.message || "Failed to update delivery challan"), { status: 500 })
  }
}

/**
 * DELETE /api/v1/delivery-challans/[id]
 * Delete a delivery challan
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await deliveryChallanService.delete(params.id)
    return NextResponse.json(successResponse(result, "Delivery challan deleted successfully"))
  } catch (error: any) {
    console.error("Error deleting delivery challan:", error)
    return NextResponse.json(errorResponse(error.message || "Failed to delete delivery challan"), { status: 500 })
  }
}
