import { DataTypes, Model, Optional, Sequelize } from "sequelize"

export interface UserAttributes {
  id: number
  userId: string
  email: string
  name: string
  password: string
  role: "super_admin" | "admin" | "user"
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

interface UserCreationAttributes extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt" | "deletedAt"> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number
  public userId!: string
  public email!: string
  public name!: string
  public password!: string
  public role!: "super_admin" | "admin" | "user"
  public isActive!: boolean

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  public readonly deletedAt?: Date
}

/**
 * Initialize User model with sequelize instance
 * This is called lazily to avoid module loading issues
 */
export function initializeUserModel(sequelize: Sequelize): typeof User {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
   
      },
      userId: {
        type: DataTypes.STRING(300),
        allowNull: false,        
        unique: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("super_admin", "admin", "user"),
        allowNull: false,
        defaultValue: "user",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
      paranoid: true, // Enables soft deletes
      indexes: [
        {
          unique: true,
          fields: ["userId"],
        },
        {
          unique: true,
          fields: ["email"],
        },
      ],
      comment: "Table for storing user details",
    }
  )

  return User
}

export default User
