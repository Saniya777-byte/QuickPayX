'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { apiService } from '../../../services/api';
import { Wallet, Transaction } from '../../../types';
import AppLayout from '../../../components/AppLayout';
import { 
  CreditCard, ArrowUpRight, ArrowDownRight, TrendingUp, 
  Activity, Banknote, Send, BarChart2
} from 'lucide-react';

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
      const [walletData, transactionsData, analyticsData] = await Promise.all([
        apiService.getWallet(),
        apiService.getTransactionHistory(),
        apiService.getAnalytics(),
      ]);
      setWallet(walletData);
      setTransactions(transactionsData);
      setAnalytics(analyticsData);
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
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  const recentTransactions = transactions.slice(0, 5);

  const statCards = [
    {
      label: 'Wallet Balance',
      value: `$${(wallet?.balance ?? 0).toFixed(2)}`,
      sub: 'Available for transfers',
      icon: <CreditCard className="w-5 h-5" />,
      gradient: 'from-emerald-500/20 to-emerald-600/10',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      valueColor: 'text-white',
    },
    {
      label: 'Bank Balance',
      value: `$${(wallet?.bankBalance ?? 0).toFixed(2)}`,
      sub: 'Linked bank account',
      icon: <Banknote className="w-5 h-5" />,
      gradient: 'from-blue-500/20 to-blue-600/10',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      valueColor: 'text-blue-300',
    },
    {
      label: 'Total Sent',
      value: `$${(analytics?.totalSent ?? 0).toFixed(2)}`,
      sub: `${analytics?.transactionCount ?? 0} total transactions`,
      icon: <ArrowUpRight className="w-5 h-5" />,
      gradient: 'from-red-500/20 to-red-600/10',
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-400',
      valueColor: 'text-red-300',
    },
    {
      label: 'Total Received',
      value: `$${(analytics?.totalReceived ?? 0).toFixed(2)}`,
      sub: 'Money received',
      icon: <ArrowDownRight className="w-5 h-5" />,
      gradient: 'from-purple-500/20 to-purple-600/10',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
      valueColor: 'text-purple-300',
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
            <p className="text-gray-400">Here's your financial overview</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/transfer')}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              <Send className="w-4 h-4" />
              Send Money
            </button>
            <button
              onClick={() => router.push('/invest')}
              className="flex items-center gap-2 bg-gray-800/80 hover:bg-gray-700/80 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all border border-gray-700/50"
            >
              <TrendingUp className="w-4 h-4" />
              Invest
            </button>
          </div>
        </div>

        {/* Stat Cards Grid — 4 cards, no duplication */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {statCards.map((card, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${card.gradient} bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800/60 hover:border-gray-700/60 transition-all group`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${card.iconBg} rounded-xl flex items-center justify-center ${card.iconColor}`}>
                  {card.icon}
                </div>
                <Activity className="w-4 h-4 text-gray-600 group-hover:text-gray-500 transition-colors" />
              </div>
              <p className="text-gray-400 text-sm mb-1">{card.label}</p>
              <p className={`text-2xl font-bold ${card.valueColor} mb-1`}>{card.value}</p>
              <p className="text-gray-500 text-xs">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Bottom: Recent Transactions + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800/60">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <BarChart2 className="w-4 h-4 text-emerald-400" />
                </div>
                <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
              </div>
              <button
                onClick={() => router.push('/transactions')}
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center gap-1 transition-colors"
              >
                View All
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-500 font-medium">No transactions yet</p>
                <p className="text-gray-600 text-sm mt-1">Send money to see your history</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((tx) => {
                  const isSent = tx.sender?._id === user?._id;
                  return (
                    <div key={tx._id} className="flex items-center justify-between p-3.5 bg-gray-900/40 rounded-xl border border-gray-800/40 hover:border-gray-700/50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isSent ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                          {isSent 
                            ? <ArrowUpRight className="w-4 h-4 text-red-400" />
                            : <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                          }
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {isSent ? `To: ${tx.receiver?.name}` : `From: ${tx.sender?.name}`}
                          </p>
                          <p className="text-gray-500 text-xs">{new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-sm ${isSent ? 'text-red-400' : 'text-emerald-400'}`}>
                          {isSent ? '-' : '+'}${tx.amount.toFixed(2)}
                        </p>
                        <span className={`text-xs ${tx.status === 'completed' ? 'text-emerald-500' : 'text-gray-500'}`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white px-1">Quick Actions</h2>
            {[
              { label: 'Send Money', desc: 'Transfer to another user', icon: <Send className="w-5 h-5" />, href: '/transfer', color: 'emerald' },
              { label: 'Paper Trading', desc: 'Practice investing', icon: <TrendingUp className="w-5 h-5" />, href: '/invest', color: 'blue' },
              { label: 'My Portfolio', desc: 'View your holdings', icon: <BarChart2 className="w-5 h-5" />, href: '/portfolio', color: 'purple' },
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => router.push(action.href)}
                className="w-full flex items-center gap-4 p-4 bg-[#1a1f2e] rounded-xl border border-gray-800/60 hover:border-gray-600/60 transition-all group text-left"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  action.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20' :
                  action.color === 'blue' ? 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20' :
                  'bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20'
                } transition-colors`}>
                  {action.icon}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{action.label}</p>
                  <p className="text-gray-500 text-xs">{action.desc}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 ml-auto transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
