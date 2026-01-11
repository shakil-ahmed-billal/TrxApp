import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import transactionController from "./transaction.controller";

const router: Router = Router();

// All transaction routes require authentication
router.use(authenticateToken);

router.post(
  "/",
  transactionController.createTransaction.bind(transactionController)
);
router.get(
  "/",
  transactionController.getAllTransactions.bind(transactionController)
);
router.get(
  "/:trxId",
  transactionController.getTransactionByTrxId.bind(transactionController)
);

export default router;
