import Wallet from '../models/Wallet';
import { IWallet } from '../types';

export class WalletRepository {
  async findByUserId(userId: string): Promise<IWallet | null> {
    return await Wallet.findOne({ userId }) as IWallet | null;
  }

  async create(walletData: Partial<IWallet>): Promise<IWallet> {
    return await Wallet.create(walletData) as IWallet;
  }

  async updateBalance(userId: string, amount: number): Promise<IWallet | null> {
    return await Wallet.findOneAndUpdate(
      { userId },
      { $inc: { balance: amount } },
      { new: true, upsert: true }
    ) as IWallet | null;
  }

  async setBalance(userId: string, balance: number): Promise<IWallet | null> {
    return await Wallet.findOneAndUpdate(
      { userId },
      { balance },
      { new: true, upsert: true }
    ) as IWallet | null;
  }

  async updateWallet(userId: string, updateData: Partial<IWallet>): Promise<IWallet | null> {
    return await Wallet.findOneAndUpdate(
      { userId },
      updateData,
      { new: true }
    ) as IWallet | null;
  }
}
