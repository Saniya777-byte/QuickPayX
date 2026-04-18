import { UserRepository } from "../repositories/UserRepository";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { IUser } from "../types";

class UserService {
  private userRepository = new UserRepository();
  private transactionRepository = new TransactionRepository();

  async getAllUsers(currentUserId: string): Promise<IUser[]> {
    return this.userRepository.findAllExcept(currentUserId);
  }

  async searchUsers(query: string, currentUserId: string): Promise<IUser[]> {
    if (!query || query.length < 2) {
      return [];
    }

    return this.userRepository.searchByNameOrEmail(query, currentUserId);
  }

  async getRecentUsers(currentUserId: string): Promise<IUser[]> {
    const recentTransactions = await this.transactionRepository.getRecentTransactionsByUser(currentUserId);
    
    // Extract unique user IDs (excluding current user)
    const userIds = new Set<string>();
    recentTransactions.forEach((tx: any) => {
      if (tx.sender && tx.sender._id.toString() !== currentUserId) {
        userIds.add(tx.sender._id.toString());
      }
      if (tx.receiver && tx.receiver._id.toString() !== currentUserId) {
        userIds.add(tx.receiver._id.toString());
      }
    });

    // Fetch user details for unique IDs
    const users = await this.userRepository.findByIds(Array.from(userIds));
    return users;
  }
}

export default new UserService();
