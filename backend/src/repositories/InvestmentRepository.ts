import Investment from '../models/Investment';
import mongoose from 'mongoose';

export class InvestmentRepository {
  async findByUserId(userId: string) {
    let investment = await Investment.findOne({ userId });
    if (!investment) {
      investment = await Investment.create({ userId: new mongoose.Types.ObjectId(userId) });
    }
    return investment;
  }

  async updateVirtualBalance(userId: string, newBalance: number) {
    return await Investment.findOneAndUpdate(
      { userId },
      { virtualBalance: newBalance },
      { new: true, upsert: true }
    );
  }

  async addPortfolioItem(userId: string, item: any) {
    const investment = await this.findByUserId(userId);
    const existingItem = investment.portfolio.find(
      (p: any) => p.symbol === item.symbol
    );

    if (existingItem) {
      // Update existing item (average price calculation)
      const totalQuantity = existingItem.quantity + item.quantity;
      const totalCost = (existingItem.quantity * existingItem.averagePrice) + (item.quantity * item.averagePrice);
      const newAveragePrice = totalCost / totalQuantity;

      return await Investment.findOneAndUpdate(
        { userId, 'portfolio.symbol': item.symbol },
        {
          $set: {
            'portfolio.$.quantity': totalQuantity,
            'portfolio.$.averagePrice': newAveragePrice,
            'portfolio.$.currentPrice': item.currentPrice,
          }
        },
        { new: true }
      );
    } else {
      // Add new item
      return await Investment.findOneAndUpdate(
        { userId },
        { $push: { portfolio: item } },
        { new: true, upsert: true }
      );
    }
  }

  async removePortfolioItem(userId: string, symbol: string, quantity: number) {
    const investment = await this.findByUserId(userId);
    const item = investment.portfolio.find((p: any) => p.symbol === symbol);

    if (!item) {
      throw new Error('Item not found in portfolio');
    }

    if (quantity >= item.quantity) {
      // Remove entire item
      return await Investment.findOneAndUpdate(
        { userId },
        { $pull: { portfolio: { symbol } } },
        { new: true }
      );
    } else {
      // Partial sell
      const newQuantity = item.quantity - quantity;
      return await Investment.findOneAndUpdate(
        { userId, 'portfolio.symbol': symbol },
        { $set: { 'portfolio.$.quantity': newQuantity } },
        { new: true }
      );
    }
  }

  async updatePortfolioItem(userId: string, symbol: string, updates: any) {
    return await Investment.findOneAndUpdate(
      { userId, 'portfolio.symbol': symbol },
      { $set: updates },
      { new: true }
    );
  }

  async updatePortfolioPrices(userId: string, prices: { symbol: string; price: number }[]) {
    const investment = await this.findByUserId(userId);
    const portfolio = investment.portfolio;

    portfolio.forEach((item: any) => {
      const priceUpdate = prices.find(p => p.symbol === item.symbol);
      if (priceUpdate) {
        item.currentPrice = priceUpdate.price;
      }
    });

    return await Investment.findOneAndUpdate(
      { userId },
      { portfolio },
      { new: true }
    );
  }
}
