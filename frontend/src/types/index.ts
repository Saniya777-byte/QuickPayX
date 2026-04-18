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
}

export interface AddMoneyData {
  amount: number;
}
