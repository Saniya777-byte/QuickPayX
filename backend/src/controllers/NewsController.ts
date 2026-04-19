import { Request, Response } from "express";
import NewsService from "../services/NewsService";

export const getNews = async (req: Request, res: Response) => {
  try {
    const news = await NewsService.getFinancialNews();
    res.json(news);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
