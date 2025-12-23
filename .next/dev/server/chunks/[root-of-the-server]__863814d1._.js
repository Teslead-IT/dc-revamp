module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[project]/server/database/sequelize.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSequelize",
    ()=>getSequelize,
    "initializeSequelize",
    ()=>initializeSequelize
]);
// Prevent Sequelize from being bundled into Next.js
let sequelize = null;
let isInitializing = false;
/**
 * Lazy initialize Sequelize with require
 * This prevents the pg driver from being loaded during Next.js build
 */ async function loadSequelize() {
    if (sequelize) {
        return sequelize;
    }
    if (isInitializing) {
        // Wait for initialization to complete
        return new Promise((resolve)=>{
            const checkInterval = setInterval(()=>{
                if (sequelize) {
                    clearInterval(checkInterval);
                    resolve(sequelize);
                }
            }, 50);
        });
    }
    isInitializing = true;
    try {
        // Use require to dynamically load Sequelize at runtime
        // This ensures pg is only loaded when actually connecting to database
        const Sequelize = __turbopack_context__.r("[project]/node_modules/sequelize/lib/index.js [app-route] (ecmascript)").Sequelize;
        const dialect = "postgres";
        const env = ("TURBOPACK compile-time value", "development") || "development";
        if (process.env.DATABASE_URL) {
            // Production: Use connection string
            sequelize = new Sequelize(process.env.DATABASE_URL, {
                dialect: dialect,
                logging: ("TURBOPACK compile-time truthy", 1) ? console.log : "TURBOPACK unreachable",
                pool: {
                    max: 10,
                    min: 2,
                    idle: 30000,
                    acquire: 30000
                },
                ssl: env === "production"
            });
        } else {
            // Development: Use individual environment variables
            const dbHost = process.env.DB_HOST || "localhost";
            const dbPort = parseInt(process.env.DB_PORT || "5432", 10);
            const dbUser = process.env.DB_USER || "postgres";
            const dbPassword = process.env.DB_PASSWORD || "";
            const dbName = process.env.DB_NAME || "teslead";
            if ("TURBOPACK compile-time truthy", 1) {
                console.log("📡 Database Configuration:");
                console.log(`   Host: ${dbHost}`);
                console.log(`   Port: ${dbPort}`);
                console.log(`   User: ${dbUser}`);
                console.log(`   Database: ${dbName}`);
                console.log(`   Password: ${dbPassword ? "******" : "(empty)"}`);
            }
            sequelize = new Sequelize({
                dialect: dialect,
                host: dbHost,
                port: dbPort,
                username: dbUser,
                password: dbPassword,
                database: dbName,
                logging: ("TURBOPACK compile-time truthy", 1) ? console.log : "TURBOPACK unreachable",
                pool: {
                    max: 10,
                    min: 2,
                    idle: 30000,
                    acquire: 30000
                }
            });
        }
        isInitializing = false;
        return sequelize;
    } catch (error) {
        isInitializing = false;
        console.error("❌ Database connection error:", error.message);
        throw error;
    }
}
async function getSequelize() {
    if (!sequelize) {
        return await loadSequelize();
    }
    return sequelize;
}
async function initializeSequelize() {
    return getSequelize();
}
}),
"[project]/server/models/user.model.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "User",
    ()=>User,
    "default",
    ()=>__TURBOPACK__default__export__,
    "initializeUserModel",
    ()=>initializeUserModel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sequelize$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sequelize/lib/index.mjs [app-route] (ecmascript)");
;
class User extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sequelize$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Model"] {
    id;
    userId;
    email;
    name;
    password;
    role;
    isActive;
    createdAt;
    updatedAt;
    deletedAt;
}
function initializeUserModel(sequelize) {
    User.init({
        id: {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sequelize$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataTypes"].UUID,
            defaultValue: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sequelize$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataTypes"].UUIDV4,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        userId: {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sequelize$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataTypes"].STRING(300),
            allowNull: false,
            unique: true
        },
        email: {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sequelize$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataTypes"].STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        name: {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sequelize$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataTypes"].STRING(255),
            allowNull: false
        },
        password: {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sequelize$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataTypes"].STRING(255),
            allowNull: false
        },
        role: {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sequelize$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataTypes"].ENUM("super_admin", "admin", "user"),
            allowNull: false,
            defaultValue: "user"
        },
        isActive: {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sequelize$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataTypes"].BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: true,
        paranoid: true,
        indexes: [
            {
                unique: true,
                fields: [
                    "userId"
                ]
            },
            {
                unique: true,
                fields: [
                    "email"
                ]
            }
        ],
        comment: "Table for storing user details"
    });
    return User;
}
const __TURBOPACK__default__export__ = User;
}),
"[project]/server/models/deliveryChallan.model.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DeliveryChallan",
    ()=>DeliveryChallan,
    "default",
    ()=>__TURBOPACK__default__export__,
    "initializeDeliveryChallanModel",
    ()=>initializeDeliveryChallanModel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sequelize$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sequelize/lib/index.mjs [app-route] (ecmascript)");
