import { Request, Response } from "express";
import AnalyticsService from "../services/AnalyticsService";

export const getAnalytics = async (req: any, res: Response) => {
  try {
    const analytics = await AnalyticsService.getAnalyticsSummary(req.user);
    res.json(analytics);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getSpendingByCategory = async (req: any, res: Response) => {
  try {
    const spending = await AnalyticsService.getSpendingByCategory(req.user);
    res.json(spending);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMonthlyTrends = async (req: any, res: Response) => {
  try {
    const months = parseInt(req.query.months as string) || 6;
    const trends = await AnalyticsService.getMonthlyTrends(req.user, months);
    res.json(trends);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getInsights = async (req: any, res: Response) => {
  try {
    const insights = await AnalyticsService.getSpendingInsights(req.user);
    res.json(insights);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getTopContacts = async (req: any, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    const contacts = await AnalyticsService.getTopContacts(req.user, limit);
    res.json(contacts);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
