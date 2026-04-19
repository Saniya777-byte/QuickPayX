'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Wallet, User as UserType, SearchResult } from '../../types';
import AppLayout from '../../components/AppLayout';
import UserSearch from '../../components/UserSearch';
import RecentUsers from '../../components/RecentUsers';
import Toast from '../../components/Toast';
import FraudWarningModal from '../../components/FraudWarningModal';
import { Send, AlertCircle, User as UserIcon, CreditCard } from 'lucide-react';

export default function TransferPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState<SearchResult[]>([]);
  
  // Transfer state
  const [receiverId, setReceiverId] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Fraud warning modal state
  const [fraudWarning, setFraudWarning] = useState<{
    isOpen: boolean;
    reason: string;
    amount: number;
    receiverName: string;
  }>({ isOpen: false, reason: '', amount: 0, receiverName: '' });

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
      const [walletData, usersData] = await Promise.all([
        apiService.getWallet(),
        apiService.getRecentUsers()
      ]);
      setWallet(walletData);
      setRecentUsers(usersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Real-time validation
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
        errors.push('Insufficient wallet balance');
      }
    }
    
    setValidationError(errors[0] || '');
  }, [receiverId, transferAmount, wallet]);

  const handleUserSelect = (userId: string, userName: string) => {
    setReceiverId(userId);
    setReceiverName(userName);
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError('');
    setTransferLoading(true);

    try {
      const amount = parseFloat(transferAmount);
      await apiService.transfer({
        receiverId,
        amount
      });
      
      setTransferAmount('');
      setReceiverId('');
      setReceiverName('');
      setToast({ message: 'Transfer successful!', type: 'success' });
      loadData();
    } catch (error: any) {
      if (error.message && error.message.includes('suspicious')) {
        setFraudWarning({
          isOpen: true,
          reason: error.message,
          amount: parseFloat(transferAmount),
          receiverName
        });
      } else {
        setTransferError(error.message || 'Transfer failed');
        setToast({ message: error.message || 'Transfer failed', type: 'error' });
      }
    } finally {
      setTransferLoading(false);
    }
  };

  const handleFraudConfirm = async () => {
    setFraudWarning({ isOpen: false, reason: '', amount: 0, receiverName: '' });
    setTransferLoading(true);

    try {
      await apiService.transfer({
        receiverId,
        amount: parseFloat(transferAmount),
        skipFraudCheck: true
      });
      
      setTransferAmount('');
      setReceiverId('');
      setReceiverName('');
      setToast({ message: 'Transfer successful!', type: 'success' });
      loadData();
    } catch (error: any) {
      setTransferError(error.message || 'Transfer failed');
      setToast({ message: error.message || 'Transfer failed', type: 'error' });
    } finally {
      setTransferLoading(false);
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
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {fraudWarning.isOpen && (
        <FraudWarningModal
          isOpen={fraudWarning.isOpen}
          reason={fraudWarning.reason}
          amount={fraudWarning.amount}
          receiverName={fraudWarning.receiverName}
          onConfirm={handleFraudConfirm}
          onClose={() => setFraudWarning({ isOpen: false, reason: '', amount: 0, receiverName: '' })}
        />
      )}

      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Transfer Money</h1>
          <p className="text-gray-400">Send money to other users instantly</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transfer Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Wallet Balance Card */}
            <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Wallet Balance</p>
                  <p className="text-2xl font-bold text-white">${wallet?.balance?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            </div>

            {/* Transfer Form */}
            <div className="bg-[#1a1f2e] rounded-2xl p-8 shadow-lg border border-gray-800/50">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Send Money</h2>
                  <p className="text-gray-500 text-sm">Transfer to another user</p>
                </div>
              </div>

              <form onSubmit={handleTransfer} className="space-y-6">
                {transferError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {transferError}
                  </div>
                )}

                {/* User Search */}
                <div>
                  <UserSearch onUserSelect={handleUserSelect} selectedUserId={receiverId} />
                </div>

                {/* Selected User */}
                {receiverName && (
                  <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{receiverName}</p>
                        <p className="text-gray-500 text-sm">Recipient selected</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Amount */}
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
                  {validationError && (
                    <p className="text-red-400 text-sm mt-2">{validationError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={transferLoading || !receiverId || !transferAmount || !!validationError}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-[#1a1f2e] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {transferLoading ? 'Sending...' : 'Send Money'}
                </button>
              </form>
            </div>
          </div>

          {/* Recent Users */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50 sticky top-24">
              <h3 className="text-lg font-bold text-white mb-4">Recent Contacts</h3>
              <RecentUsers onUserSelect={handleUserSelect} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
