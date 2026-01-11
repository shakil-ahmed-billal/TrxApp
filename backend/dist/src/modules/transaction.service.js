"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../lib/prisma"));
class TransactionService {
    /**
     * Create a new transaction
     * Returns null if transaction already exists (duplicate trxId)
     */
    async createTransaction(data) {
        try {
            // Use upsert to handle duplicate gracefully
            // If trxId exists, return null to indicate duplicate
            const existing = await prisma_1.default.transaction.findUnique({
                where: { trxId: data.trxId },
            });
            if (existing) {
                return null; // Duplicate transaction
            }
            const transaction = await prisma_1.default.transaction.create({
                data: {
                    trxId: data.trxId,
                    provider: data.provider,
                    amount: data.amount,
                    senderNumber: data.senderNumber,
                    balance: data.balance,
                    transactionDate: data.transactionDate,
                    transactionTime: data.transactionTime,
                    rawSms: data.rawSms,
                },
            });
            return {
                id: transaction.id,
                trxId: transaction.trxId,
                provider: transaction.provider,
                amount: Number(transaction.amount),
                senderNumber: transaction.senderNumber,
                balance: Number(transaction.balance),
                transactionDate: transaction.transactionDate,
                transactionTime: transaction.transactionTime,
                rawSms: transaction.rawSms,
                createdAt: transaction.createdAt,
            };
        }
        catch (error) {
            // Handle unique constraint violation
            if (error.code === "P2002") {
                return null; // Duplicate transaction
            }
            throw error;
        }
    }
    /**
     * Get all transactions, ordered by creation date (newest first)
     */
    async getAllTransactions() {
        const transactions = await prisma_1.default.transaction.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return transactions.map((t) => {
            return {
                id: t.id,
                trxId: t.trxId,
                provider: t.provider,
                amount: Number(t.amount),
                senderNumber: t.senderNumber,
                balance: Number(t.balance),
                transactionDate: t.transactionDate,
                transactionTime: t.transactionTime,
                rawSms: t.rawSms,
                createdAt: t.createdAt,
            };
        });
    }
    /**
     * Get transaction by trxId
     */
    async getTransactionByTrxId(trxId) {
        const transaction = await prisma_1.default.transaction.findUnique({
            where: { trxId },
        });
        if (!transaction) {
            return null;
        }
        return {
            id: transaction.id,
            trxId: transaction.trxId,
            provider: transaction.provider,
            amount: Number(transaction.amount),
            senderNumber: transaction.senderNumber,
            balance: Number(transaction.balance),
            transactionDate: transaction.transactionDate,
            transactionTime: transaction.transactionTime,
            rawSms: transaction.rawSms,
            createdAt: transaction.createdAt,
        };
    }
}
exports.default = new TransactionService();
//# sourceMappingURL=transaction.service.js.map