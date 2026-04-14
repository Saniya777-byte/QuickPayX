import express from "express";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/profile", protect, (req: any, res) => {
  res.json({
    message: "User profile accessed",
    userId: req.user,
  });
});

export default router;