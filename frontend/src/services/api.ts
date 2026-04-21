import { User, Wallet, Transaction, RegisterData, LoginData, TransferData, AddMoneyData } from '../types';

interface SearchResult {
  id: string;
  name: string;
  email: string;
}

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

  async searchUsers(query: string): Promise<SearchResult[]> {
    return this.request<SearchResult[]>(`/user/search?q=${encodeURIComponent(query)}`);
  }

  async getRecentUsers(): Promise<SearchResult[]> {
    return this.request<SearchResult[]>('/user/recent');
  }

  async getAllUsers(): Promise<SearchResult[]> {
    return this.request<SearchResult[]>('/user/all');
  }

  async getAnalytics(): Promise<{ totalSent: number; totalReceived: number; transactionCount: number }> {
    return this.request<{ totalSent: number; totalReceived: number; transactionCount: number }>('/wallet/analytics');
  }

  // Analytics endpoints
  async getAnalyticsSummary() {
    return this.request('/analytics/summary');
  }

  async getSpendingByCategory() {
    return this.request('/analytics/spending-by-category');
  }

  async getMonthlyTrends(months?: number) {
    const query = months ? `?months=${months}` : '';
    return this.request(`/analytics/monthly-trends${query}`);
  }

  async getAnalyticsInsights() {
    return this.request('/analytics/insights');
  }

  async getTopContacts(limit?: number) {
    const query = limit ? `?limit=${limit}` : '';
    return this.request(`/analytics/top-contacts${query}`);
  }

  // Savings Goals endpoints
  async createGoal(data: { name: string; targetAmount: number; deadline?: string; category?: string }) {
    return this.request('/savings-goals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSavingsGoals() {
    return this.request('/savings-goals');
  }

  async getSavingsGoalSummary() {
    return this.request('/savings-goals/summary');
  }

  async updateGoal(id: string, data: any) {
    return this.request(`/savings-goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteGoal(id: string) {
    return this.request(`/savings-goals/${id}`, {
      method: 'DELETE',
    });
  }

  async addGoalProgress(id: string, amount: number) {
    return this.request(`/savings-goals/${id}/progress`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  // Investment endpoints
  async getInvestment() {
    return this.request('/investment');
  }

  async buyStock(symbol: string, name: string, quantity: number, price: number) {
    return this.request('/investment/buy', {
      method: 'POST',
      body: JSON.stringify({ symbol, name, quantity, price }),
    });
  }

  async sellStock(symbol: string, quantity: number, price: number) {
    return this.request('/investment/sell', {
      method: 'POST',
      body: JSON.stringify({ symbol, quantity, price }),
    });
  }

  async getPortfolioSummary() {
    return this.request('/investment/portfolio-summary');
  }

  // Financial Insights endpoints
  async getInsights() {
    return this.request('/insights');
  }

  async askInsightQuery(query: string) {
    return this.request('/insights/query', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }

  // Security endpoints
  async setTransactionPin(pin: string) {
    return this.request('/security/pin', {
      method: 'POST',
      body: JSON.stringify({ pin }),
    });
  }

  async validateTransactionPin(pin: string) {
    return this.request('/security/pin/validate', {
      method: 'POST',
      body: JSON.stringify({ pin }),
    });
  }
}

export const apiService = new ApiService();
