#!/usr/bin/env node

/**
 * Database Sync Script
 * 
 * This script syncs your Sequelize models with the database.
 * 
 * Usage:
 *   npm run db:sync              - Sync with alter (for development)
 *   npm run db:sync:force        - Force recreate all tables (WARNING: deletes data)
 *   npm run db:sync:single User  - Sync only specific model
 */

// Load environment variables first
import "../server/utils/load-env"

import { initializeDatabase } from "../server/database"
import { syncDatabase, singleModelSync, initializeAssociations } from "../server/models"
import User from "../server/models/user.model"
import DeliveryChallan from "../server/models/deliveryChallan.model"

const args = process.argv.slice(2)
const command = args[0]
const modelName = args[1]

const models: Record<string, any> = {
  User,
  DeliveryChallan,
}

async function main() {
  try {
    console.log("🚀 Database Sync Script")
    console.log("=" + "=".repeat(49))

    // Initialize database connection
    console.log("\n📡 Connecting to database...")
    await initializeDatabase()
    console.log("✅ Connected to database")

    // Initialize associations before syncing
    console.log("\n🔗 Initializing associations...")
    initializeAssociations()
    console.log("✅ Associations initialized")

    // Handle different commands
    if (command === "force") {
      console.log("\n⚠️  WARNING: This will DROP all tables and recreate them!")
      console.log("All data will be lost!\n")

      const response = await getUserConfirmation("Are you sure? (yes/no): ")

      if (response.toLowerCase() !== "yes") {
        console.log("❌ Cancelled")
        process.exit(0)
      }

      console.log("\n🗑️  Dropping and recreating all tables...")
      await syncDatabase({ force: true, alter: false })
    } else if (command === "single" && modelName) {
      if (!models[modelName]) {
        console.error(`❌ Model "${modelName}" not found`)
        console.log(`Available models: ${Object.keys(models).join(", ")}`)
        process.exit(1)
      }

      console.log(`\n🔄 Syncing only ${modelName} model (with alter)...`)
      await singleModelSync(models[modelName], { alter: true })
      console.log(`✅ ${modelName} synced`)
    } else {
      // Default: sync all with alter
      console.log("\n🔄 Syncing all tables (with alter for development)...")
      await syncDatabase({ alter: true })
    }

    console.log("\n✨ Done!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Error:", error)
    process.exit(1)
  }
}

/**
 * Simple confirmation prompt
 */
function getUserConfirmation(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(prompt)
    process.stdin.once("data", (data) => {
      resolve(data.toString().trim())
    })
  })
}

// Run the script
main()
