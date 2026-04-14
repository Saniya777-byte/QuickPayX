import Wallet from "../models/Wallet";
import Transaction from "../models/Transaction";

class TransactionService {
  async transferMoney(senderId: string, receiverId: string, amount: number) {
    if (senderId === receiverId) {
      throw new Error("Cannot send money to yourself");
    }

    const senderWallet = await Wallet.findOne({ userId: senderId });
    if (!senderWallet || senderWallet.balance < amount) {
      throw new Error("Insufficient balance");
    }

    const receiverWallet = await Wallet.findOne({ userId: receiverId });
    if (!receiverWallet) {
      throw new Error("Receiver not found");
    }

    // Deduct from sender
    senderWallet.balance -= amount;
    await senderWallet.save();

    // Add to receiver
    receiverWallet.balance += amount;
    await receiverWallet.save();

    // Save transaction
    const transaction = await Transaction.create({
      sender: senderId,
      receiver: receiverId,
      amount,
    });

    return transaction;
  }
}

export default new TransactionService();