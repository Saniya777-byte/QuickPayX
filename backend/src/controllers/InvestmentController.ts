import { Request, Response } from "express";
import InvestmentService from "../services/InvestmentService";

export const getInvestment = async (req: any, res: Response) => {
  try {
    const investment = await InvestmentService.getInvestment(req.user);
    res.json(investment);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const buyStock = async (req: any, res: Response) => {
  try {
    const { symbol, name, quantity, price } = req.body;
    const investment = await InvestmentService.buyStock(req.user, symbol, name, quantity, price);
    res.json(investment);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const sellStock = async (req: any, res: Response) => {
  try {
    const { symbol, quantity, price } = req.body;
    const investment = await InvestmentService.sellStock(req.user, symbol, quantity, price);
    res.json(investment);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getPortfolioSummary = async (req: any, res: Response) => {
  try {
    const summary = await InvestmentService.getPortfolioSummary(req.user);
    res.json(summary);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
