// Real AI Financial Insights Service
// Generates meaningful insights based on actual transaction and portfolio analysis

import { categorizeTransaction } from './aiCategorization';

interface Transaction {
  id: string;
  amount: number;
  createdAt: Date;
  senderId?: string;
  receiverId?: string;
  sender?: { id: string };
  receiver?: { id: string; name: string };
  description?: string;
}

interface PortfolioItem {
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
}

interface Insight {
  type: 'spending' | 'portfolio' | 'warning' | 'opportunity';
  title: string;
  description: string;
  metric?: string;
  trend?: 'up' | 'down' | 'neutral';
  priority: 'high' | 'medium' | 'low';
}

export class FinancialInsightsService {
  /**
   * Analyze transactions and generate spending insights
   */
  analyzeSpending(transactions: Transaction[], userId: string): Insight[] {
    const insights: Insight[] = [];
    
    if (!transactions || transactions.length === 0) {
      insights.push({
        type: 'spending',
        title: 'Start Tracking Your Spending',
        description: 'Make your first transaction to begin receiving personalized spending insights.',
        priority: 'low'
      });
      return insights;
    }

    // Filter user's sent transactions
    const userTransactions = transactions.filter(
      tx => tx.senderId === userId
    );

    if (userTransactions.length === 0) {
      insights.push({
        type: 'spending',
        title: 'No Spending Yet',
        description: 'You haven\'t made any transactions yet. Start spending to see your spending patterns.',
        priority: 'low'
      });
      return insights;
    }

    // Categorize transactions
    const categorizedSpending = this.categorizeSpending(userTransactions);
    
    // Find top spending category
    const topCategory = this.getTopSpendingCategory(categorizedSpending);
    if (topCategory) {
      insights.push({
        type: 'spending',
        title: 'Top Expense Category',
        description: `Your highest spending is on ${this.formatCategory(topCategory.category)} ($${topCategory.amount.toFixed(2)})`,
        metric: `$${topCategory.amount.toFixed(2)}`,
        priority: 'high'
      });
    }

    // Calculate weekly vs monthly comparison
    const timeComparison = this.calculateTimeComparison(userTransactions);
    if (timeComparison) {
      insights.push({
        type: 'spending',
        title: 'Spending Trend',
        description: timeComparison.description,
        metric: timeComparison.percentage,
        trend: timeComparison.trend,
        priority: 'medium'
      });
    }

    // Calculate total spending this month
    const monthlyTotal = this.calculateMonthlySpending(userTransactions);
    if (monthlyTotal > 0) {
      insights.push({
        type: 'spending',
        title: 'Monthly Spending',
        description: `You've spent $${monthlyTotal.toFixed(2)} this month`,
        metric: `$${monthlyTotal.toFixed(2)}`,
        priority: 'medium'
      });
    }

    // Check for unusual spending patterns
    const unusualSpending = this.detectUnusualSpending(userTransactions);
    if (unusualSpending) {
      insights.push({
        type: 'warning',
        title: 'Unusual Spending Detected',
        description: unusualSpending,
        priority: 'high'
      });
    }

    return insights;
  }

  /**
   * Analyze portfolio and generate investment insights
   */
  analyzePortfolio(portfolio: PortfolioItem[], virtualBalance: number): Insight[] {
    const insights: Insight[] = [];

    if (!portfolio || portfolio.length === 0) {
      insights.push({
        type: 'portfolio',
        title: 'Start Investing',
        description: 'Your portfolio is empty. Start paper trading to see investment insights.',
        priority: 'low'
      });
      return insights;
    }

    // Calculate portfolio concentration
    const concentration = this.calculateConcentration(portfolio);
    if (concentration > 0.7) {
      insights.push({
        type: 'warning',
        title: 'High Portfolio Concentration',
        description: `Your portfolio is ${Math.round(concentration * 100)}% concentrated in a single stock. Consider diversifying.`,
        metric: `${Math.round(concentration * 100)}%`,
        priority: 'high'
      });
    } else if (concentration > 0.5) {
      insights.push({
        type: 'warning',
        title: 'Moderate Concentration',
        description: `${Math.round(concentration * 100)}% of your portfolio is in one stock. Diversification could reduce risk.`,
        metric: `${Math.round(concentration * 100)}%`,
        priority: 'medium'
      });
    }

    // Calculate portfolio performance
    const performance = this.calculatePortfolioPerformance(portfolio);
    insights.push({
      type: 'portfolio',
      title: 'Portfolio Performance',
      description: performance.description,
      metric: `${performance.percentage}%`,
      trend: performance.trend,
      priority: 'high'
    });

    // Calculate diversification score
    const diversificationScore = this.calculateDiversificationScore(portfolio);
    insights.push({
      type: 'portfolio',
      title: 'Diversification Score',
      description: `Your portfolio diversification score is ${diversificationScore}/10`,
      metric: `${diversificationScore}/10`,
      priority: 'medium'
    });

    // Risk level assessment
    const riskLevel = this.assessRiskLevel(portfolio, virtualBalance);
    insights.push({
      type: 'portfolio',
      title: 'Portfolio Risk Level',
      description: `Your portfolio has ${riskLevel} risk based on concentration and volatility`,
      metric: riskLevel,
      priority: 'medium'
    });

    // Generate suggestions
    const suggestions = this.generatePortfolioSuggestions(portfolio, concentration, diversificationScore);
    insights.push(...suggestions);

    return insights;
  }

