'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Transaction } from '../../types';
import AppLayout from '../../components/AppLayout';
import { Receipt, ArrowUpRight, ArrowDownRight, Calendar, Search, Filter, TrendingUp, TrendingDown } from 'lucide-react';

export default function TransactionsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/'); return; }
    loadTransactions();
  }, [user, authLoading, router]);

  const loadTransactions = async () => {
    try {
      const data = await apiService.getTransactionHistory();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const groupTransactions = (txs: Transaction[]) => {
    const groups: { [key: string]: Transaction[] } = {};
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);

    txs.forEach(tx => {
      const txDate = new Date(tx.createdAt); txDate.setHours(0, 0, 0, 0);
      let groupKey = '';
      if (txDate.getTime() === today.getTime()) groupKey = 'Today';
      else if (txDate.getTime() === yesterday.getTime()) groupKey = 'Yesterday';
      else groupKey = txDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(tx);
    });
    return groups;
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter =
      filter === 'all' ? true :
      filter === 'sent' ? tx.sender?.id === user?.id :
      tx.receiver?.id === user?.id;

    const query = searchQuery.toLowerCase();
    const matchesSearch = !query || (
      tx.sender?.name?.toLowerCase().includes(query) ||
      tx.receiver?.name?.toLowerCase().includes(query) ||
      tx.amount.toString().includes(query) ||
      tx.category?.toLowerCase().includes(query)
    );
    return matchesFilter && matchesSearch;
  });

  const groupedTransactions = groupTransactions(filteredTransactions);

  // Summary stats
  const sentTotal = transactions
    .filter(tx => tx.sender?.id === user?.id)
    .reduce((s, tx) => s + tx.amount, 0);
  const receivedTotal = transactions
    .filter(tx => tx.receiver?.id === user?.id)
    .reduce((s, tx) => s + tx.amount, 0);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Transactions</h1>
          <p className="text-gray-400">Your complete payment history</p>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-[#1a1f2e] rounded-2xl p-5 border border-gray-800/60 flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-700/40 rounded-xl flex items-center justify-center">
              <Receipt className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-gray-500 text-xs">Total Transactions</p>
              <p className="text-xl font-bold text-white">{transactions.length}</p>
            </div>
          </div>
          <div className="bg-[#1a1f2e] rounded-2xl p-5 border border-gray-800/60 flex items-center gap-4">
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-gray-500 text-xs">Total Sent</p>
              <p className="text-xl font-bold text-red-400">${sentTotal.toFixed(2)}</p>
            </div>
          </div>
          <div className="bg-[#1a1f2e] rounded-2xl p-5 border border-gray-800/60 flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-gray-500 text-xs">Total Received</p>
              <p className="text-xl font-bold text-emerald-400">${receivedTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Filters & Search bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-[#1a1f2e] rounded-xl p-1 border border-gray-800/60">
            {(['all', 'sent', 'received'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  filter === f
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or amount..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#1a1f2e] border border-gray-800/60 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <p className="text-gray-500 text-sm ml-auto">
            {filteredTransactions.length} result{filteredTransactions.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Transactions */}
        {filteredTransactions.length === 0 ? (
          <div className="bg-[#1a1f2e] rounded-2xl p-16 border border-gray-800/60 text-center">
            <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-10 h-10 text-gray-600" />
            </div>
            <p className="text-gray-400 text-lg font-medium">
              {searchQuery ? 'No results found' : 'No transactions yet'}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              {searchQuery ? 'Try a different search term' : 'Your transaction history will appear here'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => router.push('/transfer')}
                className="mt-5 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2"
              >
                Send Your First Transaction
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTransactions).map(([group, txs]) => (
              <div key={group}>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <h3 className="text-gray-500 text-sm font-semibold">{group}</h3>
                  <div className="flex-1 h-px bg-gray-800/60" />
                  <span className="text-gray-600 text-xs">{txs.length} tx{txs.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="space-y-2">
                  {txs.map((tx) => {
                    const isSent = tx.sender?.id === user?.id;
                    return (
                      <div
                        key={tx.id}
                        className="bg-[#1a1f2e] rounded-xl p-4 border border-gray-800/50 hover:border-gray-700/60 transition-all flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isSent ? 'bg-red-500/10' : 'bg-emerald-500/10'
                          }`}>
                            {isSent
                              ? <ArrowUpRight className="w-5 h-5 text-red-400" />
                              : <ArrowDownRight className="w-5 h-5 text-emerald-400" />
                            }
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-medium text-sm truncate">
                              {isSent ? `To: ${tx.receiver?.name || 'Unknown'}` : `From: ${tx.sender?.name || 'Unknown'}`}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {new Date(tx.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {tx.category && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-gray-800/60 text-gray-400 text-xs rounded-md capitalize">
                                {tx.category}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`text-lg font-bold ${isSent ? 'text-red-400' : 'text-emerald-400'}`}>
                            {isSent ? '-' : '+'}${tx.amount.toFixed(2)}
                          </p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            tx.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : tx.status === 'failed'
                              ? 'bg-red-500/10 text-red-400'
                              : 'bg-gray-700/40 text-gray-500'
                          }`}>
                            {tx.status}
                          </span>
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
