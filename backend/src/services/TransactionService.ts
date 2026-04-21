import { prisma } from "../lib/prisma";
import { WalletRepository } from "../repositories/WalletRepository";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { UserRepository } from "../repositories/UserRepository";
import { ITransaction, TransactionStatusType } from "../types";
import { detectFraud, categorizeTransaction } from "./aiCategorization";

class TransactionService {
  private walletRepository = new WalletRepository();
  private transactionRepository = new TransactionRepository();
  private userRepository = new UserRepository();

  async transferMoney(
    senderId: string, 
    receiverId: string, 
    amount: number,
    description?: string,
    category?: string,
    skipFraudCheck = false
  ): Promise<ITransaction> {
    if (senderId === receiverId) {
      throw new Error("Cannot send money to yourself");
    }

    if (amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    // Check if receiver exists
    const receiver = await this.userRepository.findById(receiverId);
    if (!receiver) {
      throw new Error("Receiver not found");
    }

    // Get sender's transaction history for fraud detection
    const senderTransactions = await this.transactionRepository.findByUserId(senderId);
    const senderSentTransactions = senderTransactions
      .filter(t => t.status === 'completed' && t.senderId === senderId)
      .map(t => t.amount);
    
    const senderAvgAmount = senderSentTransactions.length > 0 
      ? senderSentTransactions.reduce((sum, a) => sum + a, 0) / senderSentTransactions.length 
      : 0;

    // Check if recipient is new
    const previousTransactionsToReceiver = senderTransactions.filter(
      t => t.receiverId === receiverId && t.status === 'completed'
    );
    const isNewRecipient = previousTransactionsToReceiver.length === 0;

    // Run fraud detection
    const fraudResult = detectFraud(amount, senderAvgAmount, isNewRecipient, senderSentTransactions);
    
    if (!skipFraudCheck && fraudResult.isSuspicious) {
      throw new Error(`Suspicious transaction detected: ${fraudResult.reason}. Please confirm if you want to proceed.`);
    }

    // Auto-categorize if not provided
    const finalCategory = category || categorizeTransaction(description || '');

    try {
      const transaction = await prisma.$transaction(async (tx) => {
        const senderWallet = await tx.wallet.findUnique({ where: { userId: senderId } });
        if (!senderWallet || senderWallet.balance < amount) {
          throw new Error("Insufficient balance");
        }

        let receiverWallet = await tx.wallet.findUnique({ where: { userId: receiverId } });
        if (!receiverWallet) {
          // Create receiver wallet with 0 balance if it doesn't exist
          receiverWallet = await tx.wallet.create({
            data: { userId: receiverId, balance: 0 }
          });
        }

        // Deduct from sender
        await tx.wallet.update({
          where: { userId: senderId },
          data: { balance: senderWallet.balance - amount }
        });

        // Add to receiver
        await tx.wallet.update({
          where: { userId: receiverId },
          data: { balance: receiverWallet.balance + amount }
        });

        // Create transaction with completed status
        const newTransaction = await tx.transaction.create({
          data: {
            senderId,
            receiverId,
            amount,
            status: 'completed',
            category: finalCategory as any,
            description: description || '',
            isSuspicious: fraudResult.isSuspicious,
            fraudReason: fraudResult.isSuspicious ? fraudResult.reason : undefined,
          }
        });

        return newTransaction;
      });

      return transaction as ITransaction;
    } catch (error: any) {
      throw error;
    }
  }

  async getTransactionHistory(userId: string): Promise<ITransaction[]> {
    return await this.transactionRepository.findByUserId(userId);
  }
}

export default new TransactionService();