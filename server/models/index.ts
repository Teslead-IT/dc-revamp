import User, { initializeUserModel } from "./user.model"
import DeliveryChallan, { initializeDeliveryChallanModel } from "./deliveryChallan.model"
import type { Sequelize } from "sequelize"

type SyncOptions = {
  alter?: boolean
  force?: boolean
}

let isInitialized = false

/**
 * Initialize all models with sequelize instance
 * This must be called once before using any models
 */
export function initializeModels(sequelize: Sequelize) {
  if (isInitialized) {
    return
  }

  initializeUserModel(sequelize)
  initializeDeliveryChallanModel(sequelize, User)

  isInitialized = true
}

/**
 * Initialize model associations
 */
export function initializeAssociations() {
  // User associations
  User.hasMany(DeliveryChallan, {
    foreignKey: "createdBy",
    as: "deliveryChalans",
  })

  DeliveryChallan.belongsTo(User, {
    foreignKey: "createdBy",
    as: "creator",
  })
}

/**
 * Syncs the Sequelize models in order of dependencies
 */
export async function syncDatabase(options: SyncOptions = { alter: true }) {
  try {
    console.log("🔁 Starting database sync...")

    // 1. Core tables (no dependencies)
    await User.sync(options)
    console.log("✅ User table synced successfully.")

    // 2. App tables (with foreign keys)
    await DeliveryChallan.sync(options)
    console.log("✅ DeliveryChallan table synced successfully.")

    console.log("🎉 Database sync completed successfully.")
  } catch (error) {
    console.error("❌ Error syncing database:", error)
  }
}

/**
 * Sync a single model
 */
export const singleModelSync = async (model: any, options: SyncOptions = { alter: true }) => {
  try {
    console.log(`🔁 Syncing model: ${model.name}`)
    await model.sync(options)
    console.log(`✅ Model ${model.name} synced successfully.`)
  } catch (error) {
    console.error(`❌ Error syncing model ${model.name}:`, error)
  }
}

// Export models
export { User, DeliveryChallan }

// Export types
export type { UserAttributes } from "./user.model"
export type { DeliveryChallanAttributes } from "./deliveryChallan.model"
