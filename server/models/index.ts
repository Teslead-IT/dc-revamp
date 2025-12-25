import User, { initializeUserModel } from "./user.model"
import PartyDetails, { initializePartyDetailsModel } from "./partyDetails.model"
import DraftDC, { initializeDraftDCModel } from "./draftDC.model"
import type { Sequelize } from "sequelize"

type SyncOptions = {
  alter?: boolean
  force?: boolean
}

let isInitialized = false


export function initializeModels(sequelize: Sequelize) {
  if (isInitialized) {
    return
  }

  initializeUserModel(sequelize)
  initializePartyDetailsModel(sequelize)
  initializeDraftDCModel(sequelize)

  isInitialized = true
}


export function initializeAssociations() {
  // User associations
  // User.hasMany(DeliveryChallan, {
  //   foreignKey: "createdBy",
  //   as: "deliveryChalans",
  // })
}

export async function syncDatabase(options: SyncOptions = { alter: true }) {
  try {
    console.log("🔁 Starting database sync...")

    // 1. Core tables (no dependencies)
    await User.sync(options)
    console.log("✅ User table synced successfully.")

  

    await PartyDetails.sync(options)
    console.log("✅ PartyDetails table synced successfully.")

    await DraftDC.sync(options)
    console.log("✅ DraftDC table synced successfully.")

    console.log("🎉 Database sync completed successfully.")
  } catch (error) {
    console.error("❌ Error syncing database:", error)
  }
}

export const singleModelSync = async (model: any, options: SyncOptions = { alter: true }) => {
  try {
    console.log(`🔁 Syncing model: ${model.name}`)
    await model.sync(options)
    console.log(`✅ Model ${model.name} synced successfully.`)
  } catch (error) {
    console.error(`❌ Error syncing model ${model.name}:`, error)
  }
}

export { User, PartyDetails, DraftDC }

// Export types
// export type { UserAttributes } from "./user.model"
// export type { DeliveryChallanAttributes } from "./deliveryChallan.model"
// export type { PartyDetailsAttributes } from "./partyDetails.model"
// export type { DraftDCAttributes } from "./draftDC.model"
