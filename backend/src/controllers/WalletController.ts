import { Request, Response } from "express";
import WalletService from "../services/WalletService";

export const getWallet = async (req: any, res: Response) => {
  const wallet = await WalletService.getWallet(req.user);
  res.json(wallet);
};

export const addMoney = async (req: any, res: Response) => {
  const { amount } = req.body;

  const wallet = await WalletService.addMoney(req.user, amount);
  res.json(wallet);
};

export const getAnalytics = async (req: any, res: Response) => {
  try {
    const analytics = await WalletService.getAnalytics(req.user);
    res.json(analytics);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};