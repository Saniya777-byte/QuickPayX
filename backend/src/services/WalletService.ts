import { WalletRepository } from "../repositories/WalletRepository";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { IWallet } from "../types";
import { Types } from "mongoose";

class WalletService {
  private walletRepository = new WalletRepository();
  private transactionRepository = new TransactionRepository();

  async getWallet(userId: string): Promise<IWallet> {
    let wallet = await this.walletRepository.findByUserId(userId);

    if (!wallet) {
      wallet = await this.walletRepository.create({ userId: new Types.ObjectId(userId), balance: 0 });
    }

    return wallet;
  }

  async addMoney(userId: string, amount: number): Promise<IWallet> {
    const wallet = await this.walletRepository.updateBalance(userId, amount);

    if (!wallet) {
      throw new Error("Failed to add money");
    }

    return wallet;
  }

  async getAnalytics(userId: string) {
    const transactions = await this.transactionRepository.findByUserId(userId);
    
    const totalSent = transactions
      .filter((tx: any) => tx.sender?._id.toString() === userId && tx.status === 'completed')
      .reduce((sum: number, tx: any) => sum + tx.amount, 0);
    
    const totalReceived = transactions
      .filter((tx: any) => tx.receiver?._id.toString() === userId && tx.status === 'completed')
      .reduce((sum: number, tx: any) => sum + tx.amount, 0);
    
    const transactionCount = transactions.filter((tx: any) => tx.status === 'completed').length;
    
    return {
      totalSent,
      totalReceived,
      transactionCount
    };
  }
}

export default new WalletService();