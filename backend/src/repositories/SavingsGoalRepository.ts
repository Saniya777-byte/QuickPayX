import SavingsGoal from "../models/SavingsGoal";

class SavingsGoalRepository {
  async findByUserId(userId: string) {
    return await SavingsGoal.find({ userId }).sort({ createdAt: -1 });
  }

  async findById(id: string) {
    return await SavingsGoal.findById(id);
  }

  async create(data: any) {
    return await SavingsGoal.create(data);
  }

  async update(id: string, data: any) {
    return await SavingsGoal.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return await SavingsGoal.findByIdAndDelete(id);
  }

  async addProgress(id: string, amount: number) {
    const goal = await SavingsGoal.findById(id);
    if (!goal) {
      throw new Error('Savings goal not found');
    }
    goal.currentAmount += amount;
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = 'completed';
    }
    return await goal.save();
  }
}

export default new SavingsGoalRepository();
