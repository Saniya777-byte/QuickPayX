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