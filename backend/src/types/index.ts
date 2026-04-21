import { Request } from 'express';

export interface IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
  bankBalance: number;
  transactionPin?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IWallet {
  id?: string;
  userId: string;
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export type TransactionStatusType = 'pending' | 'completed' | 'failed';

export interface ITransaction {
  id?: string;
  senderId?: string;
  receiverId?: string;
  sender?: any;
  receiver?: any;
  amount: number;
  status?: TransactionStatusType;
  category?: string;
  description?: string;
  isSuspicious?: boolean;
  fraudReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAuthResponse {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IAddMoneyRequest {
  amount: number;
}

export interface ITransferRequest {
  receiverId: string;
  amount: number;
}

export interface IRequestWithUser extends Request {
  user?: string;
}
