import { prisma } from '../lib/prisma';
import { IUser } from '../types';

export class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user as IUser | null;
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user as IUser | null;
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = await prisma.user.create({ 
      data: userData as any,
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        bankBalance: true,
        transactionPin: true,
        createdAt: true,
        updatedAt: true
      }
    });
    return user as IUser;
  }

  async findAll(): Promise<IUser[]> {
    const users = await prisma.user.findMany();
    return users as IUser[];
  }

  async searchByNameOrEmail(query: string, excludeUserId: string): Promise<IUser[]> {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } }
            ]
          },
          { id: { not: excludeUserId } }
        ]
      },
      select: { id: true, name: true, email: true },
      take: 10
    });
    return users as IUser[];
  }

  async findByIds(ids: string[]): Promise<IUser[]> {
    const users = await prisma.user.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true, email: true }
    });
    return users as IUser[];
  }

  async findAllExcept(excludeUserId: string): Promise<IUser[]> {
    const users = await prisma.user.findMany({
      where: { id: { not: excludeUserId } },
      select: { id: true, name: true, email: true },
      take: 50
    });
    return users as IUser[];
  }

  async updateBankBalance(userId: string, newBalance: number): Promise<IUser | null> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { bankBalance: newBalance }
    });
    return user as IUser | null;
  }

  async update(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData as any
    });
    return user as IUser | null;
  }
}
