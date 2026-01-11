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
declare class TransactionService {
    /**
     * Create a new transaction
     * Returns null if transaction already exists (duplicate trxId)
     */
    createTransaction(data: CreateTransactionDto): Promise<TransactionResponse | null>;
    /**
     * Get all transactions, ordered by creation date (newest first)
     */
    getAllTransactions(): Promise<TransactionResponse[]>;
    /**
     * Get transaction by trxId
     */
    getTransactionByTrxId(trxId: string): Promise<TransactionResponse | null>;
}
declare const _default: TransactionService;
export default _default;
//# sourceMappingURL=transaction.service.d.ts.map