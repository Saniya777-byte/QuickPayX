import { Request, Response } from "express";
import StockDataService from "../services/StockDataService";

export const getAllStocks = async (req: Request, res: Response) => {
  try {
    const stocks = StockDataService.getAllStocks();
    res.json(stocks);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const searchStocks = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ message: "Search query is required" });
    }
    const stocks = StockDataService.searchStocks(q);
    res.json(stocks);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getStockBySymbol = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    if (!symbol || typeof symbol !== 'string') {
      return res.status(400).json({ message: "Symbol is required" });
    }
    const stock = StockDataService.getStockBySymbol(symbol);
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    res.json(stock);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getLivePrice = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    if (!symbol || typeof symbol !== 'string') {
      return res.status(400).json({ message: "Symbol is required" });
    }
    const price = StockDataService.getLivePrice(symbol);
    res.json({ symbol, price });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getTopGainers = async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;
    const gainers = StockDataService.getTopGainers(Number(limit as string) || 5);
    res.json(gainers);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getTopLosers = async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;
    const losers = StockDataService.getTopLosers(Number(limit as string) || 5);
    res.json(losers);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getSectors = async (req: Request, res: Response) => {
  try {
    const sectors = StockDataService.getSectors();
    res.json(sectors);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
