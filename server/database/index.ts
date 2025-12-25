import { getSequelize, initializeSequelize } from "./sequelize"
import { syncDatabase, initializeAssociations, initializeModels } from "../models"

export interface DBConnection {
  sequelize: any
}

let db: DBConnection | null = null

export async function initializeDatabase(): Promise<DBConnection> {
  if (db) {
    return db
  }

  try {
    const sequelize = await getSequelize()
    
    // Initialize models with sequelize instance
    initializeModels(sequelize)
    
    // Test connection
    await sequelize.authenticate()
    console.log("✅ Database connection established successfully")

    // Initialize associations
    initializeAssociations()
    console.log("✅ Model associations initialized")

    // Sync database (use alter: true for development, force: false for production)
    const env = process.env.NODE_ENV || "development"
    await syncDatabase({
      alter: env === "development",
      force: false,
    })

    db = {
      sequelize,
    }
    console.log("DB>>>>>>>>>>>>", db);

    return db
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error)
    throw error
  }
}

export async function getDatabase(): Promise<DBConnection> {
  if (db) {
    return db
  }
  return await initializeDatabase()
}

export { getSequelize, initializeSequelize }
