import prisma from "../lib/prisma";

export interface CreateTransactionDto {
  trxId: string;
  provider: string;
  amount: number;
  senderNumber: string;
  balance: number;
  transactionDate: string;
  transactionTime: string;
  rawSms: string;
}

export interface TransactionResponse {
  id: number;
  trxId: string;
  provider: string;
  amount: number;
  senderNumber: string;
  balance: number;
  transactionDate: string;
  transactionTime: string;
  rawSms: string;
  createdAt: Date;
}

class TransactionService {
  /**
   * Create a new transaction
   * Returns null if transaction already exists (duplicate trxId)
   */
  async createTransaction(
    data: CreateTransactionDto
  ): Promise<TransactionResponse | null> {
    try {
      // Use upsert to handle duplicate gracefully
      // If trxId exists, return null to indicate duplicate
      const existing = await prisma.transaction.findUnique({
        where: { trxId: data.trxId },
      });

      if (existing) {
        return null; // Duplicate transaction
      }

      const transaction = await prisma.transaction.create({
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
    } catch (error: any) {
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
  async getAllTransactions(): Promise<TransactionResponse[]> {
    const transactions = await prisma.transaction.findMany({
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
  async getTransactionByTrxId(
    trxId: string
  ): Promise<TransactionResponse | null> {
    const transaction = await prisma.transaction.findUnique({
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

export default new TransactionService();
