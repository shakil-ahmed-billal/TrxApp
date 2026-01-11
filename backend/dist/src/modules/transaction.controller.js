"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_service_1 = __importDefault(require("./transaction.service"));
class TransactionController {
    /**
     * POST /api/transactions
     * Create a new transaction
     */
    async createTransaction(req, res) {
        try {
            const data = req.body;
            // Validate required fields
            if (!data.trxId ||
                !data.provider ||
                data.amount === undefined ||
                !data.senderNumber ||
                data.balance === undefined ||
                !data.transactionDate ||
                !data.transactionTime ||
                !data.rawSms) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
                });
            }
            const transaction = await transaction_service_1.default.createTransaction(data);
            if (transaction === null) {
                // Duplicate transaction
                return res.status(200).json({
                    success: true,
                    message: "Transaction already exists",
                    duplicate: true,
                });
            }
            return res.status(201).json({
                success: true,
                message: "Transaction created successfully",
                data: transaction,
            });
        }
        catch (error) {
            console.error("Error creating transaction:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            });
        }
    }
    /**
     * GET /api/transactions
     * Get all transactions
     */
    async getAllTransactions(req, res) {
        try {
            const transactions = await transaction_service_1.default.getAllTransactions();
            return res.status(200).json({
                success: true,
                message: "Transactions retrieved successfully",
                data: transactions,
                count: transactions.length,
            });
        }
        catch (error) {
            console.error("Error fetching transactions:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            });
        }
    }
    /**
     * GET /api/transactions/:trxId
     * Get transaction by trxId
     */
    async getTransactionByTrxId(req, res) {
        try {
            const { trxId } = req.params;
            const trxIdString = Array.isArray(trxId) ? trxId[0] : trxId;
            if (!trxIdString) {
                return res.status(400).json({
                    success: false,
                    message: "Transaction ID is required",
                });
            }
            const transaction = await transaction_service_1.default.getTransactionByTrxId(trxIdString);
            if (!transaction) {
                return res.status(404).json({
                    success: false,
                    message: "Transaction not found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Transaction retrieved successfully",
                data: transaction,
            });
        }
        catch (error) {
            console.error("Error fetching transaction:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            });
        }
    }
}
exports.default = new TransactionController();
//# sourceMappingURL=transaction.controller.js.map