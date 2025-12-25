import { DataTypes, Model, Optional, Sequelize } from "sequelize"
import PartyDetails from "./partyDetails.model"

export interface DraftDCAttributes {
    id: number
    draftId: number
    partyId: number
    vehicleNo: string
    process: string
    totalDispatchedQuantity: number
    totalRate: number
    status: "Draft" | "Open" |"Partial" | "Closed" | "Cancelled" | "Deleted"
    showWeight: boolean
    showSquareFeet: boolean
    notes: string
    createdBy: string

    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}

interface DraftDCCreationAttributes extends Optional<DraftDCAttributes, "id" | "createdAt" | "updatedAt" | "deletedAt"> { }

export class DraftDC extends Model<DraftDCAttributes, DraftDCCreationAttributes> implements DraftDCAttributes {
    public id!: number
    public draftId!: number
    public partyId!: number
    public vehicleNo!: string
    public process!: string
    public totalDispatchedQuantity!: number
    public totalRate!: number
    public status!: "Draft" | "Open" |"Partial" | "Closed" | "Cancelled" | "Deleted"
    public showWeight!: boolean
    public showSquareFeet!: boolean
    public notes!: string
    public createdBy!: string


    public readonly createdAt!: Date
    public readonly updatedAt!: Date
    public readonly deletedAt?: Date
}


export function initializeDraftDCModel(sequelize: Sequelize): typeof DraftDC {
    DraftDC.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            draftId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
            },
            partyId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: PartyDetails,
                    key: "id",
                },
            },
            vehicleNo: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            process: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            totalDispatchedQuantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            totalRate: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM("Draft", "Open", "Partial", "Closed", "Cancelled", "Deleted"),
                defaultValue: "Draft",
                allowNull: false,
            },
            showWeight: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            showSquareFeet: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            notes: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            createdBy: {
                type: DataTypes.UUID,
                allowNull: false
                // references: {
                //   model: User,
                //   key: "id",
                // },
            },


        },
        {
            sequelize,
            modelName: "DraftDC",
            tableName: "draft_dc",
            timestamps: true,
            paranoid: true, // Enables soft deletes
            indexes: [
                {
                    fields: ["partyId"],
                }
            ],
            comment: "Table for storing draft DC details",
        }
    )

    return DraftDC
}

export default DraftDC
