#!/usr/bin/env node

/**
 * Database Health Check
 * 
 * Usage: npm run db:check
 */

// Load environment variables first
import "../server/utils/load-env"

import { initializeDatabase } from "../server/database"
import User from "../server/models/user.model"
import DeliveryChallan from "../server/models/deliveryChallan.model"

async function main() {
  try {
    console.log("\n🔍 Database Health Check")
    console.log("=" + "=".repeat(49))

    // Connect to database
    console.log("\n📡 Connecting to database...")
    const db = await initializeDatabase()
    console.log("✅ Connected to database")

    // Check User table
    console.log("\n👤 Checking User table...")
    const userCount = await User.count()
    console.log(`✅ User table exists (${userCount} records)`)

    // Check DeliveryChallan table
    console.log("\n📦 Checking DeliveryChallan table...")
    const dcCount = await DeliveryChallan.count()
    console.log(`✅ DeliveryChallan table exists (${dcCount} records)`)

    // Check associations
    console.log("\n🔗 Checking associations...")
    const hasAssociation = User.associations.deliveryChalans
    if (hasAssociation) {
      console.log("✅ User → DeliveryChallan association OK")
    } else {
      console.log("⚠️  Associations not initialized. Run: npm run db:sync")
    }

    console.log("\n✨ Database health check passed!")
    console.log("\n📊 Summary:")
    console.log(`   Users: ${userCount}`)
    console.log(`   Delivery Challans: ${dcCount}`)

    process.exit(0)
  } catch (error: any) {
    console.error("\n❌ Error:", error.message)
    console.log("\n💡 Troubleshooting:")
    console.log("   1. Make sure PostgreSQL is running")
    console.log("   2. Check .env.local has correct DB_* variables")
    console.log("   3. Run: npm run db:sync")
    process.exit(1)
  }
}

main()