  /**
   * Categorize spending by category
   */
  private categorizeSpending(transactions: Transaction[]): Record<string, number> {
    const categorized: Record<string, number> = {};

    for (const tx of transactions) {
      const category = categorizeTransaction(tx.description || 'transfer');
      categorized[category] = (categorized[category] || 0) + tx.amount;
    }

    return categorized;
  }

  /**
   * Get top spending category
   */
  private getTopSpendingCategory(categorized: Record<string, number>): { category: string; amount: number } | null {
    let top = null;
    let maxAmount = 0;

    for (const [category, amount] of Object.entries(categorized)) {
      if (amount > maxAmount) {
        maxAmount = amount;
        top = { category, amount };
      }
    }

    return top;
  }

  /**
   * Calculate time-based spending comparison (this week vs last week)
   */
  private calculateTimeComparison(transactions: Transaction[]): { description: string; percentage: string; trend: 'up' | 'down' | 'neutral' } | null {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const thisWeekTotal = transactions
      .filter(tx => new Date(tx.createdAt) >= oneWeekAgo)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const lastWeekTotal = transactions
      .filter(tx => {
        const date = new Date(tx.createdAt);
        return date >= twoWeeksAgo && date < oneWeekAgo;
      })
      .reduce((sum, tx) => sum + tx.amount, 0);

    if (lastWeekTotal === 0) return null;

    const percentageChange = ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100;
    const trend: 'up' | 'down' | 'neutral' = percentageChange > 5 ? 'up' : percentageChange < -5 ? 'down' : 'neutral';

    return {
      description: `You spent ${Math.abs(percentageChange).toFixed(0)}% ${trend === 'up' ? 'more' : 'less'} this week compared to last week`,
      percentage: `${Math.abs(percentageChange).toFixed(0)}%`,
      trend
    };
  }

  /**
   * Calculate total spending this month
   */
  private calculateMonthlySpending(transactions: Transaction[]): number {
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return transactions
      .filter(tx => new Date(tx.createdAt) >= firstOfMonth)
      .reduce((sum, tx) => sum + tx.amount, 0);
  }

  /**
   * Detect unusual spending patterns
   */
  private detectUnusualSpending(transactions: Transaction[]): string | null {
    if (transactions.length < 3) return null;

    const amounts = transactions.map(tx => tx.amount);
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const max = Math.max(...amounts);

    if (max > avg * 5) {
      return `You have a transaction of $${max.toFixed(2)} which is significantly higher than your average of $${avg.toFixed(2)}`;
    }

    return null;
  }

  /**
   * Calculate portfolio concentration (largest holding percentage)
   */
  private calculateConcentration(portfolio: PortfolioItem[]): number {
    if (portfolio.length === 0) return 0;

    const totalValue = portfolio.reduce((sum, item) => sum + (item.quantity * item.currentPrice), 0);
    if (totalValue === 0) return 0;

    const maxHolding = Math.max(...portfolio.map(item => item.quantity * item.currentPrice));
    return maxHolding / totalValue;
  }

  /**
   * Calculate portfolio performance
   */
  private calculatePortfolioPerformance(portfolio: PortfolioItem[]): { description: string; percentage: number; trend: 'up' | 'down' | 'neutral' } {
    let totalInvested = 0;
    let currentValue = 0;

    for (const item of portfolio) {
      totalInvested += item.quantity * item.averagePrice;
      currentValue += item.quantity * item.currentPrice;
    }

    if (totalInvested === 0) {
      return { description: 'No investments yet', percentage: 0, trend: 'neutral' };
    }

    const percentageChange = ((currentValue - totalInvested) / totalInvested) * 100;
    const trend: 'up' | 'down' | 'neutral' = percentageChange > 1 ? 'up' : percentageChange < -1 ? 'down' : 'neutral';

    return {
      description: `Your portfolio is ${percentageChange >= 0 ? 'up' : 'down'} ${Math.abs(percentageChange).toFixed(2)}% from your investment`,
      percentage: percentageChange,
      trend
    };
  }

