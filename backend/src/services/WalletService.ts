import { WalletRepository } from "../repositories/WalletRepository";
import { IWallet } from "../types";
import { Types } from "mongoose";

class WalletService {
  private walletRepository = new WalletRepository();

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
}

export default new WalletService();