import { Request, Response } from "express";
declare class TransactionController {
    /**
     * POST /api/transactions
     * Create a new transaction
     */
    createTransaction(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * GET /api/transactions
     * Get all transactions
     */
    getAllTransactions(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * GET /api/transactions/:trxId
     * Get transaction by trxId
     */
    getTransactionByTrxId(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: TransactionController;
export default _default;
//# sourceMappingURL=transaction.controller.d.ts.map