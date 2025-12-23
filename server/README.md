# Backend Service Configuration

This directory contains all backend services and database configuration for the Next.js API routes.

## Structure

- **database/**: Sequelize configuration and database initialization
- **models/**: Sequelize model definitions
- **validations/**: Zod schema validations
- **config/**: Environment and configuration files

## Usage

Import services from respective folders and use in API routes.

```typescript
import { db } from "@/server/database"
import { userValidation } from "@/server/validations"
```
