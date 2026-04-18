import User from '../models/User';
import { IUser } from '../types';

export class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }) as IUser | null;
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id) as IUser | null;
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    return await User.create(userData) as IUser;
  }

  async findAll(): Promise<IUser[]> {
    return await User.find() as IUser[];
  }
}
