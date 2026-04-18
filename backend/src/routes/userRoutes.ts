import express from "express";
import { protect } from "../middleware/authMiddleware";
import { searchUsers, getRecentUsers } from "../controllers/UserController";

const router = express.Router();

router.get("/profile", protect, (req: any, res) => {
  res.json({
    message: "User profile accessed",
    userId: req.user,
  });
});

router.get("/search", protect, searchUsers);
router.get("/recent", protect, getRecentUsers);

export default router;