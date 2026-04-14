import Wallet from "../models/Wallet";

class WalletService {
  async getWallet(userId: string) {
    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      wallet = await Wallet.create({ userId });
    }

    return wallet;
  }

  async addMoney(userId: string, amount: number) {
    const wallet = await Wallet.findOneAndUpdate(
      { userId },
      { $inc: { balance: amount } },
      { new: true, upsert: true }
    );

    return wallet;
  }
}

export default new WalletService();