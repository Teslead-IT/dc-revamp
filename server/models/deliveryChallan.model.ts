import { DataTypes, Model, Optional, Sequelize } from "sequelize"
import type User from "./user.model"

export interface DeliveryChallanAttributes {
  id: string
  dcNumber: string
  customerName: string
  itemNames: string[]
  totalDispatchQty: number
  totalReceivedQty: number
  status: "draft" | "open" | "partial" | "closed" | "cancelled" | "deleted"
  createdBy: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

interface DeliveryChallanCreationAttributes extends Optional<DeliveryChallanAttributes, "id" | "createdAt" | "updatedAt" | "deletedAt"> {}

export class DeliveryChallan extends Model<DeliveryChallanAttributes, DeliveryChallanCreationAttributes> implements DeliveryChallanAttributes {
  public id!: string
  public dcNumber!: string
  public customerName!: string
  public itemNames!: string[]
  public totalDispatchQty!: number
  public totalReceivedQty!: number
  public status!: "draft" | "open" | "partial" | "closed" | "cancelled" | "deleted"
  public createdBy!: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  public readonly deletedAt?: Date
}

/**
 * Initialize DeliveryChallan model with sequelize instance
 * This is called lazily to avoid module loading issues
 */
export function initializeDeliveryChallanModel(sequelize: Sequelize, User: typeof import("./user.model").User): typeof DeliveryChallan {
  DeliveryChallan.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      dcNumber: {
        type: DataTypes.STRING(300),
        allowNull: false,
        unique: true,
      },
      customerName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      itemNames: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      totalDispatchQty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      totalReceivedQty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      status: {
        type: DataTypes.ENUM("draft", "open", "partial", "closed", "cancelled", "deleted"),
        allowNull: false,
        defaultValue: "draft",
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: User,
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "DeliveryChallan",
      tableName: "delivery_challans",
      timestamps: true,
      paranoid: true, // Enables soft deletes
      indexes: [
        {
          unique: true,
          fields: ["dcNumber"],
        },
        {
          fields: ["createdBy"],
        },
        {
          fields: ["status"],
        },
      ],
      comment: "Table for storing delivery challan details",
    }
  )

  return DeliveryChallan
}

export default DeliveryChallan
