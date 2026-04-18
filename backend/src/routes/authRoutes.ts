import express from "express";
import { register, login } from "../controllers/AuthController";
import { validateRegister, validateLogin } from "../middleware/validationMiddleware";
import { loginLimiter } from "../middleware/rateLimiter";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, loginLimiter, login);

export default router;