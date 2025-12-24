import type { Sequelize as SequelizeType } from "sequelize"

// Prevent Sequelize from being bundled into Next.js
let sequelize: SequelizeType | null = null
let isInitializing = false

/**
 * Lazy initialize Sequelize with require
 * This prevents the pg driver from being loaded during Next.js build
 */
async function loadSequelize(): Promise<SequelizeType> {
  if (sequelize) {
    return sequelize
  }

  if (isInitializing) {
    // Wait for initialization to complete
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (sequelize) {
          clearInterval(checkInterval)
          resolve(sequelize!)
        }
      }, 50)
    })
  }

  isInitializing = true

  try {
    // First, try to load pg explicitly to verify it's available
    let pg
    try {
      pg = require('pg')
      console.log('✅ pg package loaded successfully')
    } catch (pgError: any) {
      console.error('❌ Failed to load pg package:', pgError.message)
      throw new Error('Please install pg package manually: npm install pg')
    }

    // Use require to dynamically load Sequelize at runtime
    // This ensures pg is only loaded when actually connecting to database
    const Sequelize = require("sequelize").Sequelize
    const dialect = "postgres"
    const env = process.env.NODE_ENV || "development"

    if (process.env.DATABASE_URL) {
      // Production: Use connection string
      sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: dialect as any,
        dialectModule: pg,  // Explicitly pass the pg module
        logging: env === "development" ? console.log : false,
        pool: {
          max: 10,
          min: 2,
          idle: 30000,
          acquire: 30000,
        },
        ssl: env === "production",
      })
    } else {
      // Development: Use individual environment variables
      const dbHost = process.env.DB_HOST || "localhost"
      const dbPort = parseInt(process.env.DB_PORT || "5432", 10)
      const dbUser = process.env.DB_USER || "postgres"
      const dbPassword = process.env.DB_PASSWORD || ""
      const dbName = process.env.DB_NAME || "teslead"

      if (env === "development") {
        console.log("📡 Database Configuration:")
        console.log(`   Host: ${dbHost}`)
        console.log(`   Port: ${dbPort}`)
        console.log(`   User: ${dbUser}`)
        console.log(`   Database: ${dbName}`)
        console.log(`   Password: ${dbPassword ? "******" : "(empty)"}`)
      }

      sequelize = new Sequelize({
        dialect: dialect as any,
        dialectModule: pg,  // Explicitly pass the pg module
        host: dbHost,
        port: dbPort,
        username: dbUser,
        password: dbPassword,
        database: dbName,
        logging: env === "development" ? console.log : false,
        pool: {
          max: 10,
          min: 2,
          idle: 30000,
          acquire: 30000,
        },
      })
    }

    isInitializing = false
    return sequelize!
  } catch (error: any) {
    isInitializing = false
    console.error("❌ Database connection error:", error.message)
    throw error
  }
}

/**
 * Get or initialize Sequelize instance
 */
export async function getSequelize(): Promise<SequelizeType> {
  if (!sequelize) {
    await loadSequelize()
  }
  return sequelize!
}

/**
 * Initialize Sequelize with lazy loading
 */
export async function initializeSequelize(): Promise<SequelizeType> {
  return getSequelize()
}