  /**
   * Calculate diversification score (0-10)
   */
  private calculateDiversificationScore(portfolio: PortfolioItem[]): number {
    if (portfolio.length === 0) return 0;
    if (portfolio.length === 1) return 1;

    // Score based on number of holdings and concentration
    const concentration = this.calculateConcentration(portfolio);
    const holdingsScore = Math.min(portfolio.length / 5, 1) * 5; // Max 5 points for holdings
    const concentrationScore = (1 - concentration) * 5; // Max 5 points for low concentration

    return Math.round(holdingsScore + concentrationScore);
  }

  /**
   * Assess portfolio risk level
   */
  private assessRiskLevel(portfolio: PortfolioItem[], virtualBalance: number): 'Low' | 'Medium' | 'High' {
    const concentration = this.calculateConcentration(portfolio);
    const diversificationScore = this.calculateDiversificationScore(portfolio);

    if (concentration > 0.6 || diversificationScore < 4) return 'High';
    if (concentration > 0.4 || diversificationScore < 6) return 'Medium';
    return 'Low';
  }

  /**
   * Generate portfolio suggestions
   */
  private generatePortfolioSuggestions(portfolio: PortfolioItem[], concentration: number, diversificationScore: number): Insight[] {
    const suggestions: Insight[] = [];

    if (concentration > 0.5) {
      const topStock = portfolio.reduce((max, item) => 
        (item.quantity * item.currentPrice) > (max.quantity * max.currentPrice) ? item : max
      );
      suggestions.push({
        type: 'opportunity',
        title: 'Diversification Opportunity',
        description: `Consider reducing exposure to ${topStock.symbol} and adding more stocks to your portfolio`,
        priority: 'high'
      });
    }

    if (diversificationScore < 5 && portfolio.length < 5) {
      suggestions.push({
        type: 'opportunity',
        title: 'Expand Your Portfolio',
        description: 'Adding more stocks can improve diversification and reduce risk',
        priority: 'medium'
      });
    }

    return suggestions;
  }

  /**
   * Format category name for display
   */
  private formatCategory(category: string): string {
    const categoryNames: Record<string, string> = {
      food: 'Food & Dining',
      bills: 'Bills & Utilities',
      travel: 'Travel',
      shopping: 'Shopping',
      entertainment: 'Entertainment',
      health: 'Health & Wellness',
      education: 'Education',
      transfer: 'Transfers',
      other: 'Other'
    };
    return categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
  }

  /**
   * Answer natural language queries about finances
   */
  answerQuery(query: string, transactions: Transaction[], portfolio: PortfolioItem[], userId: string): string {
    const lowerQuery = query.toLowerCase();

    // Spending queries
    if (lowerQuery.includes('how much') && lowerQuery.includes('spend')) {
      const userTransactions = transactions.filter(tx => tx.senderId === userId);
      const monthlyTotal = this.calculateMonthlySpending(userTransactions);
      return `You've spent $${monthlyTotal.toFixed(2)} this month.`;
    }

    if (lowerQuery.includes('top') && lowerQuery.includes('expense')) {
      const userTransactions = transactions.filter(tx => tx.senderId === userId);
      const categorized = this.categorizeSpending(userTransactions);
      const top = this.getTopSpendingCategory(categorized);
      if (top) {
        return `Your top expense category is ${this.formatCategory(top.category)} at $${top.amount.toFixed(2)}.`;
      }
      return 'No spending data available yet.';
    }

    // Portfolio queries
    if (lowerQuery.includes('portfolio') && lowerQuery.includes('risky')) {
      const riskLevel = this.assessRiskLevel(portfolio, 0);
      return `Your portfolio has ${riskLevel} risk based on concentration analysis.`;
    }

    if (lowerQuery.includes('portfolio') && lowerQuery.includes('perform')) {
      const performance = this.calculatePortfolioPerformance(portfolio);
      return `Your portfolio is ${performance.percentage >= 0 ? 'up' : 'down'} ${Math.abs(performance.percentage).toFixed(2)}% from your investment.`;
    }

    return 'I can help you with questions about your spending, portfolio, and financial insights. Try asking about your monthly spending, top expenses, or portfolio performance.';
  }
}

export const financialInsightsService = new FinancialInsightsService();
