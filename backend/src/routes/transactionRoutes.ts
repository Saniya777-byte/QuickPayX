import express from "express";
import { protect } from "../middleware/authMiddleware";
import { transfer, getHistory } from "../controllers/TransactionController";
import { validateTransfer } from "../middleware/validationMiddleware";

const router = express.Router();

router.post("/transfer", protect, validateTransfer, transfer);
router.get("/history", protect, getHistory);

export default router;