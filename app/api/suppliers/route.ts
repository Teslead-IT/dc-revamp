import { NextRequest, NextResponse } from "next/server"
import { initializeDatabase } from "@/server/database"
import { authMiddleware, unauthorizedResponse } from "@/server/middleware"
import { PartyDetails } from "@/server/models"
import { errorResponse } from "@/server/utils/api-helpers"

export async function GET(request: NextRequest) {
    try {
        await initializeDatabase()

        // Check authentication
        const auth = await authMiddleware(request)

        if (!auth.authenticated) {
            return unauthorizedResponse(auth.error || "Unauthorized")
        }

        const suppliers = await PartyDetails.findAll()

        return NextResponse.json(
            {
                success: true,
                message: suppliers.length > 0 ? "Suppliers found" : "No suppliers found",
                data: {
                    suppliers: suppliers,
                },
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error("Fetch suppliers error:", error)
        return NextResponse.json(errorResponse("Failed to fetch suppliers", { error: error.message }), { status: 500 })
    }
}
