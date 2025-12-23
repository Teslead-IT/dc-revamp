import DeliveryChallan from "../models/deliveryChallan.model"
import User from "../models/user.model"
import type { DeliveryChallanCreateInput, DeliveryChallanUpdateInput, DeliveryChallanQuery } from "../validations"

/**
 * DeliveryChallan Service - Business logic for DC operations
 */
export const deliveryChallanService = {
  /**
   * Get all delivery challans with optional filtering
   */
  async getAll(query: DeliveryChallanQuery) {
    const { status, page, limit } = query
    const offset = (page - 1) * limit

    const where: any = {}
    if (status) where.status = status

    const { rows, count } = await DeliveryChallan.findAndCountAll({
      where,
      include: [{ association: "creator", attributes: ["id", "name", "userId"], model: User }],
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    })

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
      },
    }
  },

  /**
   * Get single delivery challan by ID
   */
  async getById(id: string) {
    const dc = await DeliveryChallan.findByPk(id, {
      include: [{ association: "creator", attributes: ["id", "name", "userId"], model: User }],
    })

    if (!dc) {
      throw new Error("Delivery Challan not found")
    }

    return dc
  },

  /**
   * Create new delivery challan
   */
  async create(input: DeliveryChallanCreateInput, createdBy: string) {
    // Check if DC number already exists
    const existing = await DeliveryChallan.findOne({
      where: { dcNumber: input.dcNumber },
    })

    if (existing) {
      throw new Error("Delivery Challan with this number already exists")
    }

    const dc = await DeliveryChallan.create({
      ...input,
      createdBy,
    })

    return dc
  },

  /**
   * Update delivery challan
   */
  async update(id: string, input: DeliveryChallanUpdateInput) {
    const dc = await DeliveryChallan.findByPk(id)
    if (!dc) {
      throw new Error("Delivery Challan not found")
    }

    await dc.update(input)
    return dc
  },

  /**
   * Delete delivery challan
   */
  async delete(id: string) {
    const dc = await DeliveryChallan.findByPk(id)
    if (!dc) {
      throw new Error("Delivery Challan not found")
    }

    await dc.destroy()
    return { message: "Delivery Challan deleted successfully" }
  },

  /**
   * Change DC status
   */
  async updateStatus(id: string, status: string) {
    const dc = await DeliveryChallan.findByPk(id)
    if (!dc) {
      throw new Error("Delivery Challan not found")
    }

    await dc.update({ status })
    return dc
  },
}
