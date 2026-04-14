import express from "express";
import { protect } from "../middleware/authMiddleware";
import { transfer } from "../controllers/TransactionController";

const router = express.Router();

router.post("/transfer", protect, transfer);

export default router;