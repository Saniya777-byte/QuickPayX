import { prisma } from '../lib/prisma';

export class InvestmentRepository {
  async findByUserId(userId: string) {
    const investment = await prisma.investment.upsert({
      where: { userId },
      update: {},
      create: { userId, virtualBalance: 10000 },
      include: { portfolio: true }
    });
    return investment;
  }

  async updateVirtualBalance(userId: string, newBalance: number) {
    return await prisma.investment.upsert({
      where: { userId },
      update: { virtualBalance: newBalance },
      create: { userId, virtualBalance: newBalance }
    });
  }

  async addPortfolioItem(userId: string, item: any) {
    const investment = await this.findByUserId(userId);
    const existingItem = investment.portfolio?.find(
      (p: any) => p.symbol === item.symbol
    );

    if (existingItem) {
      // Update existing item (average price calculation)
      const totalQuantity = existingItem.quantity + item.quantity;
      const totalCost = (existingItem.quantity * existingItem.averagePrice) + (item.quantity * item.averagePrice);
      const newAveragePrice = totalCost / totalQuantity;

      return await prisma.portfolioItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: totalQuantity,
          averagePrice: newAveragePrice,
          currentPrice: item.currentPrice,
        }
      });
    } else {
      // Add new item
      return await prisma.portfolioItem.create({
        data: {
          investmentId: investment.id,
          symbol: item.symbol,
          name: item.name,
          quantity: item.quantity,
          averagePrice: item.averagePrice,
          currentPrice: item.currentPrice,
        }
      });
    }
  }

  async removePortfolioItem(userId: string, symbol: string, quantity: number) {
    const investment = await this.findByUserId(userId);
    const item = investment.portfolio?.find((p: any) => p.symbol === symbol);

    if (!item) {
      throw new Error('Item not found in portfolio');
    }

    if (quantity >= item.quantity) {
      // Remove entire item
      return await prisma.portfolioItem.delete({
        where: { id: item.id }
      });
    } else {
      // Partial sell
      const newQuantity = item.quantity - quantity;
      return await prisma.portfolioItem.update({
        where: { id: item.id },
        data: { quantity: newQuantity }
      });
    }
  }

  async updatePortfolioItem(userId: string, symbol: string, updates: any) {
    const investment = await this.findByUserId(userId);
    const item = investment.portfolio?.find((p: any) => p.symbol === symbol);
    if (!item) throw new Error('Item not found');

    return await prisma.portfolioItem.update({
      where: { id: item.id },
      data: updates
    });
  }

  async updatePortfolioPrices(userId: string, prices: { symbol: string; price: number }[]) {
    const investment = await this.findByUserId(userId);
    
    for (const item of investment.portfolio || []) {
      const priceUpdate = prices.find(p => p.symbol === item.symbol);
      if (priceUpdate) {
        await prisma.portfolioItem.update({
          where: { id: item.id },
          data: { currentPrice: priceUpdate.price }
        });
      }
    }

    return await this.findByUserId(userId);
  }
}
