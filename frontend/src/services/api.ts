import { User, Wallet, Transaction, RegisterData, LoginData, TransferData, AddMoneyData } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'An error occurred');
    }

    return response.json();
  }

  async register(data: RegisterData): Promise<User> {
    return this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginData): Promise<User> {
    return this.request<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getWallet(): Promise<Wallet> {
    return this.request<Wallet>('/wallet');
  }

  async addMoney(data: AddMoneyData): Promise<Wallet> {
    return this.request<Wallet>('/wallet/add', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async transfer(data: TransferData): Promise<Transaction> {
    return this.request<Transaction>('/transaction/transfer', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTransactionHistory(): Promise<Transaction[]> {
    return this.request<Transaction[]>('/transaction/history');
  }
}

export const apiService = new ApiService();
