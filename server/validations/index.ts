import { z } from "zod"

// User Validation Schemas
export const userCreateSchema = z.object({
  userId: z.string().min(3, "User ID must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["super_admin", "admin", "user"]).optional().default("user"),
})

export const userUpdateSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  role: z.enum(["super_admin", "admin", "user"]).optional(),
  isActive: z.boolean().optional(),
})

export const userLoginSchema = z.object({
  userId: z.string().min(3, "User ID is required"),
  password: z.string().min(6, "Password is required"),
})

// DeliveryChallan Validation Schemas
export const deliveryChallanCreateSchema = z.object({
  dcNumber: z.string().min(1, "DC Number is required"),
  customerName: z.string().min(1, "Customer name is required"),
  itemNames: z.array(z.string()).optional().default([]),
  totalDispatchQty: z.number().min(0, "Quantity must be positive").default(0),
  totalReceivedQty: z.number().min(0, "Quantity must be positive").default(0),
  status: z.enum(["draft", "open", "partial", "closed", "cancelled", "deleted"]).default("draft"),
})

export const deliveryChallanUpdateSchema = z.object({
  customerName: z.string().min(1, "Customer name is required").optional(),
  itemNames: z.array(z.string()).optional(),
  totalDispatchQty: z.number().min(0, "Quantity must be positive").optional(),
  totalReceivedQty: z.number().min(0, "Quantity must be positive").optional(),
  status: z.enum(["draft", "open", "partial", "closed", "cancelled", "deleted"]).optional(),
})

export const deliveryChallanQuerySchema = z.object({
  status: z.enum(["draft", "open", "partial", "closed", "cancelled", "deleted"]).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
})

// Type exports
export type UserCreateInput = z.infer<typeof userCreateSchema>
export type UserUpdateInput = z.infer<typeof userUpdateSchema>
export type UserLoginInput = z.infer<typeof userLoginSchema>
export type DeliveryChallanCreateInput = z.infer<typeof deliveryChallanCreateSchema>
export type DeliveryChallanUpdateInput = z.infer<typeof deliveryChallanUpdateSchema>
export type DeliveryChallanQuery = z.infer<typeof deliveryChallanQuerySchema>
