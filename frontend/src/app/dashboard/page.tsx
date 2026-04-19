'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Wallet, Transaction } from '../../types';
import UserSearch from '../../components/UserSearch';
import RecentUsers from '../../components/RecentUsers';
import AnalyticsCard from '../../components/AnalyticsCard';
import Toast from '../../components/Toast';
import { CreditCard, LogOut, User, ChevronDown, Home, Settings, ArrowUpRight, ArrowDownRight, Plus, Send, X, AlertCircle, Clock } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [analytics, setAnalytics] = useState<{ totalSent: number; totalReceived: number; transactionCount: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [balanceAnimating, setBalanceAnimating] = useState(false);
  
  // Add money state
  const [addAmount, setAddAmount] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  // Transfer state
  const [receiverId, setReceiverId] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState('');
  const [validationError, setValidationError] = useState('');

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Real-time validation for transfer form
  useEffect(() => {
    const errors: string[] = [];
    
    if (!receiverId) {
      errors.push('Please select a recipient');
    }
    
    if (!transferAmount) {
      errors.push('Please enter an amount');
    } else {
      const amount = parseFloat(transferAmount);
      if (isNaN(amount) || amount <= 0) {
        errors.push('Amount must be greater than 0');
      }
      if (wallet && amount > wallet.balance) {
        errors.push('Insufficient balance');
      }
    }
    
    setValidationError(errors[0] || '');
  }, [receiverId, transferAmount, wallet]);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }
    loadData();
  }, [user, authLoading, router]);

  const loadData = async () => {
    try {
      const [walletData, transactionsData, analyticsData] = await Promise.all([
        apiService.getWallet(),
        apiService.getTransactionHistory(),
        apiService.getAnalytics()
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

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    setAddLoading(true);

    try {
      const amount = parseFloat(addAmount);
      if (isNaN(amount) || amount <= 0) {
        setAddError('Please enter a valid amount');
        setAddLoading(false);
        return;
      }

      const updatedWallet = await apiService.addMoney({ amount });
      setWallet(updatedWallet);
      setAddAmount('');
      setBalanceAnimating(true);
      setTimeout(() => setBalanceAnimating(false), 500);
      setToast({ message: `Successfully added $${amount}`, type: 'success' });
    } catch (err: any) {
      setAddError(err.message);
      setToast({ message: err.message, type: 'error' });
    } finally {
      setAddLoading(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError('');
    setTransferLoading(true);

    try {
      const amount = parseFloat(transferAmount);
      if (isNaN(amount) || amount <= 0) {
        setTransferError('Please enter a valid amount');
        setTransferLoading(false);
        return;
      }

      if (!receiverId.trim()) {
        setTransferError('Please select a recipient');
        setTransferLoading(false);
        return;
      }

      await apiService.transfer({ receiverId, amount });
      setTransferAmount('');
      setReceiverId('');
      setReceiverName('');
      setValidationError('');
      setBalanceAnimating(true);
      setTimeout(() => setBalanceAnimating(false), 500);
      await loadData(); // Reload to get updated transactions
      setToast({ message: `Successfully transferred $${amount} to ${receiverName}`, type: 'success' });
    } catch (err: any) {
      setTransferError(err.message);
      setToast({ message: err.message, type: 'error' });
    } finally {
      setTransferLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Helper function to group transactions by date
  const groupTransactionsByDate = (transactions: Transaction[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups: { [key: string]: Transaction[] } = {
      'Today': [],
      'Yesterday': [],
      'Older': []
    };

    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.createdAt);
      transactionDate.setHours(0, 0, 0, 0);

      if (transactionDate.getTime() === today.getTime()) {
        groups['Today'].push(transaction);
      } else if (transactionDate.getTime() === yesterday.getTime()) {
        groups['Yesterday'].push(transaction);
      } else {
        groups['Older'].push(transaction);
      }
    });

    return groups;
  };

  const groupedTransactions = groupTransactionsByDate(transactions);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e27]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-300 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e27]">
      {/* Header */}
      <header className="bg-[#0a0e27] border-b border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">QuickPayX</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="hidden sm:flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-800/50"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 text-gray-400 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50">
              <User className="w-5 h-5" />
              <span className="font-medium">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white px-4 py-2 rounded-xl transition-all flex items-center gap-2 border border-gray-700/50"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Wallet Balance Card */}
        <div className="bg-[#1a1f2e] rounded-2xl p-8 mb-10 shadow-lg border border-gray-800/50">
          <div className="relative">
            <p className="text-gray-400 text-sm font-medium mb-3 uppercase tracking-wide">Total Balance</p>
            <div className={`text-6xl font-bold text-white mb-3 transition-all duration-300 ${balanceAnimating ? 'scale-105' : 'scale-100'}`}>
              ${wallet?.balance.toFixed(2) || '0.00'}
            </div>
            <p className="text-gray-500 text-sm">Available for transfer</p>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <AnalyticsCard
            title="Total Sent"
            value={`$${analytics?.totalSent.toFixed(2) || '0.00'}`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            }
            color="rose"
          />
          <AnalyticsCard
            title="Total Received"
            value={`$${analytics?.totalReceived.toFixed(2) || '0.00'}`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            }
            color="emerald"
          />
          <AnalyticsCard
            title="Transactions"
            value={analytics?.transactionCount || 0}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            color="blue"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Add Money Card */}
          <div className="bg-[#1a1f2e] rounded-2xl p-8 shadow-lg border border-gray-800/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold text-white">Add Money</h2>
            </div>
            <form onSubmit={handleAddMoney} className="space-y-4">
              {addError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {addError}
                </div>
              )}
              <div>
                <label htmlFor="addAmount" className="block text-sm font-medium text-gray-400 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="addAmount"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={addLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-[#1a1f2e] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {addLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Adding...
                  </span>
                ) : (
                  'Add Money'
                )}
              </button>
            </form>
          </div>

          {/* Transfer Money Card */}
          <div className="bg-[#1a1f2e] rounded-2xl p-8 shadow-lg border border-gray-800/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <Send className="w-6 h-6 text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold text-white">Transfer Money</h2>
            </div>
            <form onSubmit={handleTransfer} className="space-y-4">
              {transferError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {transferError}
                </div>
              )}
              {validationError && !transferError && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-4 py-3 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {validationError}
                </div>
              )}
              
              {/* Selected User Chip */}
              {receiverName && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {receiverName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{receiverName}</p>
                      <p className="text-gray-400 text-xs">Selected recipient</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setReceiverId('');
                      setReceiverName('');
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              <UserSearch onUserSelect={(id, name) => {
                setReceiverId(id);
                setReceiverName(name);
              }} selectedUserId={receiverId} />
              <div>
                <label htmlFor="transferAmount" className="block text-sm font-medium text-gray-400 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="transferAmount"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={transferLoading || !!validationError}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-[#1a1f2e] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {transferLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Transferring...
                  </span>
                ) : (
                  'Transfer'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Recent Users */}
        <div className="mb-10">
          <RecentUsers onUserSelect={(id, name) => {
            setReceiverId(id);
            setReceiverName(name);
          }} />
        </div>

        {/* Transaction History */}
        <div className="bg-[#1a1f2e] rounded-2xl p-8 shadow-lg border border-gray-800/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Transaction History</h2>
          </div>
          {transactions.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-400">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedTransactions).map(([groupName, groupTransactions]) => {
                if (groupTransactions.length === 0) return null;
                return (
                  <div key={groupName}>
                    <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">{groupName}</h3>
                    <div className="space-y-3">
                      {groupTransactions.map((transaction) => {
                        const isSent = transaction.sender?._id === user?._id;
                        return (
                          <div key={transaction._id} className="bg-gray-900/30 rounded-xl p-4 border border-gray-800/50 hover:bg-gray-800/50 transition-all">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSent ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                                  {isSent ? (
                                    <ArrowUpRight className="w-6 h-6 text-red-400" />
                                  ) : (
                                    <ArrowDownRight className="w-6 h-6 text-emerald-500" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-white font-medium">{isSent ? 'Sent to' : 'Received from'}</p>
                                  <p className="text-gray-400 text-sm">{isSent ? transaction.receiver?.name : transaction.sender?.name}</p>
                                  <p className="text-gray-500 text-xs">{isSent ? transaction.receiver?.email : transaction.sender?.email}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`text-xl font-bold ${isSent ? 'text-red-400' : 'text-emerald-500'}`}>
                                  {isSent ? '-' : '+'}${transaction.amount.toFixed(2)}
                                </p>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  transaction.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                                  transaction.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                  'bg-red-500/10 text-red-500'
                                }`}>
                                  {transaction.status}
                                </span>
                                <p className="text-gray-500 text-xs mt-1">
                                  {new Date(transaction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
