"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../generated/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const config_1 = __importDefault(require("../config/config"));
const pool = new pg_1.Pool({
    connectionString: config_1.default.DATABASE_URL,
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const prismaClientSingleton = () => {
    return new client_1.PrismaClient({
        adapter: adapter,
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
};
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
exports.default = prisma;
if (process.env.NODE_ENV !== "production")
    globalThis.prismaGlobal = prisma;
//# sourceMappingURL=prisma.js.map