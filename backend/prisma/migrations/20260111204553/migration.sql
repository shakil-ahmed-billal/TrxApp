-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "trx_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'bKash',
    "amount" DECIMAL(10,2) NOT NULL,
    "sender_number" TEXT NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL,
    "transaction_date" TEXT NOT NULL,
    "transaction_time" TEXT NOT NULL,
    "raw_sms" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_trx_id_key" ON "transactions"("trx_id");
