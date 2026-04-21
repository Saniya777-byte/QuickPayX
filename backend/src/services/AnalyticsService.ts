import { TransactionRepository } from "../repositories/TransactionRepository";
import { categorizeTransaction } from "./aiCategorization";

interface SpendingByCategory {
  category: string;
  amount: number;
  count: number;
}

interface MonthlyTrend {
  month: string;
  spent: number;
  received: number;
}

interface Insight {
  type: 'warning' | 'info' | 'success';
  message: string;
  value?: number;
}

class AnalyticsService {
  private transactionRepository = new TransactionRepository();

  async getSpendingByCategory(userId: string): Promise<SpendingByCategory[]> {
    const transactions = await this.transactionRepository.findByUserId(userId);
    const completedTransactions = transactions.filter(t => t.status === 'completed' && t.senderId === userId);
    
    const categoryMap = new Map<string, { amount: number; count: number }>();
    
    for (const transaction of completedTransactions) {
      const category = transaction.category || 'other';
      const current = categoryMap.get(category) || { amount: 0, count: 0 };
      categoryMap.set(category, {
        amount: current.amount + transaction.amount,
        count: current.count + 1
      });
    }
    
    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      amount: data.amount,
      count: data.count
    })).sort((a, b) => b.amount - a.amount);
  }

  async getMonthlyTrends(userId: string, months: number = 6): Promise<MonthlyTrend[]> {
    const transactions = await this.transactionRepository.findByUserId(userId);
    const completedTransactions = transactions.filter(t => t.status === 'completed');
    
    const monthlyMap = new Map<string, { spent: number; received: number }>();
    
    for (const transaction of completedTransactions) {
      const date = new Date(transaction.createdAt!);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const current = monthlyMap.get(monthKey) || { spent: 0, received: 0 };
      
      if (transaction.senderId === userId) {
        current.spent += transaction.amount;
      } else if (transaction.receiverId === userId) {
        current.received += transaction.amount;
      }
      
      monthlyMap.set(monthKey, current);
    }
    
    // Get last N months
    const trends: MonthlyTrend[] = [];
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const data = monthlyMap.get(monthKey) || { spent: 0, received: 0 };
      
      trends.push({
        month: monthKey,
        spent: data.spent,
        received: data.received
      });
    }
    
    return trends;
  }

  async getSpendingInsights(userId: string): Promise<Insight[]> {
    const transactions = await this.transactionRepository.findByUserId(userId);
    const completedTransactions = transactions.filter(t => t.status === 'completed' && t.senderId === userId);
    
    const insights: Insight[] = [];
    
    if (completedTransactions.length === 0) {
      insights.push({
        type: 'info',
        message: 'No transactions yet. Start spending to see insights!'
      });
      return insights;
    }
    
    // Calculate total spent
    const totalSpent = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate average transaction amount
    const avgAmount = totalSpent / completedTransactions.length;
    
    // Get spending by category
    const categorySpending = await this.getSpendingByCategory(userId);
    const topCategory = categorySpending[0];
    
    if (topCategory) {
      const topCategoryPercent = ((topCategory.amount / totalSpent) * 100).toFixed(1);
      insights.push({
        type: 'info',
        message: `Your top expense is ${topCategory.category} (${topCategoryPercent}% of spending)`,
        value: topCategory.amount
      });
    }
    
    // Check for recent spending patterns (last 7 days vs previous 7 days)
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const recentSpending = completedTransactions
      .filter(t => new Date(t.createdAt!) >= weekAgo)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const previousSpending = completedTransactions
      .filter(t => {
        const date = new Date(t.createdAt!);
        return date >= twoWeeksAgo && date < weekAgo;
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    if (previousSpending > 0) {
      const changePercent = ((recentSpending - previousSpending) / previousSpending) * 100;
      if (changePercent > 20) {
        insights.push({
          type: 'warning',
          message: `You spent ${changePercent.toFixed(0)}% more this week compared to last week`,
          value: changePercent
        });
      } else if (changePercent < -20) {
        insights.push({
          type: 'success',
          message: `Great! You spent ${Math.abs(changePercent).toFixed(0)}% less this week compared to last week`,
          value: changePercent
        });
      }
    }
    
    // Check for large transactions
    const largeTransactions = completedTransactions.filter(t => t.amount > avgAmount * 3);
    if (largeTransactions.length > 0) {
      insights.push({
        type: 'warning',
        message: `You have ${largeTransactions.length} unusually large transactions`,
        value: largeTransactions.length
      });
    }
    
    return insights;
  }

  async getTopContacts(userId: string, limit: number = 5) {
    const transactions = await this.transactionRepository.findByUserId(userId);
    const completedTransactions = transactions.filter(t => t.status === 'completed');
    
    const contactMap = new Map<string, { name: string; count: number; totalAmount: number }>();
    
    for (const transaction of completedTransactions) {
      let contactId: string;
      let contactName: string;
      
      if (transaction.senderId === userId) {
        contactId = transaction.receiverId!;
        contactName = 'Receiver'; // Would need to populate user name
      } else {
        contactId = transaction.senderId!;
        contactName = 'Sender';
      }
      
      const current = contactMap.get(contactId) || { name: contactName, count: 0, totalAmount: 0 };
      contactMap.set(contactId, {
        name: current.name,
        count: current.count + 1,
        totalAmount: current.totalAmount + transaction.amount
      });
    }
    
    return Array.from(contactMap.values())
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, limit);
  }

  async getAnalyticsSummary(userId: string) {
    const transactions = await this.transactionRepository.findByUserId(userId);
    const completedTransactions = transactions.filter(t => t.status === 'completed');
    
    const userSent = completedTransactions.filter(t => t.senderId === userId);
    const userReceived = completedTransactions.filter(t => t.receiverId === userId);
    
    const totalSent = userSent.reduce((sum, t) => sum + t.amount, 0);
    const totalReceived = userReceived.reduce((sum, t) => sum + t.amount, 0);
    
    const spendingByCategory = await this.getSpendingByCategory(userId);
    const monthlyTrends = await this.getMonthlyTrends(userId);
    const insights = await this.getSpendingInsights(userId);
    const topContacts = await this.getTopContacts(userId);
    
    return {
      totalSent,
      totalReceived,
      transactionCount: completedTransactions.length,
      spendingByCategory,
      monthlyTrends,
      insights,
      topContacts
    };
  }
}

export default new AnalyticsService();
