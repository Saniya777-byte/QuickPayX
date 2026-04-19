import express from "express";
import { protect } from "../middleware/authMiddleware";
import { getAnalytics, getSpendingByCategory, getMonthlyTrends, getInsights, getTopContacts } from "../controllers/AnalyticsController";

const router = express.Router();

router.get("/summary", protect, getAnalytics);
router.get("/spending-by-category", protect, getSpendingByCategory);
router.get("/monthly-trends", protect, getMonthlyTrends);
router.get("/insights", protect, getInsights);
router.get("/top-contacts", protect, getTopContacts);

export default router;
