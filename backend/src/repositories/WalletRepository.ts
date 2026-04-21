import { prisma } from '../lib/prisma';
import { IWallet } from '../types';

export class WalletRepository {
  async findByUserId(userId: string): Promise<IWallet | null> {
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    return wallet as IWallet | null;
  }

  async create(walletData: Partial<IWallet>): Promise<IWallet> {
    const wallet = await prisma.wallet.upsert({
      where: { userId: walletData.userId! },
      update: walletData as any,
      create: walletData as any
    });
    return wallet as IWallet;
  }

  async updateBalance(userId: string, amount: number): Promise<IWallet | null> {
    const wallet = await prisma.wallet.upsert({
      where: { userId },
      update: { balance: { increment: amount } },
      create: { userId, balance: amount }
    });
    return wallet as IWallet | null;
  }

  async setBalance(userId: string, balance: number): Promise<IWallet | null> {
    const wallet = await prisma.wallet.upsert({
      where: { userId },
      update: { balance },
      create: { userId, balance }
    });
    return wallet as IWallet | null;
  }

  async updateWallet(userId: string, updateData: Partial<IWallet>): Promise<IWallet | null> {
    const wallet = await prisma.wallet.update({
      where: { userId },
      data: updateData as any
    });
    return wallet as IWallet | null;
  }
}
