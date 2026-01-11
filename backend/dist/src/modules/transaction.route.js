"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const transaction_controller_1 = __importDefault(require("./transaction.controller"));
const router = (0, express_1.Router)();
// All transaction routes require authentication
router.use(auth_middleware_1.authenticateToken);
router.post("/", transaction_controller_1.default.createTransaction.bind(transaction_controller_1.default));
router.get("/", transaction_controller_1.default.getAllTransactions.bind(transaction_controller_1.default));
router.get("/:trxId", transaction_controller_1.default.getTransactionByTrxId.bind(transaction_controller_1.default));
exports.default = router;
//# sourceMappingURL=transaction.route.js.map