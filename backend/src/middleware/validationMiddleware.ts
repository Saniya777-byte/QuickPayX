import { Request, Response, NextFunction } from "express";
import { IRegisterRequest, ILoginRequest, IAddMoneyRequest, ITransferRequest } from "../types";

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body as IRegisterRequest;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ message: "Name must be at least 2 characters long" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as ILoginRequest;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  next();
};

export const validateAddMoney = (req: Request, res: Response, next: NextFunction) => {
  const { amount } = req.body as IAddMoneyRequest;

  if (!amount || typeof amount !== 'number') {
    return res.status(400).json({ message: "Amount is required and must be a number" });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: "Amount must be greater than 0" });
  }

  if (amount > 100000) {
    return res.status(400).json({ message: "Amount cannot exceed 100,000" });
  }

  next();
};

export const validateTransfer = (req: Request, res: Response, next: NextFunction) => {
  const { receiverId, amount } = req.body as ITransferRequest;

  if (!receiverId || typeof receiverId !== 'string') {
    return res.status(400).json({ message: "Receiver ID is required" });
  }

  if (!amount || typeof amount !== 'number') {
    return res.status(400).json({ message: "Amount is required and must be a number" });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: "Amount must be greater than 0" });
  }

  if (amount > 100000) {
    return res.status(400).json({ message: "Amount cannot exceed 100,000" });
  }

  next();
};
