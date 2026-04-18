import express from "express";
import { register, login } from "../controllers/AuthController";
import { validateRegister, validateLogin } from "../middleware/validationMiddleware";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

export default router;