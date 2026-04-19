'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { apiService } from '../../../services/api';
import { Wallet, Transaction } from '../../../types';
import AppLayout from '../../../components/AppLayout';
import AnalyticsCard from '../../../components/AnalyticsCard';
import FinancialInsights from '../../../components/FinancialInsights';
import AnalyticsDashboard from '../../../components/AnalyticsDashboard';
import FinancialChatbot from '../../../components/FinancialChatbot';
import { CreditCard, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface Insight {
  type: 'spending' | 'portfolio' | 'warning' | 'opportunity';
  title: string;
  description: string;
  metric?: string;
  trend?: 'up' | 'down' | 'neutral';
  priority: 'high' | 'medium' | 'low';
}

export default function DashboardOverview() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [analytics, setAnalytics] = useState<{ totalSent: number; totalReceived: number; transactionCount: number } | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/');
      return;
    }
    loadData();
  }, [user, authLoading, router]);

  const loadData = async () => {
    try {
      const [walletData, transactionsData, analyticsData, insightsData] = await Promise.all([
        apiService.getWallet(),
        apiService.getTransactionHistory(),
        apiService.getAnalytics(),
        apiService.getInsights()
      ]);
      setWallet(walletData);
      setTransactions(transactionsData);
      setAnalytics(analyticsData);
      setInsights((insightsData as { insights: Insight[] }).insights || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AppLayout>
    );
  }

  const recentTransactions = transactions.slice(0, 5);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-gray-400">Here's what's happening with your finances</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Wallet Balance</p>
                <p className="text-2xl font-bold text-white">${wallet?.balance?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm">Available for transfer</p>
          </div>

          <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Bank Balance</p>
                <p className="text-2xl font-bold text-emerald-400">${wallet?.bankBalance?.toFixed(2) || '10,000.00'}</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm">Available to add to wallet</p>
          </div>

          <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Sent</p>
                <p className="text-2xl font-bold text-white">${analytics?.totalSent?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm">{analytics?.transactionCount || 0} transactions</p>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnalyticsCard
            title="Total Sent"
            value={`$${analytics?.totalSent?.toFixed(2) || '0.00'}`}
            icon={<ArrowUpRight className="w-6 h-6" />}
            color="rose"
          />
          <AnalyticsCard
            title="Total Received"
            value={`$${analytics?.totalReceived?.toFixed(2) || '0.00'}`}
            icon={<ArrowDownRight className="w-6 h-6" />}
            color="emerald"
          />
          <AnalyticsCard
            title="Transactions"
            value={analytics?.transactionCount || 0}
            icon={<TrendingUp className="w-6 h-6" />}
            color="blue"
          />
        </div>

        {/* AI Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FinancialInsights insights={insights} />
          <FinancialChatbot />
        </div>

        {/* Analytics Dashboard */}
        <AnalyticsDashboard />

        {/* Recent Transactions */}
        <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
            <button
              onClick={() => router.push('/transactions')}
              className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
            >
              View All
            </button>
          </div>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map((tx) => {
                const isSent = tx.sender?._id === user?._id;
                return (
                  <div key={tx._id} className="flex items-center justify-between p-4 bg-gray-900/30 rounded-xl border border-gray-800/50">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSent ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                        {isSent ? <ArrowUpRight className="w-5 h-5 text-red-500" /> : <ArrowDownRight className="w-5 h-5 text-emerald-500" />}
                      </div>
                      <div>
                        <p className="text-white font-medium">{isSent ? `To: ${tx.receiver?.name}` : `From: ${tx.sender?.name}`}</p>
                        <p className="text-gray-500 text-sm">{new Date(tx.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`font-semibold ${isSent ? 'text-red-400' : 'text-emerald-400'}`}>
                      {isSent ? '-' : '+'}${tx.amount.toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
