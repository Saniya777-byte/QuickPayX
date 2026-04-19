'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Wallet } from '../../types';
import AppLayout from '../../components/AppLayout';
import { CreditCard, ArrowUpRight, Info } from 'lucide-react';

export default function WalletPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/');
      return;
    }
    loadWallet();
  }, [user, authLoading, router]);

  const loadWallet = async () => {
    try {
      const walletData = await apiService.getWallet();
      setWallet(walletData);
    } catch (error) {
      console.error('Error loading wallet:', error);
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

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Wallet</h1>
          <p className="text-gray-400">Your trading capital for investments</p>
        </div>

        {/* Wallet Balance Card */}
        <div className="bg-[#1a1f2e] rounded-2xl p-8 shadow-lg border border-gray-800/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Trading Balance</p>
              <p className="text-4xl font-bold text-white">${wallet?.balance?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Available for Trading</span>
              <span className="text-white font-medium">${wallet?.balance?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Status</span>
              <span className="text-emerald-400 font-medium">Active</span>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">How it works</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• Your wallet balance is your trading capital</li>
                <li>• Use this balance to buy and sell stocks</li>
                <li>• Start with $20,000 to build your portfolio</li>
                <li>• Track your performance in the Portfolio section</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => router.push('/portfolio')}
            className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50 hover:border-emerald-500/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-all">
                <ArrowUpRight className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">Go to Portfolio</p>
                <p className="text-gray-400 text-sm">View and manage your investments</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/news')}
            className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50 hover:border-blue-500/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-all">
                <Info className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">Market News</p>
                <p className="text-gray-400 text-sm">Stay updated with market trends</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
