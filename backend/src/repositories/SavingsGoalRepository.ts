import { prisma } from '../lib/prisma';

class SavingsGoalRepository {
  async findByUserId(userId: string) {
    return await prisma.savingsGoal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: string) {
    return await prisma.savingsGoal.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.savingsGoal.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.savingsGoal.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return await prisma.savingsGoal.delete({ where: { id } });
  }

  async addProgress(id: string, amount: number) {
    const goal = await prisma.savingsGoal.findUnique({ where: { id } });
    if (!goal) {
      throw new Error('Savings goal not found');
    }
    const newAmount = goal.currentAmount + amount;
    const newStatus = newAmount >= goal.targetAmount ? 'completed' : goal.status;
    return await prisma.savingsGoal.update({
      where: { id },
      data: {
        currentAmount: newAmount,
        status: newStatus
      }
    });
  }
}

export default new SavingsGoalRepository();
