"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = __importDefault(require("./config/config"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: config_1.default.APP_URL,
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
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
const transaction_route_1 = __importDefault(require("./modules/transaction.route"));
app.use("/api/transactions", transaction_route_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map