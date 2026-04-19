'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import AppLayout from '../../components/AppLayout';
import { CreditCard, ArrowUpRight, Info, Banknote, TrendingUp, RefreshCw, ArrowDownRight } from 'lucide-react';
import { Wallet } from '../../types';

export default function WalletPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [analytics, setAnalytics] = useState<{ totalSent: number; totalReceived: number; transactionCount: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/'); return; }
    loadData();
  }, [user, authLoading, router]);

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const [walletData, analyticsData] = await Promise.all([
        apiService.getWallet(),
        apiService.getAnalytics(),
      ]);
      setWallet(walletData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  const netFlow = (analytics?.totalReceived ?? 0) - (analytics?.totalSent ?? 0);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Wallet</h1>
            <p className="text-gray-400">Your trading capital and payment balance</p>
          </div>
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 px-3 py-2 rounded-xl border border-gray-700/50 text-sm transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Main balance cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Wallet Balance */}
          <div className="bg-gradient-to-br from-emerald-500/15 to-emerald-600/5 rounded-2xl p-7 border border-emerald-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-8 translate-x-8" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Wallet Balance</p>
                  <p className="text-gray-500 text-xs">For transfers</p>
                </div>
              </div>
              <p className="text-4xl font-black text-white mb-1">${(wallet?.balance ?? 0).toFixed(2)}</p>
              <p className="text-emerald-400/70 text-sm">Available for payments</p>
            </div>
          </div>

          {/* Bank Balance */}
          <div className="bg-gradient-to-br from-blue-500/15 to-blue-600/5 rounded-2xl p-7 border border-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-8 translate-x-8" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Banknote className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Bank Balance</p>
                  <p className="text-gray-500 text-xs">Linked account</p>
                </div>
              </div>
              <p className="text-4xl font-black text-blue-300 mb-1">${(wallet?.bankBalance ?? 0).toFixed(2)}</p>
              <p className="text-blue-400/70 text-sm">Linked bank account</p>
            </div>
          </div>
        </div>

        {/* Analytics mini-strip */}
        {analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#1a1f2e] rounded-xl p-4 border border-gray-800/50 flex items-center gap-3">
              <div className="w-9 h-9 bg-red-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <ArrowUpRight className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Total Sent</p>
                <p className="text-white font-bold">${analytics.totalSent.toFixed(2)}</p>
              </div>
            </div>
            <div className="bg-[#1a1f2e] rounded-xl p-4 border border-gray-800/50 flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <ArrowDownRight className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Total Received</p>
                <p className="text-white font-bold">${analytics.totalReceived.toFixed(2)}</p>
              </div>
            </div>
            <div className="bg-[#1a1f2e] rounded-xl p-4 border border-gray-800/50 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${netFlow >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                <TrendingUp className={`w-4 h-4 ${netFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Net Flow</p>
                <p className={`font-bold ${netFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {netFlow >= 0 ? '+' : ''}${netFlow.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800/60">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">How your wallet works</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 flex-shrink-0" />
                  Your <strong className="text-white">Wallet Balance</strong> is used for sending money to other users
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
                  Your <strong className="text-white">Bank Balance</strong> is your virtual linked bank account
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0" />
                  Use the <strong className="text-white">Invest</strong> section to trade stocks with your virtual balance
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 flex-shrink-0" />
                  All transactions are tracked in real-time on your dashboard
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <button
            onClick={() => router.push('/transfer')}
            className="bg-[#1a1f2e] rounded-2xl p-5 border border-gray-800/60 hover:border-emerald-500/30 transition-all group text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <ArrowUpRight className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-semibold">Send Money</p>
                <p className="text-gray-500 text-sm">Transfer to another user</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/invest')}
            className="bg-[#1a1f2e] rounded-2xl p-5 border border-gray-800/60 hover:border-blue-500/30 transition-all group text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-semibold">Paper Trading</p>
                <p className="text-gray-500 text-sm">Invest your virtual balance</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
