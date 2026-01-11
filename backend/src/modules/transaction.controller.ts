import { Request, Response } from "express";
import transactionService, {
  CreateTransactionDto,
} from "./transaction.service";

class TransactionController {
  /**
   * POST /api/transactions
   * Create a new transaction
   */
  async createTransaction(req: Request, res: Response) {
    try {
      const data: CreateTransactionDto = req.body;

      // Validate required fields
      if (
        !data.trxId ||
        !data.provider ||
        data.amount === undefined ||
        !data.senderNumber ||
        data.balance === undefined ||
        !data.transactionDate ||
        !data.transactionTime ||
        !data.rawSms
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      const transaction = await transactionService.createTransaction(data);

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
    } catch (error: any) {
      console.error("Error creating transaction:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * GET /api/transactions
   * Get all transactions
   */
  async getAllTransactions(req: Request, res: Response) {
    try {
      const transactions = await transactionService.getAllTransactions();

      return res.status(200).json({
        success: true,
        message: "Transactions retrieved successfully",
        data: transactions,
        count: transactions.length,
      });
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * GET /api/transactions/:trxId
   * Get transaction by trxId
   */
  async getTransactionByTrxId(req: Request, res: Response) {
    try {
      const { trxId } = req.params;
      const trxIdString = Array.isArray(trxId) ? trxId[0] : trxId;

      if (!trxIdString) {
        return res.status(400).json({
          success: false,
          message: "Transaction ID is required",
        });
      }

      const transaction = await transactionService.getTransactionByTrxId(
        trxIdString
      );

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
    } catch (error: any) {
      console.error("Error fetching transaction:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
}

export default new TransactionController();
