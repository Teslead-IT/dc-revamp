/**
 * Load environment variables from .env and .env.local
 * This is needed for Node.js scripts that run outside of Next.js context
 */

import fs from "fs"
import path from "path"

function loadEnv() {
  const envFiles = [".env", ".env.local"]
  const projectRoot = path.resolve(process.cwd())

  for (const file of envFiles) {
    const envPath = path.join(projectRoot, file)

    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf-8")

      envContent.split("\n").forEach((line) => {
        // Skip comments and empty lines
        if (!line || line.startsWith("#")) {
          return
        }

        const [key, ...rest] = line.split("=")
        const cleanKey = key.trim()
        const value = rest.join("=").trim()

        // Remove quotes if present
        const cleanValue = value.replace(/^["']|["']$/g, "")

        // Only set if not already set
        if (!process.env[cleanKey]) {
          process.env[cleanKey] = cleanValue
        }
      })
    }
  }
}

loadEnv()
