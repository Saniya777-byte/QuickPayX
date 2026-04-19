import { WalletRepository } from "../repositories/WalletRepository";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { UserRepository } from "../repositories/UserRepository";
import { IWallet } from "../types";
import { Types } from "mongoose";

class WalletService {
  private walletRepository = new WalletRepository();
  private transactionRepository = new TransactionRepository();
  private userRepository = new UserRepository();

  async getWallet(userId: string): Promise<IWallet> {
    let wallet = await this.walletRepository.findByUserId(userId);

    if (!wallet) {
      wallet = await this.walletRepository.create({ userId: new Types.ObjectId(userId), balance: 20000 });
    }

    return wallet;
  }

  async addMoney(userId: string, amount: number): Promise<IWallet> {
    // Get user's bank balance
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new Error("User not found");
    }

    // Validate sufficient bank balance
    if (user.bankBalance < amount) {
      throw new Error("Insufficient bank balance");
    }

    // Deduct from bank balance
    await this.userRepository.updateBankBalance(userId, user.bankBalance - amount);

    // Add to wallet balance
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