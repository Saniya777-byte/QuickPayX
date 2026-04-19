export interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface Wallet {
  _id: string;
  userId: string;
  balance: number;
  bankBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  _id: string;
  sender?: {
    _id: string;
    name: string;
    email: string;
  };
  receiver?: {
    _id: string;
    name: string;
    email: string;
  };
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  category?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface TransferData {
  receiverId: string;
  amount: number;
  skipFraudCheck?: boolean;
}

export interface AddMoneyData {
  amount: number;
}

export interface SearchResult {
  _id: string;
  name: string;
  email: string;
}
