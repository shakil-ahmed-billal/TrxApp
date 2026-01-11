"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const config_1 = __importDefault(require("../config/config"));
/**
 * Simple token-based authentication middleware
 * For internal use, we'll use a simple API token from environment variables
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
    // Get token from environment variable
    const expectedToken = process.env.API_TOKEN || config_1.default.API_TOKEN;
    if (!expectedToken) {
        console.warn("API_TOKEN not set in environment variables");
        return res.status(500).json({
            success: false,
            message: "Server configuration error",
        });
    }
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authentication token required",
        });
    }
    if (token !== expectedToken) {
        return res.status(403).json({
            success: false,
            message: "Invalid authentication token",
        });
    }
    next();
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=auth.middleware.js.map