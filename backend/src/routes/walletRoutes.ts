import express from "express";
import { protect } from "../middleware/authMiddleware";
import { getWallet, addMoney } from "../controllers/WalletController";

const router = express.Router();

router.get("/", protect, getWallet);
router.post("/add", protect, addMoney);

export default router;