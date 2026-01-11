import dotenv from "dotenv";
import path from "path";



dotenv.config({ path: path.join(process.cwd(), ".env") });
const config = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || "development",
    DATABASE_URL: process.env.DATABASE_URL || "",
    JWT_SECRET: process.env.JWT_SECRET || "",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "",
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    APP_URL: process.env.APP_URL || "http://localhost:3000",
    API_TOKEN: process.env.API_TOKEN || "",
};
export default config;
