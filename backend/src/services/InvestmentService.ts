import { InvestmentRepository } from '../repositories/InvestmentRepository';
import { WalletRepository } from '../repositories/WalletRepository';

class InvestmentService {
  private investmentRepository = new InvestmentRepository();
  private walletRepository = new WalletRepository();
  private readonly TRANSACTION_FEE_PERCENTAGE = 0.01; // 1% transaction fee

  async getInvestment(userId: string) {
    const investment = await this.investmentRepository.findByUserId(userId);
    
    // Simulate price fluctuation on portfolio items
    if (investment && investment.portfolio) {
      const portfolioArray = Array.from(investment.portfolio);
      investment.portfolio = portfolioArray.map((item: any) => ({
        ...item,
        currentPrice: this.simulatePriceFluctuation(item.currentPrice)
      })) as any;
    }
    
    return investment;
  }

  /**
   * Simulate realistic stock price fluctuation (±2% random movement)
   */
  private simulatePriceFluctuation(currentPrice: number): number {
    const fluctuation = (Math.random() - 0.5) * 0.04; // ±2% fluctuation
    const newPrice = currentPrice * (1 + fluctuation);
    return Math.round(newPrice * 100) / 100; // Round to 2 decimal places
  }

  async buyStock(userId: string, symbol: string, name: string, quantity: number, price: number) {
    const investment = await this.investmentRepository.findByUserId(userId);
    const wallet = await this.walletRepository.findByUserId(userId);
    
    // Validate inputs
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    if (price <= 0) {
      throw new Error('Price must be greater than 0');
    }
    if (quantity < 1) {
      throw new Error('Minimum purchase quantity is 1 share');
    }

    const totalCost = quantity * price;
    const transactionFee = totalCost * this.TRANSACTION_FEE_PERCENTAGE;
    const totalWithFee = totalCost + transactionFee;

    if (!wallet || wallet.balance < totalWithFee) {
      throw new Error(`Insufficient wallet balance. Required: $${totalWithFee.toFixed(2)} (includes $${transactionFee.toFixed(2)} fee)`);
    }

    // Deduct from wallet balance (including fee)
    await this.walletRepository.updateBalance(userId, -totalWithFee);

    // Check if stock already exists in portfolio
    const existingItem = investment.portfolio?.find((p: any) => p.symbol === symbol);
    
    if (existingItem) {
      // Update existing position (weighted average)
      const totalShares = existingItem.quantity + quantity;
      const weightedAvgPrice = ((existingItem.averagePrice * existingItem.quantity) + (price * quantity)) / totalShares;
      
      await this.investmentRepository.updatePortfolioItem(userId, symbol, {
        quantity: totalShares,
        averagePrice: weightedAvgPrice,
        currentPrice: price
      });
    } else {
      // Add new position
      await this.investmentRepository.addPortfolioItem(userId, {
        symbol,
        name,
        quantity,
        averagePrice: price,
        currentPrice: price
      });
    }

    return await this.investmentRepository.findByUserId(userId);
  }

  async sellStock(userId: string, symbol: string, quantity: number, price: number) {
    const investment = await this.investmentRepository.findByUserId(userId);
    
    // Validate inputs
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    if (price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    const portfolioItem = investment.portfolio?.find((p: any) => p.symbol === symbol);

    if (!portfolioItem) {
      throw new Error('Stock not found in portfolio');
    }

    if (portfolioItem.quantity < quantity) {
      throw new Error(`Insufficient stock quantity. You own ${portfolioItem.quantity} shares but tried to sell ${quantity}`);
    }

    // Calculate revenue with transaction fee
    const totalRevenue = quantity * price;
    const transactionFee = totalRevenue * this.TRANSACTION_FEE_PERCENTAGE;
    const netRevenue = totalRevenue - transactionFee;

    // Add net revenue to wallet balance
    await this.walletRepository.updateBalance(userId, netRevenue);

    // Remove from portfolio
    if (portfolioItem.quantity === quantity) {
      // Remove entire position
      await this.investmentRepository.removePortfolioItem(userId, symbol, quantity);
    } else {
      // Update quantity
      await this.investmentRepository.updatePortfolioItem(userId, symbol, {
        quantity: portfolioItem.quantity - quantity
      });
    }

    return await this.investmentRepository.findByUserId(userId);
  }

  async getPortfolioSummary(userId: string) {
    const investment = await this.investmentRepository.findByUserId(userId);
    const wallet = await this.walletRepository.findByUserId(userId);
    
    // Simulate price fluctuation
    const portfolioWithFluctuation = (investment.portfolio || []).map((item: any) => ({
      ...item,
      currentPrice: this.simulatePriceFluctuation(item.currentPrice || item.averagePrice)
    }));
    
    let totalInvested = 0;
    let currentValue = 0;

    portfolioWithFluctuation.forEach((item: any) => {
      totalInvested += item.quantity * item.averagePrice;
      currentValue += item.quantity * item.currentPrice;
    });

    const profitLoss = currentValue - totalInvested;
    const profitLossPercent = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

    return {
      virtualBalance: wallet?.balance || 0,
      totalInvested,
      currentValue,
      profitLoss,
      profitLossPercent,
      portfolio: portfolioWithFluctuation
    };
  }
}

export default new InvestmentService();
