import Transaction from '../models/Transaction';
import { ITransaction, TransactionStatusType } from '../types';

export class TransactionRepository {
  async create(transactionData: Partial<ITransaction>): Promise<ITransaction> {
    return await Transaction.create(transactionData) as ITransaction;
  }

  async findById(id: string): Promise<ITransaction | null> {
    return await Transaction.findById(id).populate('sender', 'name email').populate('receiver', 'name email') as ITransaction | null;
  }

  async findByUserId(userId: string): Promise<ITransaction[]> {
    return await Transaction.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
    .populate('sender', 'name email')
    .populate('receiver', 'name email')
    .sort({ createdAt: -1 }) as ITransaction[];
  }

  async updateStatus(id: string, status: TransactionStatusType): Promise<ITransaction | null> {
    return await Transaction.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ) as ITransaction | null;
  }

  async findAll(): Promise<ITransaction[]> {
    return await Transaction.find()
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: -1 }) as ITransaction[];
  }

  async getRecentTransactionsByUser(userId: string): Promise<ITransaction[]> {
    return await Transaction.find({
      $or: [{ sender: userId }, { receiver: userId }],
      status: 'completed'
    })
    .populate('sender', 'name email')
    .populate('receiver', 'name email')
    .sort({ createdAt: -1 })
    .limit(20) as ITransaction[];
  }
}
