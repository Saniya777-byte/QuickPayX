import SavingsGoalRepository from "../repositories/SavingsGoalRepository";

class SavingsGoalService {
  async createGoal(userId: string, name: string, targetAmount: number, deadline?: Date, category?: string) {
    return await SavingsGoalRepository.create({
      userId,
      name,
      targetAmount,
      currentAmount: 0,
      deadline,
      category: category || 'other',
      status: 'active'
    });
  }

  async getUserGoals(userId: string) {
    return await SavingsGoalRepository.findByUserId(userId);
  }

  async updateGoal(goalId: string, updates: any) {
    return await SavingsGoalRepository.update(goalId, updates);
  }

  async deleteGoal(goalId: string) {
    return await SavingsGoalRepository.delete(goalId);
  }

  async addProgress(goalId: string, amount: number) {
    return await SavingsGoalRepository.addProgress(goalId, amount);
  }

  async getGoalSummary(userId: string) {
    const goals = await this.getUserGoals(userId);
    
    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const activeGoals = goals.filter(g => g.status === 'active').length;
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    
    return {
      totalGoals: goals.length,
      activeGoals,
      completedGoals,
      totalTarget,
      totalSaved,
      overallProgress: totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(1) : 0
    };
  }
}

export default new SavingsGoalService();
