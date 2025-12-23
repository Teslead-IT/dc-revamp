import { getDatabase } from "../database"
import User from "../models/user.model"
import type { UserCreateInput, UserLoginInput, UserUpdateInput } from "../validations"

/**
 * User Service - Business logic for user operations
 */
export const userService = {
  /**
   * Get all users
   */
  async getAll() {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    })

    return users
  },

  /**
   * Get user by ID
   */
  async getById(id: string) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    })

    if (!user) {
      throw new Error("User not found")
    }

    return user
  },

  /**
   * Get user by userId
   */
  async getByUserId(userId: string) {
    const user = await User.findOne({
      where: { userId },
      attributes: { exclude: ["password"] },
    })

    if (!user) {
      throw new Error("User not found")
    }

    return user
  },

  /**
   * Create new user
   */
  async create(input: UserCreateInput) {
    // Check if user already exists
    const existing = await User.findOne({
      where: { userId: input.userId },
    })

    if (existing) {
      throw new Error("User with this ID already exists")
    }

    // In production, hash the password using bcrypt
    const user = await User.create(input)

    return {
      id: user.getDataValue("id"),
      userId: user.getDataValue("userId"),
      email: user.getDataValue("email"),
      name: user.getDataValue("name"),
      role: user.getDataValue("role"),
      isActive: user.getDataValue("isActive"),
    }
  },

  /**
   * Update user
   */
  async update(id: string, input: UserUpdateInput) {
    const user = await User.findByPk(id)
    if (!user) {
      throw new Error("User not found")
    }

    await user.update(input)

    return {
      id: user.getDataValue("id"),
      userId: user.getDataValue("userId"),
      email: user.getDataValue("email"),
      name: user.getDataValue("name"),
      role: user.getDataValue("role"),
      isActive: user.getDataValue("isActive"),
    }
  },

  /**
   * Delete user
   */
  async delete(id: string) {
    const user = await User.findByPk(id)
    if (!user) {
      throw new Error("User not found")
    }

    await user.destroy()
    return { message: "User deleted successfully" }
  },

  /**
   * Authenticate user
   */
  async authenticate(input: UserLoginInput) {
    const user = await User.findOne({
      where: {
        userId: input.userId
      },
    })

    if (!user) {
      throw new Error("Invalid credentials")
    }

    // In production, use bcrypt.compare(input.password, user.password)
    if (user.getDataValue("password") !== input.password) {
      throw new Error("Invalid credentials")
    }

    if (!user.getDataValue("isActive")) {
      throw new Error("User account is inactive")
    }

    return {
      id: user.getDataValue("id"),
      userId: user.getDataValue("userId"),
      email: user.getDataValue("email"),
      name: user.getDataValue("name"),
      role: user.getDataValue("role"),
    }
  },
}
