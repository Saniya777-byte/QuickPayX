import { prisma } from '../lib/prisma';
import { ITransaction, TransactionStatusType } from '../types';

export class TransactionRepository {
  async create(transactionData: Partial<ITransaction>): Promise<ITransaction> {
    const transaction = await prisma.transaction.create({ data: transactionData as any });
    return transaction as ITransaction;
  }

  async findById(id: string): Promise<ITransaction | null> {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { sender: { select: { id: true, name: true, email: true } }, receiver: { select: { id: true, name: true, email: true } } }
    });
    return transaction as ITransaction | null;
  }

  async findByUserId(userId: string): Promise<ITransaction[]> {
    const transactions = await prisma.transaction.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      include: { sender: { select: { id: true, name: true, email: true } }, receiver: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return transactions as ITransaction[];
  }

  async updateStatus(id: string, status: TransactionStatusType): Promise<ITransaction | null> {
    const transaction = await prisma.transaction.update({
      where: { id },
      data: { status: status as any }
    });
    return transaction as ITransaction | null;
  }

  async findAll(): Promise<ITransaction[]> {
    const transactions = await prisma.transaction.findMany({
      include: { sender: { select: { id: true, name: true, email: true } }, receiver: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return transactions as ITransaction[];
  }

  async getRecentTransactionsByUser(userId: string): Promise<ITransaction[]> {
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
        status: 'completed'
      },
      include: { sender: { select: { id: true, name: true, email: true } }, receiver: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    return transactions as ITransaction[];
  }
}
