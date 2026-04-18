import express from "express";
import { protect } from "../middleware/authMiddleware";
import { getWallet, addMoney } from "../controllers/WalletController";
import { validateAddMoney } from "../middleware/validationMiddleware";

const router = express.Router();

router.get("/", protect, getWallet);
router.post("/add", protect, validateAddMoney, addMoney);

export default router;