;
class DeliveryChallan extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sequelize$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Model"] {
    id;
    dcNumber;
    customerName;
    itemNames;
    totalDispatchQty;
    totalReceivedQty;
    status;
    createdBy;
    createdAt;
    updatedAt;
    deletedAt;
}
function initializeDeliveryChallanModel(sequelize, User) {
    DeliveryChallan.init({
        id: {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sequelize$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataTypes"].UUID,
            defaultValue: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sequelize$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataTypes"].UUIDV4,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        dcNumber: {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sequelize$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataTypes"].STRING(300),
            allowNull: false,
            unique: true
        },
        customerName: {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sequelize$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataTypes"].STRING(255),
            allowNull: false
        },
        itemNames: {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sequelize$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataTypes"].JSON,
            allowNull: false,
            defaultValue: []
        },
        totalDispatchQty: {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sequelize$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataTypes"].INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        totalReceivedQty: {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sequelize$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataTypes"].INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        status: {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sequelize$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataTypes"].ENUM("draft", "open", "partial", "closed", "cancelled", "deleted"),
            allowNull: false,
            defaultValue: "draft"
        },
        createdBy: {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sequelize$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DataTypes"].UUID,
            allowNull: false,
            references: {
                model: User,
                key: "id"
            }
        }
    }, {
        sequelize,
        modelName: "DeliveryChallan",
        tableName: "delivery_challans",
        timestamps: true,
        paranoid: true,
        indexes: [
            {
                unique: true,
                fields: [
                    "dcNumber"
                ]
            },
            {
                fields: [
                    "createdBy"
                ]
            },
            {
                fields: [
                    "status"
                ]
            }
        ],
        comment: "Table for storing delivery challan details"
    });
    return DeliveryChallan;
}
const __TURBOPACK__default__export__ = DeliveryChallan;
}),
"[project]/server/models/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "initializeAssociations",
    ()=>initializeAssociations,
    "initializeModels",
    ()=>initializeModels,
    "singleModelSync",
    ()=>singleModelSync,
    "syncDatabase",
    ()=>syncDatabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$models$2f$user$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/models/user.model.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$models$2f$deliveryChallan$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/models/deliveryChallan.model.ts [app-route] (ecmascript)");
;
;
let isInitialized = false;
function initializeModels(sequelize) {
    if (isInitialized) {
        return;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$models$2f$user$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["initializeUserModel"])(sequelize);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$models$2f$deliveryChallan$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["initializeDeliveryChallanModel"])(sequelize, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$models$2f$user$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]);
    isInitialized = true;
}
function initializeAssociations() {
    // User associations
    __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$models$2f$user$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hasMany(__TURBOPACK__imported__module__$5b$project$5d2f$server$2f$models$2f$deliveryChallan$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"], {
        foreignKey: "createdBy",
        as: "deliveryChalans"
    });
    __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$models$2f$deliveryChallan$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].belongsTo(__TURBOPACK__imported__module__$5b$project$5d2f$server$2f$models$2f$user$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"], {
        foreignKey: "createdBy",
        as: "creator"
    });
}
async function syncDatabase(options = {
    alter: true
}) {
    try {
        console.log("🔁 Starting database sync...");
        // 1. Core tables (no dependencies)
        await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$models$2f$user$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sync(options);
        console.log("✅ User table synced successfully.");
        // 2. App tables (with foreign keys)
        await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$models$2f$deliveryChallan$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sync(options);
        console.log("✅ DeliveryChallan table synced successfully.");
        console.log("🎉 Database sync completed successfully.");
    } catch (error) {
        console.error("❌ Error syncing database:", error);
    }
}
const singleModelSync = async (model, options = {
    alter: true
})=>{
    try {
        console.log(`🔁 Syncing model: ${model.name}`);
        await model.sync(options);
        console.log(`✅ Model ${model.name} synced successfully.`);
    } catch (error) {
        console.error(`❌ Error syncing model ${model.name}:`, error);
    }
};
;
}),
"[project]/server/database/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDatabase",
    ()=>getDatabase,
    "initializeDatabase",
    ()=>initializeDatabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$database$2f$sequelize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/database/sequelize.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/server/models/index.ts [app-route] (ecmascript) <locals>");
