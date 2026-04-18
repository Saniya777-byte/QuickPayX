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

  async searchByNameOrEmail(query: string, excludeUserId: string): Promise<IUser[]> {
    const regex = new RegExp(query, 'i');
    return await User.find({
      $and: [
        {
          $or: [
            { name: regex },
            { email: regex }
          ]
        },
        { _id: { $ne: excludeUserId } }
      ]
    })
    .select('_id name email')
    .limit(10) as IUser[];
  }

  async findByIds(ids: string[]): Promise<IUser[]> {
    return await User.find({ _id: { $in: ids } }).select('_id name email') as IUser[];
  }

  async findAllExcept(excludeUserId: string): Promise<IUser[]> {
    return await User.find({ _id: { $ne: excludeUserId } })
      .select('_id name email')
      .limit(50) as IUser[];
  }
}
