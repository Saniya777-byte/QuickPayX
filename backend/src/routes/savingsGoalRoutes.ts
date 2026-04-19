import express from "express";
import { protect } from "../middleware/authMiddleware";
import { createGoal, getUserGoals, updateGoal, deleteGoal, addProgress, getGoalSummary } from "../controllers/SavingsGoalController";

const router = express.Router();

router.post("/", protect, createGoal);
router.get("/", protect, getUserGoals);
router.get("/summary", protect, getGoalSummary);
router.put("/:id", protect, updateGoal);
router.delete("/:id", protect, deleteGoal);
router.post("/:id/progress", protect, addProgress);

export default router;