;
;
let db = null;
async function initializeDatabase() {
    if (db) {
        return db;
    }
    try {
        const sequelize = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$database$2f$sequelize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSequelize"])();
        // Initialize models with sequelize instance
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["initializeModels"])(sequelize);
        // Test connection
        await sequelize.authenticate();
        console.log("✅ Database connection established successfully");
        // Initialize associations
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["initializeAssociations"])();
        console.log("✅ Model associations initialized");
        // Sync database (use alter: true for development, force: false for production)
        const env = ("TURBOPACK compile-time value", "development") || "development";
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["syncDatabase"])({
            alter: env === "development",
            force: false
        });
        db = {
            sequelize
        };
        return db;
    } catch (error) {
        console.error("❌ Unable to connect to the database:", error);
        throw error;
    }
}
async function getDatabase() {
    if (db) {
        return db;
    }
    return await initializeDatabase();
}
;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[project]/server/middleware/auth.middleware.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authMiddleware",
    ()=>authMiddleware,
    "checkRole",
    ()=>checkRole,
    "extractToken",
    ()=>extractToken,
    "forbiddenResponse",
    ()=>forbiddenResponse,
    "generateAccessToken",
    ()=>generateAccessToken,
    "generateRefreshToken",
    ()=>generateRefreshToken,
    "unauthorizedResponse",
    ()=>unauthorizedResponse,
    "verifyRefreshToken",
    ()=>verifyRefreshToken,
    "verifyToken",
    ()=>verifyToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
;
;
const verifyToken = (token)=>{
    try {
        const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, process.env.JWT_SECRET || "your_jwt_secret");
        return decoded;
    } catch (error) {
        return null;
    }
};
const generateAccessToken = (payload)=>{
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign(payload, process.env.JWT_SECRET || "your_jwt_secret", {
        expiresIn: "1h"
    });
};
const generateRefreshToken = (payload)=>{
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign(payload, process.env.JWT_REFRESH_SECRET || "your_refresh_secret", {
        expiresIn: "7d"
    });
};
const verifyRefreshToken = (token)=>{
    try {
        const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, process.env.JWT_REFRESH_SECRET || "your_refresh_secret");
        return decoded;
    } catch (error) {
        return null;
    }
};
const authMiddleware = async (request)=>{
    const token = extractToken(request);
    if (!token) {
        return {
            authenticated: false,
            payload: null,
            error: "No token provided"
        };
    }
    const payload = verifyToken(token);
    if (!payload) {
        return {
            authenticated: false,
            payload: null,
            error: "Invalid or expired token"
        };
    }
    return {
        authenticated: true,
        payload,
        error: null
    };
};
const extractToken = (request)=>{
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }
    return authHeader.substring(7);
};
const checkRole = (userRole, allowedRoles)=>{
    return allowedRoles.includes(userRole);
};
const unauthorizedResponse = (message = "Unauthorized")=>{
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: message
    }, {
        status: 401
    });
};
const forbiddenResponse = (message = "Forbidden")=>{
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: message
    }, {
        status: 403
    });
};
}),
"[project]/server/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Server-side JWT Authentication utilities
__turbopack_context__.s([
    "verifyPassword",
    ()=>verifyPassword,
    "verifyUserId",
    ()=>verifyUserId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$database$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/server/database/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$models$2f$user$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/models/user.model.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$middleware$2f$auth$2e$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/middleware/auth.middleware.ts [app-route] (ecmascript)");
;
;
;
async function verifyUserId(userId) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$database$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["initializeDatabase"])();
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$models$2f$user$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            where: {
                userId
            }
        });
        if (user) {
            return {
                exists: true,
                message: "User found"
            };
        }
        return {
            exists: false,
            message: "User ID not found"
        };
    } catch (error) {
        console.error("Error verifying user ID:", error);
        return {
            exists: false,
            message: "Database error"
        };
    }
}
async function verifyPassword(userId, password) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$database$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["initializeDatabase"])();
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$models$2f$user$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            where: {
                userId
            }
        });
        if (!user) {
            return {
                success: false,
                message: "Invalid credentials"
            };
        }
        // Simple password comparison (in production, use bcrypt)
        if (user.getDataValue("password") !== password) {
            return {
                success: false,
                message: "Invalid credentials"
            };
        }
        // Check if user is active
        if (!user.getDataValue("isActive")) {
            return {
                success: false,
                message: "User account is inactive"
            };
        }
        const userData = {
            id: user.getDataValue("id"),
            userId: user.getDataValue("userId"),
            name: user.getDataValue("name"),
            email: user.getDataValue("email"),
            role: user.getDataValue("role")
        };
        // Generate JWT tokens
        const accessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$middleware$2f$auth$2e$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateAccessToken"])({
            id: userData.id,
            userId: userData.userId,
            email: userData.email,
            name: userData.name,
            role: userData.role
        });
        const refreshToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$middleware$2f$auth$2e$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateRefreshToken"])({
            id: userData.id,
            userId: userData.userId,
            email: userData.email,
            name: userData.name,
            role: userData.role
        });
        return {
            success: true,
            message: "Login successful",
            user: userData,
            accessToken,
            refreshToken
        };
    } catch (error) {
        console.error("Auth error:", error);
        return {
            success: false,
            message: "Authentication error"
        };
    }
}
}),
"[project]/app/api/auth/verify-user/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/auth.ts [app-route] (ecmascript)");
;
;
async function POST(request) {
    try {
        const { userId } = await request.json();
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "User ID is required"
            }, {
                status: 400
            });
        }
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyUserId"])(userId);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: result.exists,
            message: result.message,
            data: {
                exists: result.exists
            }
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: "Server error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__863814d1._.js.map