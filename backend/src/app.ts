import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import morgan from "morgan";
import config from "./config/config";

dotenv.config();

const app: Application = express();

app.use(
  cors({
    origin: config.APP_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Hello World from the backend");
});

app.get("/api/test", (req, res) => {
  res.json({
    status: "ok",
    message: "API is working",
  });
});

// Transaction routes
import transactionRoutes from "./modules/transaction.route";
app.use("/api/transactions", transactionRoutes);

export default app;
