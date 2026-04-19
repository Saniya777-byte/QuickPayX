'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Transaction } from '../../types';
import AppLayout from '../../components/AppLayout';
import { Receipt, ArrowUpRight, ArrowDownRight, Calendar, Filter } from 'lucide-react';

export default function TransactionsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/');
      return;
    }
    loadTransactions();
  }, [user, authLoading, router]);

  const loadTransactions = async () => {
    try {
      const data = await apiService.getTransactionHistory();
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupTransactions = (txs: Transaction[]) => {
    const groups: { [key: string]: Transaction[] } = {};
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    txs.forEach(tx => {
      const txDate = new Date(tx.createdAt);
      txDate.setHours(0, 0, 0, 0);
      
      let groupKey = '';
      if (txDate.getTime() === today.getTime()) {
        groupKey = 'Today';
      } else if (txDate.getTime() === yesterday.getTime()) {
        groupKey = 'Yesterday';
      } else {
        groupKey = txDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(tx);
    });

    return groups;
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    if (filter === 'sent') return tx.sender?._id === user?._id;
    if (filter === 'received') return tx.receiver?._id === user?._id;
    return true;
  });

  const groupedTransactions = groupTransactions(filteredTransactions);

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Transactions</h1>
            <p className="text-gray-400">View your transaction history</p>
          </div>
          
          {/* Filter */}
          <div className="flex items-center gap-2 bg-[#1a1f2e] rounded-xl p-1 border border-gray-800/50">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'all' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('sent')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'sent' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Sent
            </button>
            <button
              onClick={() => setFilter('received')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'received' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Received
            </button>
          </div>
        </div>

        {/* Transactions */}
        {filteredTransactions.length === 0 ? (
          <div className="bg-[#1a1f2e] rounded-2xl p-12 shadow-lg border border-gray-800/50 text-center">
            <Receipt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No transactions found</p>
            <p className="text-gray-500 text-sm mt-2">Your transaction history will appear here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTransactions).map(([group, txs]) => (
              <div key={group}>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <h3 className="text-gray-400 font-medium">{group}</h3>
                </div>
                <div className="space-y-3">
                  {txs.map((tx) => {
                    const isSent = tx.sender?._id === user?._id;
                    return (
                      <div
                        key={tx._id}
                        className="bg-[#1a1f2e] rounded-xl p-4 border border-gray-800/50 hover:border-gray-700/50 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              isSent ? 'bg-red-500/10' : 'bg-emerald-500/10'
                            }`}>
                              {isSent ? (
                                <ArrowUpRight className="w-6 h-6 text-red-500" />
                              ) : (
                                <ArrowDownRight className="w-6 h-6 text-emerald-500" />
                              )}
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {isSent ? `To: ${tx.receiver?.name}` : `From: ${tx.sender?.name}`}
                              </p>
                              <p className="text-gray-500 text-sm">
                                {new Date(tx.createdAt).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              {tx.category && (
                                <span className="inline-block mt-1 px-2 py-0.5 bg-gray-800/50 text-gray-400 text-xs rounded-md">
                                  {tx.category}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-xl font-bold ${isSent ? 'text-red-400' : 'text-emerald-400'}`}>
                              {isSent ? '-' : '+'}${tx.amount.toFixed(2)}
                            </p>
                            <p className={`text-xs ${tx.status === 'completed' ? 'text-emerald-400' : 'text-gray-500'}`}>
                              {tx.status}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
