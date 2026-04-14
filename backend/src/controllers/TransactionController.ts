import { Request, Response } from "express";
import TransactionService from "../services/TransactionService";

export const transfer = async (req: any, res: Response) => {
  try {
    const { receiverId, amount } = req.body;

    const transaction = await TransactionService.transferMoney(
      req.user,
      receiverId,
      amount
    );

    res.json(transaction);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};