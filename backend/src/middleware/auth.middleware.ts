import { Request, Response, NextFunction } from "express";
import config from "../config/config";

/**
 * Simple token-based authentication middleware
 * For internal use, we'll use a simple API token from environment variables
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  // Get token from environment variable
  const expectedToken = process.env.API_TOKEN || config.API_TOKEN;

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

