import mongoose from "mongoose";
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
      .filter(t => t.status === 'completed' && t.sender.toString() === senderId)
      .map(t => t.amount);
    
    const senderAvgAmount = senderSentTransactions.length > 0 
      ? senderSentTransactions.reduce((sum, a) => sum + a, 0) / senderSentTransactions.length 
      : 0;

    // Check if recipient is new
    const previousTransactionsToReceiver = senderTransactions.filter(
      t => t.receiver.toString() === receiverId && t.status === 'completed'
    );
    const isNewRecipient = previousTransactionsToReceiver.length === 0;

    // Run fraud detection
    const fraudResult = detectFraud(amount, senderAvgAmount, isNewRecipient, senderSentTransactions);
    
    if (!skipFraudCheck && fraudResult.isSuspicious) {
      throw new Error(`Suspicious transaction detected: ${fraudResult.reason}. Please confirm if you want to proceed.`);
    }

    // Auto-categorize if not provided
    const finalCategory = category || categorizeTransaction(description || '');

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const senderWallet = await this.walletRepository.findByUserId(senderId);
      if (!senderWallet || senderWallet.balance < amount) {
        throw new Error("Insufficient balance");
      }

      const receiverWallet = await this.walletRepository.findByUserId(receiverId);
      if (!receiverWallet) {
        throw new Error("Receiver wallet not found");
      }

      // Deduct from sender
      await this.walletRepository.setBalance(senderId, senderWallet.balance - amount);

      // Add to receiver
      await this.walletRepository.setBalance(receiverId, receiverWallet.balance + amount);

      // Create transaction with completed status
      const transaction = await this.transactionRepository.create({
        sender: new mongoose.Types.ObjectId(senderId),
        receiver: new mongoose.Types.ObjectId(receiverId),
        amount,
        status: 'completed' as TransactionStatusType,
        category: finalCategory,
        description: description || '',
        isSuspicious: fraudResult.isSuspicious,
        fraudReason: fraudResult.isSuspicious ? fraudResult.reason : undefined,
      });

      await session.commitTransaction();
      session.endSession();

      return transaction;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getTransactionHistory(userId: string): Promise<ITransaction[]> {
    return await this.transactionRepository.findByUserId(userId);
  }
}

export default new TransactionService();