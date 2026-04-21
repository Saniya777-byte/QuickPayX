import { Request, Response } from 'express';
import { financialInsightsService } from '../services/FinancialInsightsService';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { InvestmentRepository } from '../repositories/InvestmentRepository';

const transactionRepository = new TransactionRepository();
const investmentRepository = new InvestmentRepository();

export class FinancialInsightsController {
  async getInsights(req: Request, res: Response) {
    try {
      const userId = (req as any).user;

      // Get user's transactions
      const transactions = await transactionRepository.findByUserId(userId);

      // Get user's portfolio
      const investment = await investmentRepository.findByUserId(userId);
      const portfolio = investment?.portfolio || [];
      const virtualBalance = investment?.virtualBalance || 0;

      // Generate insights
      const spendingInsights = financialInsightsService.analyzeSpending(transactions as any, userId);
      const portfolioInsights = financialInsightsService.analyzePortfolio(portfolio, virtualBalance);

      const allInsights = [...spendingInsights, ...portfolioInsights];

      res.json({
        success: true,
        insights: allInsights
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to generate insights'
      });
    }
  }

  async askQuery(req: Request, res: Response) {
    try {
      const userId = (req as any).user;
      const { query } = req.body;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Query is required'
        });
      }

      // Get user's transactions
      const transactions = await transactionRepository.findByUserId(userId);

      // Get user's portfolio
      const investment = await investmentRepository.findByUserId(userId);
      const portfolio = investment?.portfolio || [];

      // Answer query
      const answer = financialInsightsService.answerQuery(query, transactions as any, portfolio, userId);

      res.json({
        success: true,
        answer
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to process query'
      });
    }
  }
}

export const financialInsightsController = new FinancialInsightsController();
